from fastapi import FastAPI
from sqlalchemy import text
from schemas import *
import database
import json
from quiz_service import generate_quizzes_logic, publish_quizzes_logic
from scheduler import start_scheduler
from routes.quiz_routes import router as quiz_router
from routes.config_routes import router as config_router
from routes.log_routes import router as log_router

import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()
app.include_router(quiz_router)
app.include_router(config_router)
app.include_router(log_router)

@app.get("/")
def home():
    return {
        "message": "Quiz Automation Backend Running"
    }

@app.post("/quizzes/generate")
def generate_quizzes():
    return generate_quizzes_logic()

@app.post("/quizzes/publish")
def publish_quizzes():
    return publish_quizzes_logic()

@app.get("/gemini-test")
def gemini_test():

    model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

    response = model.generate_content(
        "Say hello in one sentence."
    )

    return {
        "response": response.text
    }

@app.on_event("startup")
def startup_event():
    print("Starting scheduler...")
    start_scheduler()

    