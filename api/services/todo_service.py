from database import get_connection

def get_tasks():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM todo")
    records = cursor.fetchall()
    conn.close()
    return records

def add_task(task: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO todo (task) VALUES (%s)", (task,))
    conn.commit()
    conn.close()
    return {"message": "Added successfully"}

def delete_task(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM todo WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"message": "Deleted successfully"}
