from sqlalchemy import text
from schemas import *
import database
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

def log_job(connection, job_name, status, message):
    connection.execute(
        text("""
            INSERT INTO scheduler_logs
            (job_name, status, message)
            VALUES
            (:job_name, :status, :message)
        """),
        {
            "job_name": job_name,
            "status": status,
            "message": message
        }
    )