from typing import Optional
from fastapi import HTTPException
from database import get_connection

def get_produtos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            p.id_produto,
            p.nome_produto,
            c.nome_classificacao,
            c.usa_tamanho
        FROM produto p
        INNER JOIN classificacao c ON p.id_classificacao = c.id_classificacao
    """)
    produtos = cursor.fetchall()
    conn.close()
    return produtos

def get_classificacao():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT
                id_classificacao,
                nome_classificacao,
                usa_tamanho
            FROM
                classificacao
            ORDER BY
                nome_classificacao
        """)
        classificacoes = cursor.fetchall()
        return classificacoes
    finally:
        conn.close()

def get_tamanhos(id_produto: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.usa_tamanho
        FROM produto p
        JOIN classificacao c ON p.id_classificacao = c.id_classificacao
        WHERE p.id_produto = %s
    """, (id_produto,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    usa_tamanho = result['usa_tamanho']

    if usa_tamanho:
        cursor.execute("""
            SELECT
                t.id_tamanho,
                t.descricao_tamanho,
                cp.preco
            FROM classificacao_preco cp
            JOIN tamanho t ON cp.id_tamanho = t.id_tamanho
            JOIN produto p ON cp.id_classificacao = p.id_classificacao
            WHERE p.id_produto = %s
            ORDER BY t.id_tamanho
        """, (id_produto,))
    else:
        cursor.execute("""
            SELECT
                pp.id_produto_preco,
                pp.preco
            FROM produto_preco pp
            WHERE pp.id_produto = %s
        """, (id_produto,))

    tamanhos = cursor.fetchall()
    conn.close()
    return tamanhos

def add_produto(
    nome_produto: str,
    descricao: Optional[str],
    id_classificacao: int,
    usa_tamanho: bool,
    preco: Optional[float] = None
):
    conn = get_connection()
    cursor = conn.cursor()
    desc_db = descricao if usa_tamanho else None
    cursor.execute(
        "INSERT INTO produto (nome_produto, descricao, id_classificacao) VALUES (%s, %s, %s)",
        (nome_produto, desc_db, id_classificacao)
    )
    produto_id = cursor.lastrowid

    if not usa_tamanho:
        cursor.execute(
            "INSERT INTO produto_preco (id_produto, preco) VALUES (%s, %s)",
            (produto_id, preco)
        )

    conn.commit()
    conn.close()
    return {"message": "Produto adicionado com sucesso", "id_produto": produto_id}

def update_produto(
    id_produto: int,
    nome_produto: str,
    descricao: Optional[str],
    id_classificacao: int,
    usa_tamanho: bool,
    preco: Optional[float] = None
):
    conn = get_connection()
    cursor = conn.cursor()

    desc_db = descricao if usa_tamanho else None
    cursor.execute(
        """
        UPDATE produto
           SET nome_produto    = %s,
               descricao       = %s,
               id_classificacao= %s
         WHERE id_produto      = %s
        """,
        (nome_produto, desc_db, id_classificacao, id_produto)
    )

    if not usa_tamanho:
        if preco is None:
            raise HTTPException(
                status_code=400,
                detail="Para usa_tamanho=False, o campo 'preco' é obrigatório."
            )
        cursor.execute(
            "UPDATE produto_preco SET preco = %s WHERE id_produto = %s",
            (preco, id_produto)
        )
        if cursor.rowcount == 0:
            cursor.execute(
                "INSERT INTO produto_preco (id_produto, preco) VALUES (%s, %s)",
                (id_produto, preco)
            )

    conn.commit()
    conn.close()
    return {"message": "Produto atualizado com sucesso"}

def delete_produto(id_produto: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM produto WHERE id_produto = %s", (id_produto,))
    conn.commit()
    conn.close()
    return {"message": "Produto deletado com sucesso"}
