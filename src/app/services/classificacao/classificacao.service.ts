import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classificacao, Tamanho, Produto } from './classificacao.model';

@Injectable({
  providedIn: 'root'
})
export class ClassificacaoService {

  private readonly apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getClassificacoes(): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${this.apiUrl}/get_classificacao`);
  }

  getTamanhos(classificacaoId: number): Observable<Tamanho[]> {
    return this.http.get<Tamanho[]>(`${this.apiUrl}/get_tamanho/${classificacaoId}`);
  }

  getProdutos(classificacaoId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/get_produtos/${classificacaoId}`);
  }

  atualizarPrecosTamanhos(payload: {
    id_classificacao: number;
    precos_tamanhos: { id_tamanho: number; preco: number }[];
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_preco_tamanho`, payload);
  }

  atualizarPrecosProdutos(payload: {
    id_classificacao: number;
    precos_produtos: { id_produto: number; preco: number }[];
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_preco_produto`, payload);
  }

}
