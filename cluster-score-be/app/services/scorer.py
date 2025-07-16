def process_sheet(sheet_url: str, worksheet_name: str, input_column: str,
                  output_columns: list, prompt_template: str,
                  webhook_url: str = None):
    import gspread
    import time
    import random
    from app.core.config import settings
    from app.services.llm_prompt import get_gemini_response
    from app.core.redis import save_progress

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
    batch_size = 50
    total_rows = min(20, len(data))
    processed_count = 0

    print(f"[Processor] Starting processing {total_rows} rows...")

    for batch_start in range(0, total_rows, batch_size):
        batch = data[batch_start: batch_start + batch_size]
        updates = []

        for i, row in enumerate(batch):
            row_number = batch_start + i + 2
            prompt_input = row.get(input_column, "").strip()

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

        processed_count += len(batch)

    return processed_count


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