from database import get_connection

def get_pedidos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pedido")
    pedidos = cursor.fetchall()
    conn.close()
    return pedidos

def add_pedido(cliente):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO pedido (cliente, telefone, endereco)
        VALUES (%s, %s, %s)
    """, (cliente.cliente, cliente.telefone, cliente.endereco))
    pedido_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"pedido_id": pedido_id, "status": "Pedido criado com sucesso"}