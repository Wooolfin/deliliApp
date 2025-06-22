from database import get_connection

def get_produtos_pedido():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            c.id_classificacao,
            c.nome_classificacao,
            c.usa_tamanho,
            p.id_produto,
            p.nome_produto,
            p.descricao,
            t.descricao_tamanho,
            cp.id_classificacao_preco,   
            cp.preco AS preco_classificacao,
            pp.id_produto_preco,    
            pp.preco AS preco_unico
        FROM produto p
        JOIN classificacao c ON p.id_classificacao = c.id_classificacao
        LEFT JOIN classificacao_preco cp ON cp.id_classificacao = c.id_classificacao
        LEFT JOIN tamanho t ON cp.id_tamanho = t.id_tamanho
        LEFT JOIN produto_preco pp ON pp.id_produto = p.id_produto
        ORDER BY p.id_produto, cp.id_classificacao_preco, pp.id_produto_preco
    """)

    rows = cursor.fetchall()
    conn.close()

    produtos_dict = {}

    for row in rows:
        pid = row["id_produto"]

        if pid not in produtos_dict:
            produtos_dict[pid] = {
                "id_classificacao": row["id_classificacao"],
                "nome_classificacao": row["nome_classificacao"],
                "usa_tamanho": row["usa_tamanho"],
                "id_produto": row["id_produto"],
                "nome_produto": row["nome_produto"],
                "descricao": row["descricao"],
                "preco_unico": None,
                "classificacao_preco": []
            }

        if row["usa_tamanho"] == 1 and row["descricao_tamanho"]:
            produtos_dict[pid]["classificacao_preco"].append({
                "id_classificacao_preco": row["id_classificacao_preco"], 
                "descricao_tamanho": row["descricao_tamanho"],
                "preco": float(row["preco_classificacao"])
            })

        elif row["usa_tamanho"] == 0 and row["preco_unico"] is not None:
            produtos_dict[pid]["preco_unico"] = float(row["preco_unico"])

        if row["id_produto_preco"]:
            produtos_dict[pid]["id_produto_preco"] = row["id_produto_preco"]

    return list(produtos_dict.values())


def get_pedidos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM pedido ORDER BY data DESC")
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