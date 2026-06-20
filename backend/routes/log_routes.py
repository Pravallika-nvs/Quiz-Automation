from fastapi import APIRouter
from sqlalchemy import text
import database

router = APIRouter(
    prefix="/logs",
    tags=["Logs"]
)

@router.get("")
def get_logs():
    with database.engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT *
                FROM scheduler_logs
                ORDER BY created_at DESC
            """)
        )

        logs = []

        for row in result:
            logs.append(dict(row._mapping))

        return logs