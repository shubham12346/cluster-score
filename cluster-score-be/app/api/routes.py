from fastapi import APIRouter, HTTPException
from app.models.schemas import SheetScoringRequest, SheetHeaderRequest
from app.services.scorer import process_sheet
import requests
import csv
from io import StringIO

router = APIRouter()

@router.post("/score-sheet")
async def score_sheet(payload: SheetScoringRequest):
    result = process_sheet(
        sheet_url=payload.spreadsheet_url,
        worksheet_name=payload.worksheet_name,
        input_column=payload.input_column,
        output_columns=payload.output_columns,
        prompt_template=payload.prompt_template
    )
    return {"status": "completed", "rows_processed": result}


@router.post("/get-headers")
async def get_headers(payload: SheetHeaderRequest):
    try:
        # Extract sheet ID
        if "docs.google.com" in payload.spreadsheet_url:
            sheet_id = payload.spreadsheet_url.split("/d/")[1].split("/")[0]
            csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={payload.worksheet_name}"
        else:
            raise HTTPException(status_code=400, detail="Invalid Google Sheet URL")

        # Fetch CSV
        response = requests.get(csv_url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Failed to fetch sheet")

        # Extract headers
        content = response.content.decode("utf-8")
        reader = csv.reader(StringIO(content))
        headers = next(reader)

        return {"headers": headers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
