from database import get_connection

def get_sacolas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT s.pedido_id,p.nome AS nome_produto,s.quantidade,s.subtotal FROM sacola s JOIN produto p ON s.produto_id = p.id;")
    sacolas = cursor.fetchall()
    conn.close()
    return sacolas

def add_sacola(itens):
    conn = get_connection()
    cursor = conn.cursor()

    if not itens or not isinstance(itens, list):
        conn.close()
        return {"erro": "Nenhum item fornecido"}

    pedido_id = itens[0].get("pedido_id", None)

    if not pedido_id:
        cursor.execute("SELECT MAX(id) FROM pedido")
        resultado = cursor.fetchone()
        pedido_id = resultado[0]

    if not pedido_id:
        conn.close()
        return {"erro": "Nenhum pedido encontrado"}

    for item in itens:
        produto_id = item.get("produto_id")
        quantidade = item.get("quantidade")

        if not produto_id or not quantidade:
            continue

        cursor.execute("""
            INSERT INTO sacola (pedido_id, produto_id, quantidade)
            VALUES (%s, %s, %s)
        """, (pedido_id, produto_id, quantidade))

    conn.commit()
    conn.close()

    return {"pedido_id": pedido_id, "status": "Itens adicionados à sacola com sucesso"}
