from fastapi import FastAPI
from app.api.routes import router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI(title="Cluster Scorer API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set to ["http://localhost:5173"] if using Vite
    allow_credentials=True,
    allow_methods=["*"],  # Allow POST, OPTIONS, etc.
    allow_headers=["*"],  # Allow all headers like Content-Type, Authorization
)
app.include_router(router)  