from typing import Optional
from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel, Field

from services.produtos_service import (
    get_produtos,
    get_classificacao,
    add_produto,
    delete_produto,
    update_produto,
    get_tamanhos,
)

router = APIRouter()

class ProdutoRequest(BaseModel):
    id_produto: int
    nome_produto: str
    descricao: Optional[str] = Field(None, example="Opção de marmita saudável")
    id_classificacao: int
    usa_tamanho: bool
    preco: Optional[float] = Field(None, example=25.50, description="Obrigatório quando usa_tamanho=False")

class UpdateRequest(BaseModel):
    nome_produto: str
    descricao: Optional[str] = Field(None, example="Opção de marmita saudável")
    usa_tamanho: bool
    classificacao: Optional[int] = Field(None, description="ID da classificação do produto")

@router.get("/get_produtos")
def list_produtos():
    return get_produtos()

@router.get("/get_classificacao")
def list_classificacoes():
    return get_classificacao()

@router.get("/produtos/{id_produto}/tamanhos")
def obter_tamanhos(id_produto: int = Path(..., gt=0)):
    return get_tamanhos(id_produto)

@router.post("/add_produto")
def create_produto(produto: ProdutoRequest):
    if produto.usa_tamanho:
        if produto.preco:
            raise HTTPException(status_code=400, detail="Preços para tamanhos não são obrigatórios quando 'usa_tamanho' é True")
    else:
        if produto.preco is None:
            raise HTTPException(status_code=400, detail="Preço é obrigatório quando 'usa_tamanho' é False")

    return add_produto(
        nome_produto=produto.nome_produto,
        descricao=produto.descricao,
        id_classificacao=produto.id_classificacao,
        usa_tamanho=produto.usa_tamanho,
        preco=produto.preco,
    )

@router.put("/update_produto/{id_produto}")
def edit_produto(id_produto: int, produto: UpdateRequest):
    if not produto.usa_tamanho and produto.descricao is not None:
        raise HTTPException(status_code=400, detail="Para usa_tamanho=False, 'descricao' deve ser None.")
    
    return update_produto(
        id_produto=id_produto,
        nome_produto=produto.nome_produto,
        descricao=produto.descricao,  
        usa_tamanho=produto.usa_tamanho,
    )



@router.delete("/delete_produto/{id_produto}")
def remove_produto(id_produto: int = Path(..., gt=0)):
    return delete_produto(id_produto)
