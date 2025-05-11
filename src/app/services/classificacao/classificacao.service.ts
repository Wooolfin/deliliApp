import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classificacao, Tamanho } from './classificacao.model';

@Injectable({
  providedIn: 'root'
})
export class ClassificacaoService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getClassificacoes(): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${this.apiUrl}/get_classificacao`);
  }

  getTamanhos(id_classificacao: number): Observable<Tamanho[]> {
    return this.http.get<Tamanho[]>(`${this.apiUrl}/get_tamanho/${id_classificacao}`);
  }
}
