from pydantic_settings import BaseSettings
from pydantic import Field
import json

class Settings(BaseSettings):
    google_service_account_json: str = Field(..., env="google_service_account_json")
    gemini_api_key: str = Field(..., env="gemini_api_key")

    def debug_print(self):
        print("[DEBUG] google_service_account_json (truncated):", str(self.google_service_account_json)[:40])
        print("[DEBUG] gemini_api_key:", self.gemini_api_key)

    def get_google_creds_dict(self):
        return json.loads(self.google_service_account_json)

    class Config:
        env_file = ".env"

settings = Settings()
settings.debug_print()
