import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido, Produto } from '../pedido/pedido.model';
import { ItemSacolaRequest } from '../pedido/item-sacola.model';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}
  
  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/get_produtos_pedido`);
  }
  
  addPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_pedido`, pedido);
  }
  
  addItemSacola(itens: ItemSacolaRequest[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_sacola`, itens);
  }
}
