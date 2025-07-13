from pydantic import BaseModel
from typing import List

class SheetScoringRequest(BaseModel):
    spreadsheet_url: str
    worksheet_name: str
    input_column: str
    output_columns: List[str]
    prompt_template: str


class SheetHeaderRequest(BaseModel):
    spreadsheet_url: str
    worksheet_name: str