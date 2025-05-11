import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClassificacaoService } from '../services/classificacao/classificacao.service';
import { Classificacao, Tamanho } from '../services/classificacao/classificacao.model';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.page.html',
  styleUrls: ['./classificacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClassificacaoPage implements OnInit {

  classificacoes: Classificacao[] = [];
  tamanhos: Tamanho[] = [];

  constructor(
    private classificacaoService: ClassificacaoService
  ) {}

  ngOnInit() {
    this.getClassificacoes();
  }

  getClassificacoes() {
    this.classificacaoService.getClassificacoes().subscribe((data: Classificacao[]) => {
      console.log('Classificações:', data);
      this.classificacoes = data;
    });
  }

  getTamanhos(id: number) {
  this.classificacaoService.getTamanhos(id).subscribe((data: Tamanho[]) => {
    console.log('Tamanhos:', data);
    this.tamanhos = data;
  });
  }
}
