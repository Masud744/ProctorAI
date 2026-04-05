from pydantic import BaseModel
from typing import Optional


class MonitoringLog(BaseModel):
    student_id: str
    student_name: Optional[str] = None
    attention_score: int
    suspicious_score: int
    phone_detected: bool
    talking: bool
    eyes_closed: bool
    looking_forward: bool
    face_count: int
    multiple_faces: bool
    face_present: bool