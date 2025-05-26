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
    nome_produto: str = Field(..., example="Marmita Fit")
    descricao: Optional[str] = Field(None, example="Opção de marmita saudável")
    id_classificacao: int = Field(..., example=2)
    usa_tamanho: bool = Field(..., example=True)
    preco: Optional[float] = Field(
        None,
        example=25.50,
        description="Obrigatório quando usa_tamanho=False"
    )

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
    if not produto.usa_tamanho and produto.preco is None:
        raise HTTPException(
            status_code=400,
            detail="Para usa_tamanho=False, o campo 'preco' é obrigatório."
        )

    return add_produto(
        nome_produto=produto.nome_produto,
        descricao=produto.descricao,
        id_classificacao=produto.id_classificacao,
        usa_tamanho=produto.usa_tamanho,
        preco=produto.preco,
    )

@router.put("/update_produto/{id_produto}")
def edit_produto(
    id_produto: int = Path(..., gt=0),
    produto: ProdutoRequest = ...,
):
    if not produto.usa_tamanho and produto.preco is None:
        raise HTTPException(
            status_code=400,
            detail="Para usa_tamanho=False, o campo 'preco' é obrigatório."
        )

    return update_produto(
        id_produto=id_produto,
        nome_produto=produto.nome_produto,
        descricao=produto.descricao,
        id_classificacao=produto.id_classificacao,
        usa_tamanho=produto.usa_tamanho,
        preco=produto.preco,
    )

@router.delete("/delete_produto/{id_produto}")
def remove_produto(id_produto: int = Path(..., gt=0)):
    return delete_produto(id_produto)
