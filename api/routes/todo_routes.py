from fastapi import APIRouter, Form, Path
from services.todo_service import get_tasks, add_task, delete_task

router = APIRouter()

@router.get("/get_tasks")
def list_tasks():
    return get_tasks()

@router.post("/add_task")
def create_task(task: str = Form(...)):
    return add_task(task)

@router.delete("/delete_task/{id}")
def remove_task(id: int = Path(...)):
    return delete_task(id)
