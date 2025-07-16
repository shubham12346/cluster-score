def process_sheet(sheet_url: str, worksheet_name: str, input_column: str,
                  output_columns: list, prompt_template: str,
                  webhook_url: str = None):
    import gspread
    import time
    import random
    import json
    from app.core.config import settings
    from app.services.llm_prompt import get_gemini_response
    from app.core.redis import save_progress, r  # ⬅️ make sure to import r here

    # Mark as processing started
    r.hset("progress", "status", json.dumps({"status": "processing"}))

    creds_dict = settings.get_google_creds_dict()
    gc = gspread.service_account_from_dict(creds_dict)
    sh = gc.open_by_url(sheet_url)
    worksheet = sh.worksheet(worksheet_name)

    headers = worksheet.row_values(1)
    existing_headers = set(headers)

    for col in output_columns:
        if col not in existing_headers:
            headers.append(col)
            worksheet.update_cell(1, len(headers), col)

    col_indices = {header: idx + 1 for idx, header in enumerate(headers)}

    input_col_idx = col_indices[input_column]
    score_col_idx = col_indices[output_columns[0]]
    reason_col_idx = col_indices[output_columns[1]]

    data = worksheet.get_all_records(expected_headers=headers)
    limited_data = data[:15]  # ✅ Only take first 15 rows

    print(f"[Processor] Starting processing first {len(limited_data)} rows...")

    updates = []

    for i, row in enumerate(limited_data):
        row_number = i + 2  # +2 to skip header (row 1) and be 1-indexed

        prompt_input = str(row.get(input_column, "")).strip()
        if not prompt_input:
            continue

        prompt = f"{prompt_template} {prompt_input}"
        print(f"[Row {row_number}] Prompt: {prompt}")

        try:
            score, reason = get_gemini_response(prompt)
            status = "success"
        except Exception as e:
            score, reason = "Error", str(e)
            status = "error"

        updates.append((row_number, score_col_idx, score))
        updates.append((row_number, reason_col_idx, reason))

        # ✅ Save to Redis
        save_progress(row_number, {
            "row": row_number,
            "keyword": prompt_input,
            "score": score,
            "reason": reason,
            "status": status
        })

        print(f"[Row {row_number}] ✅ Processed → {status.upper()}")

    try:
        _batch_update_cells(worksheet, updates)
    except Exception as e:
        print(f"⚠️ Error during batch update: {e}")
        _retry_with_backoff(_batch_update_cells, worksheet, updates)

    # ✅ Now mark as completed (after all rows and batch update)
    r.hset("progress", "status", json.dumps({"status": "completed"}))

    return len(limited_data)




def _batch_update_cells(worksheet, updates):
    # Example implementation: batch update cells in Google Sheets
    for row, col, value in updates:
        worksheet.update_cell(row, col, value)

import time
import random

def _retry_with_backoff(func, *args, retries=3, **kwargs):
    delay = 1
    for attempt in range(retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == retries - 1:
                raise
            time.sleep(delay)
            delay *= 2 + random.random()