from database import get_connection

def get_pratos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pratos")
    pratos = cursor.fetchall()
    conn.close()
    return pratos

def add_prato(nome: str, descricao: str, valor: float):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO pratos (nome, descricao, valor) VALUES (%s, %s, %s)",
        (nome, descricao, valor)
    )
    conn.commit()
    conn.close()
    return {"message": "Prato adicionado com sucesso"}

def delete_prato(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pratos WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    return {"message": "Prato deletado com sucesso"}
