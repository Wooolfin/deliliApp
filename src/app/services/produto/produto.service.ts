import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto, Classificacao, Tamanho } from './produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/get_produtos`);
  }

  getClassificacoes(): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${this.apiUrl}/get_classificacao`);
  }

  getTamanhos(id_produto: number): Observable<Tamanho[]> {
    return this.http.get<Tamanho[]>(`${this.apiUrl}/produtos/${id_produto}/tamanhos`);
  }

  getTamanhosPorClassificacao(id_classificacao: number): Observable<Tamanho[]> {
    return this.getTamanhos(id_classificacao);
  }
  
  addProduto(data: {
    nome_produto: string;
    descricao: string | null;
    id_classificacao: number;
    usa_tamanho: boolean;
    preco?: number;
    precos?: Array<{ descricao_tamanho: string; preco: number }>;
  }) {
    return this.http.post('/add_produto', data);
  }

  updateProduto(produto: Produto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_produto/${produto.id_produto}`, {
      nome_produto: produto.nome_produto,
    });
  }

  deleteProduto(id_produto: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_produto/${id_produto}`);
  }
}
