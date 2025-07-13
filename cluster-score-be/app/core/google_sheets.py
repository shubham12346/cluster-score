import gspread
from oauth2client.service_account import ServiceAccountCredentials
from app.core.config import settings

def get_worksheet(sheet_url: str, worksheet_name: str):
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/drive'
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        settings.google_service_account_json, scope
    )
    client = gspread.authorize(creds)
    spreadsheet = client.open_by_url(sheet_url)
    return spreadsheet.worksheet(worksheet_name)
