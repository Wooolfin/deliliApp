import { Component } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { PratoService } from '../services/prato/prato.service';
import { Prato } from '../services/prato/prato.model';

@Component({
  selector: 'app-cadastro-modal',
  templateUrl: './cadastro-modal.page.html',
  styleUrls: ['./cadastro-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class CadastroModalPage {
    nome: string = '';  
    descricao: string = '';  
    valor: number = 0;  

  constructor(
    private modalController: ModalController,
    private pratoService: PratoService
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  addPrato() {
    const newPrato = {
      nome: this.nome,
      descricao: this.descricao,
      valor: this.valor
    };

    this.pratoService.addPrato(newPrato).subscribe({
      next: (response) => {
        console.log('Prato adicionado com sucesso:', response);
        this.modalController.dismiss(response);
      },
      error: (error) => {
        console.error('Erro ao salvar prato:', error);
      }
    });
  }
}
