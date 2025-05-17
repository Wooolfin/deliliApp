export interface Classificacao {
  id_classificacao: number;
  nome_classificacao: string;
  usa_tamanho: boolean;
}

export interface Tamanho {
  id_tamanho: number;
  descricao_tamanho: string;
  preco: number;
}

export interface Produto {
  id_produto: number;
  nome_produto: string;
  preco: number;
}