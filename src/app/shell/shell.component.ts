import { Component } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  appPages = [
    { title: 'Pedidos',       url: '/pedidos',       icon: 'cart'       },
    { title: 'Classificação', url: '/classificacao', icon: 'settings'   },
    { title: 'Cadastro',      url: '/cadastro',      icon: 'person-add' }
  ]
  pageTitle = 'DeliliApp'
}
