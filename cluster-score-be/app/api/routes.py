from fastapi import APIRouter, HTTPException
from fastapi import BackgroundTasks

from app.models.schemas import SheetScoringRequest, SheetHeaderRequest
from app.services.scorer import process_sheet
from app.core.redis import get_all_progress, clear_progress
import requests
import csv
from io import StringIO

router = APIRouter()

@router.post("/score-sheet")
async def score_sheet(payload: SheetScoringRequest, background_tasks: BackgroundTasks):
    clear_progress()
    background_tasks.add_task(
        process_sheet,
        sheet_url=payload.spreadsheet_url,
        worksheet_name=payload.worksheet_name,
        input_column=payload.input_column,
        output_columns=payload.output_columns,
        prompt_template=payload.prompt_template,
        webhook_url=''
    )
    return {"status": "processing started"}


@router.get("/progress")
async def get_progress():
    return get_all_progress()


@router.post("/get-headers")
async def get_headers(payload: SheetHeaderRequest):
    try:
        if "docs.google.com" in payload.spreadsheet_url:
            sheet_id = payload.spreadsheet_url.split("/d/")[1].split("/")[0]
            csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={payload.worksheet_name}"
        else:
            raise HTTPException(status_code=400, detail="Invalid Google Sheet URL")

        response = requests.get(csv_url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to fetch sheet")

        content = response.content.decode("utf-8")
        reader = csv.reader(StringIO(content))
        headers = next(reader)

        return {"headers": headers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
