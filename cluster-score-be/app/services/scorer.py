# import gspread
# from app.core.config import settings
# from app.core.gemini import get_gemini_score
# import time


# def process_sheet(sheet_url: str, worksheet_name: str, input_column: str, output_columns: list, prompt_template: str):
#     creds_dict = settings.get_google_creds_dict()
#     gc = gspread.service_account_from_dict(creds_dict)

#     sh = gc.open_by_url(sheet_url)
#     worksheet = sh.worksheet(worksheet_name)

#     input_col = input_column
#     output_score_col, output_reason_col = output_columns

#     # Get current headers
#     headers = worksheet.row_values(1)

#     # Track column indices
#     updated = False
#     if output_score_col not in headers:
#         headers.append(output_score_col)
#         worksheet.update_cell(1, len(headers), output_score_col)
#         updated = True

#     if output_reason_col not in headers:
#         headers.append(output_reason_col)
#         worksheet.update_cell(1, len(headers), output_reason_col)
#         updated = True

#     # Remove potential duplicates from headers before passing to get_all_records
#     deduped_headers = []
#     seen = set()
#     for h in headers:
#         if h not in seen:
#             deduped_headers.append(h)
#             seen.add(h)

#     # Safely fetch records
#     data = worksheet.get_all_records(expected_headers=deduped_headers)

#     score_index = deduped_headers.index(output_score_col) + 1
#     reason_index = deduped_headers.index(output_reason_col) + 1

#     for idx, row in enumerate(data, start=2):
#         prompt_input = row.get(input_col, "")
#         if not prompt_input.strip():
#             continue

#         prompt = f"{prompt_template} {prompt_input.strip()}"
#         score, reason = get_gemini_score(prompt)

#         worksheet.update_cell(idx, score_index, score)
#         worksheet.update_cell(idx, reason_index, reason)
#         time.sleep(1)  # Add delay to avoid hitting quota


#     return len(data)
def process_sheet(sheet_url: str, worksheet_name: str, input_column: str, output_columns: list, prompt_template: str):
    import gspread
    from app.core.config import settings
    from app.services.llm_prompt import get_gemini_response  # adjust if different

    creds_dict = settings.get_google_creds_dict()
    gc = gspread.service_account_from_dict(creds_dict)

    sh = gc.open_by_url(sheet_url)
    worksheet = sh.worksheet(worksheet_name)

    # Get existing headers from the sheet
    headers = worksheet.row_values(1)
    existing_headers = set(headers)

    # Ensure output columns exist, add if missing
    for col in output_columns:
        if col not in existing_headers:
            headers.append(col)
            worksheet.update_cell(1, len(headers), col)

    # Recalculate column positions (1-indexed)
    col_indices = {header: idx + 1 for idx, header in enumerate(headers)}

    input_col_idx = col_indices[input_column]
    score_col_idx = col_indices[output_columns[0]]
    reason_col_idx = col_indices[output_columns[1]]

    # Read rows as list of dicts
    data = worksheet.get_all_records(expected_headers=headers)

    for idx, row in enumerate(data[:10], start=2):  # Only process first 10 data rows (rows 2–11)
        prompt_input = row.get(input_column, "")
        if not prompt_input.strip():
            continue

        prompt = f"{prompt_template} {prompt_input.strip()}"

        try:
            score, reason = get_gemini_response(prompt)
        except Exception as e:
            score = "Error"
            reason = str(e)

        print(f"[Row {idx}] Prompt: {prompt}")
        print(f"[Row {idx}] Score: {score} | Reason: {reason}")

        worksheet.update_cell(idx, score_col_idx, score)
        worksheet.update_cell(idx, reason_col_idx, reason)
        print(f"[Row {idx}] ✅ Updated")

    return len(data)
