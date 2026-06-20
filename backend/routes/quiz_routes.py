from fastapi import APIRouter
from sqlalchemy import text
from schemas import *
import database
import json
from quiz_service import generate_quizzes_logic, publish_quizzes_logic
from scheduler import start_scheduler

router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"]
)

@router.get("/test")
def test():
    return {
        "message": "Quiz router working"
    }
    
@router.get("")
def get_quizzes():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM quizzes")
        )

        quizzes = []

        for row in result:
            quizzes.append(dict(row._mapping))

        return quizzes
    
@router.get("/pending")
def get_pending_quizzes():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("SELECT * FROM quizzes WHERE status = 'PENDING'")
        )

        pending_quizzes = []

        for row in result:
            pending_quizzes.append(dict(row._mapping))
        
        return pending_quizzes
    
@router.post("/{quiz_id}/approve")
def approve_quiz(quiz_id: int):
    with database.engine.begin() as connection:
        result = connection.execute(
            text("UPDATE quizzes "
                 "SET status = 'APPROVED' "
                 "WHERE id=:quiz_id"),
                 {"quiz_id": quiz_id}
        ) 

        if result.rowcount == 0:
            return {
                "success": False,
                "message": "Quiz not found"
            }
        return {
            "success": True,
            "message": f"Quiz {quiz_id} approved"
        } 

@router.post("/{quiz_id}/reject")
def reject_quiz(quiz_id: int):
    with database.engine.begin() as connection:
        result = connection.execute(
            text("UPDATE quizzes "
                 "SET status = 'REJECTED' "
                 "WHERE id=:quiz_id"),
                 {"quiz_id": quiz_id}
        )       

        if result.rowcount == 0:
            return {
                "success": False,
                "message": "Quiz not found"
            }
        return {
            "success": True,
            "message": f"Quiz {quiz_id} rejected"
        } 
        
@router.get("/approved")
def get_approved_quizzes():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT *
                FROM quizzes
                WHERE status = 'APPROVED'
                ORDER BY id DESC
            """)
        )

        quizzes = []

        for row in result:
            quizzes.append(dict(row._mapping))

        return quizzes
    
@router.get("/rejected")
def get_rejected_quizzes():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT *
                FROM quizzes
                WHERE status = 'REJECTED'
                ORDER BY id DESC
            """)
        )

        quizzes = []

        for row in result:
            quizzes.append(dict(row._mapping))

        return quizzes
    
@router.get("/published")
def get_published_quizzes():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT *
                FROM quizzes
                WHERE status = 'PUBLISHED'
                ORDER BY id DESC
            """)
        )

        quizzes = []

        for row in result:
            quizzes.append(dict(row._mapping))

        return quizzes