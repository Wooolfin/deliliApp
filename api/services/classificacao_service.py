from database import get_connection

def get_classificacao():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM classificacao")
    classificacao = cursor.fetchall()
    conn.close()
    return classificacao

def get_tamanho(id_classificacao: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            t.id_tamanho,
            t.descricao_tamanho,
            pp.preco
        FROM 
            produto_preco pp
        JOIN 
            tamanho t ON pp.id_tamanho = t.id_tamanho
        JOIN 
            produto p ON pp.id_produto = p.id_produto
        WHERE 
            p.id_classificacao = %s
    """, (id_classificacao,))

    tamanhos = cursor.fetchall()
    conn.close()
    return tamanhos

def get_produtos(id_classificacao: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.id_produto,
            p.nome_produto,
            pp.preco
        FROM 
            produto p
        JOIN 
            produto_preco pp ON p.id_produto = pp.id_produto
        WHERE 
            p.id_classificacao = %s
    """, (id_classificacao,))

    produtos = cursor.fetchall()
    conn.close()
    return produtos
    
def update_preco_tamanho(id_classificacao: int, precos_tamanhos: list):
    conn = get_connection()
    cursor = conn.cursor()

    for item in precos_tamanhos:
        id_tamanho = item['id_tamanho']
        novo_preco = item['preco']

        cursor.execute("""
            UPDATE produto_preco pp
            JOIN produto p ON pp.id_produto = p.id_produto
            SET pp.preco = %s
            WHERE p.id_classificacao = %s AND pp.id_tamanho = %s
        """, (novo_preco, id_classificacao, id_tamanho))

    conn.commit()
    conn.close()

    return {"status": "Preços atualizados com sucesso"}


def update_preco_produto(id_classificacao: int, precos_produtos: list):
    conn = get_connection()
    cursor = conn.cursor()

    for item in precos_produtos:
        id_produto = item['id_produto']
        novo_preco = item['preco']

        cursor.execute("""
            UPDATE produto_preco pp
            JOIN produto p ON pp.id_produto = p.id_produto
            SET pp.preco = %s
            WHERE p.id_classificacao = %s AND pp.id_produto = %s AND pp.id_tamanho IS NULL
        """, (novo_preco, id_classificacao, id_produto))

    conn.commit()
    conn.close()

    return {"status": "Preços dos produtos atualizados com sucesso"}
