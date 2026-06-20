from apscheduler.schedulers.background import BackgroundScheduler
from quiz_service import generate_quizzes_logic
from quiz_service import publish_quizzes_logic

scheduler = BackgroundScheduler()

scheduler.add_job(
    generate_quizzes_logic,
    "cron",
    hour=8,
    minute=0,
    id="generate_quizzes"
)

scheduler.add_job(
    publish_quizzes_logic,
    "cron",
    hour=9,
    minute=0,
    id="publish_quizzes"
)


def start_scheduler():
    scheduler.start()