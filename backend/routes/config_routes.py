from fastapi import APIRouter
from sqlalchemy import text
from schemas import *
import database
import json
from quiz_service import generate_quizzes_logic, publish_quizzes_logic
from scheduler import start_scheduler

router = APIRouter(
    prefix="/config",
    tags=["Config"]
)

@router.post("")
def save_config(config: QuizGenerationConfig):
    with database.engine.begin() as connection:
        connection.execute(
            text("UPDATE quiz_generation_config SET is_active = 0")
        )
        connection.execute(
            text("INSERT INTO quiz_generation_config (category, topic, difficulty, questions_per_day, is_active) VALUES (:category, :topic, :difficulty, :questions_per_day, :is_active)"),
            {
                "category" : config.category,
                "topic" : config.topic,
                "difficulty" : config.difficulty,
                "questions_per_day" : config.questions_per_day,
                "is_active" : 1
            }
        )
        return {
            "success": True,
            "message": "Configuration saved successfully"
        }

@router.get("/active")
def get_active_config ():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM quiz_generation_config WHERE is_active = 1 LIMIT 1")
        )

        row = result.fetchone()
        
        if row is None:
            return {
                "success": False,
                "message": "No active configuration found"
            }
        
        return dict(row._mapping)
