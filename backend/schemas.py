from pydantic import BaseModel, Field

class GenerateQuizRequest(BaseModel):
    topic: str
    difficulty: str
    count: int = Field(gt=0, le=100)

class QuizGenerationConfig(BaseModel):
    category: str
    topic: str
    difficulty: str
    questions_per_day: int = Field(gt=0, le=100)