import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component'

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./pedido/pedidos.page').then(m => m.PedidosPage)
      },
      {
        path: 'classificacao',
        loadComponent: () =>
          import('./classificacao/classificacao.page').then(m => m.ClassificacaoPage)
      },
      {
        path: 'cadastro',
        loadComponent: () =>
          import('./cadastro/cadastro.page').then(m => m.CadastroPage)
      }]
  }
];
