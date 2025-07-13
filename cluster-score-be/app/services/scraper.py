from fastapi import APIRouter
from app.services.google_sheets import get_sheet_data, update_sheet_data
from app.services.llm_prompt import score_data

router = APIRouter()

@router.get("/score-sheet/")
def score_google_sheet(sheet_id: str, worksheet_name: str):
    data = get_sheet_data(sheet_id, worksheet_name)
    scored_data = score_data(data)

    for i, row in enumerate(scored_data, start=2):  # assuming row 1 is header
        update_sheet_data(sheet_id, worksheet_name, i, len(row), row['score'])

    return {"message": "Sheet scored and updated", "rows": len(scored_data)}
    