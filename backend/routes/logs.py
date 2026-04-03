from fastapi import APIRouter
from backend.models import MonitoringLog
from backend.database import supabase

router = APIRouter()

@router.post("/log")
def save_log(log: MonitoringLog):
    data = log.dict()
    response = supabase.table("monitoring_logs").insert(data).execute()
    return {"status": "saved", "data": response.data}

@router.get("/logs/{student_id}")
def get_logs(student_id: str):
    response = supabase.table("monitoring_logs")\
        .select("*")\
        .eq("student_id", student_id)\
        .order("created_at", desc=True)\
        .execute()
    return {"logs": response.data}

@router.get("/logs")
def get_all_logs():
    response = supabase.table("monitoring_logs")\
        .select("*")\
        .order("created_at", desc=True)\
        .limit(100)\
        .execute()
    return {"logs": response.data}