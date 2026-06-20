from sqlalchemy import text
from schemas import *
import database
import google.generativeai as genai
import os
from dotenv import load_dotenv
from logger_service import log_job
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_quizzes_logic():
    
    with database.engine.begin() as connection:
        try:
            print("Generate job triggered")
            result = connection.execute(
            text(
                "SELECT * FROM quiz_generation_config "
                "WHERE is_active = 1 "
                "LIMIT 1"
                )
            )

            config = result.fetchone()

            if config is None:
                return {
                    "success": False,
                    "message": "No active configuration found"
                }

            config = dict(config._mapping)
            prompt = f"""
            Generate {config['questions_per_day'] + 5} UNIQUE multiple choice questions.

            Category: {config['category']}
            Topic: {config['topic']}
            Difficulty: {config['difficulty']}

            Return ONLY valid JSON.

            Format:

            [
                {{
                    "question": "...",
                    "option_a": "...",
                    "option_b": "...",
                    "option_c": "...",
                    "option_d": "...",
                    "correct_answer": "A",
                    "explanation": "..."
                }}
            ]
            """
            model = genai.GenerativeModel(
                "gemini-2.5-flash"
            )

            response = model.generate_content(
                prompt
            )
            response_text = response.text

            response_text = response_text.replace(
                "```json",
                ""
            )

            response_text = response_text.replace(
                "```",
                ""
            )

            response_text = response_text.strip()

            try:
                quizzes = json.loads(response_text)
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "message": "Gemini returned invalid JSON"
                }
            
            inserted_count = 0
            duplicate_count = 0
            required_count = config["questions_per_day"]
            
            for quiz in quizzes:
                if inserted_count >= required_count:
                    break
                quiz["category"] = config["category"]
                quiz["topic"] = config["topic"]
                quiz["difficulty"] = config["difficulty"]
                quiz["status"] = "PENDING"
                duplicate_result = connection.execute(
                text(
                        """
                        SELECT id
                        FROM quizzes
                        WHERE question = :question
                        LIMIT 1
                        """
                    ),
                    {
                        "question": quiz["question"]
                    }
                )

                duplicate_row = duplicate_result.fetchone()

                if duplicate_row is not None:
                    duplicate_count += 1
                    continue
                
                connection.execute(
                    text(
                        """INSERT INTO quizzes (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, topic, difficulty, status) 
                        VALUES (:question, :option_a, :option_b, :option_c, :option_d, :correct_answer, :explanation, :category, :topic, :difficulty, :status)"""
                        ),
                    quiz
                )
                inserted_count += 1
            log_job(
                connection,
                "generate",
                "success",
                f"Generated {inserted_count} quizzes. Skipped {duplicate_count} duplicates."
            )
        except Exception as e:
            log_job(
                connection,
                "generate",
                "failed",
                str(e)
            )
            
        return {
            "generated": len(quizzes),
            "inserted": inserted_count,
            "duplicates_skipped": duplicate_count
        }


def publish_quizzes_logic():
    try:
        with database.engine.begin() as connection:
            print("Publish job triggered")
            config_result = connection.execute(
                text("SELECT questions_per_day FROM quiz_generation_config WHERE is_active = 1 LIMIT 1;")
            )
            config = config_result.fetchone()

            if config is None:
                return {
                    "success": False,
                    "message": "No active config found"
                }
            config = dict(config._mapping)

            approved_result = connection.execute(
                text(
                    """
                    SELECT id
                    FROM quizzes
                    WHERE status = 'APPROVED'
                    ORDER BY id
                    LIMIT :limit_count
                    """
                ),
                {
                    "limit_count": config["questions_per_day"]
                }
            )
            approved_ids = []
            for row in approved_result:
                approved_ids.append(row.id)
            if len(approved_ids) == 0:
                return {
                    "success": True,
                    "published": 0
                } 
            placeholders = ",".join(
                str(id) for id in approved_ids
            )
            connection.execute(
                text(
                    f"""
                    UPDATE quizzes
                    SET status='PUBLISHED',
                    published_at=NOW()
                    WHERE id IN ({placeholders})
                    """
                )
            )
            published_count = len(approved_ids)
            log_job(
                connection,
                "publish",
                "success",
                f"Published {published_count} quizzes."
            )
    except Exception as e:
        log_job(
            connection,
            "publish",
            "failed",
            str(e)
        )
    return {
            "success": True,
            "published": len(approved_ids),
            "published_ids": approved_ids
        }    
    