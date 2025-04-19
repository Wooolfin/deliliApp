import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prato } from './prato.model';

@Injectable({
  providedIn: 'root'
})
export class PratoService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getPratos(): Observable<Prato[]> {
    return this.http.get<Prato[]>(`${this.apiUrl}/get_pratos`);
  }

  addPrato(newPrato: Omit<Prato, 'id'>): Observable<Prato> {
    return this.http.post<Prato>(`${this.apiUrl}/add_prato`, newPrato);
  }

  updatePrato(prato: Prato): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update_prato/${prato.id}`, prato);
  }  
}
