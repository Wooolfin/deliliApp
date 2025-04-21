import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../pedido/pedido.model';
import { ItemSacola } from '../pedido/item-sacola.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  async addPedido(
    pedido: Pedido
  ): Promise<{ pedido_id: number; status: string }> {
    return await firstValueFrom(
      this.http.post<{ pedido_id: number; status: string }>(
        `${this.apiUrl}/add_pedido`,
        pedido
      )
    );
  }
  async addItemSacola(item: ItemSacola): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/add_sacola`, [item])
    );
  }
}
