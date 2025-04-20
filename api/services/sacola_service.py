from database import get_connection

def get_sacolas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT s.pedido_id,p.nome AS nome_prato,s.quantidade,s.subtotal FROM sacola s JOIN pratos p ON s.produto_id = p.id;")
    sacolas = cursor.fetchall()
    conn.close()
    return sacolas

def add_sacola(itens):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT MAX(id) FROM pedido")
    resultado = cursor.fetchone()
    pedido_id = resultado[0]

    if not pedido_id:
        conn.close()
        return {"erro": "Nenhum pedido encontrado"}

    for item in itens:
        cursor.execute("""
            INSERT INTO sacola (pedido_id, produto_id, quantidade)
            VALUES (%s, %s, %s)
        """, (pedido_id, item["produto_id"], item["quantidade"]))

    conn.commit()
    conn.close()

    return {"pedido_id": pedido_id, "status": "Itens adicionados à sacola com sucesso"}