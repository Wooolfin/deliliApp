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
