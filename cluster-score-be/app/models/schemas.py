
from pydantic import BaseModel
from typing import List, Optional

class SheetScoringRequest(BaseModel):
    spreadsheet_url: str
    worksheet_name: str
    input_column: str
    output_columns: List[str]
    prompt_template: str
    webhook_url: Optional[str] = None  # Optional for future


class SheetHeaderRequest(BaseModel):
    spreadsheet_url: str
    worksheet_name: str