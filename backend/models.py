from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MonitoringLog(BaseModel):
    student_id: str
    attention_score: int
    suspicious_score: int
    phone_detected: bool
    talking: bool
    eyes_closed: bool
    looking_forward: bool
    face_count: int
    multiple_faces: bool
    face_present: bool