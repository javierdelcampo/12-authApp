import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ValidarTokenGuard } from './auth/guards/validar-token.guard'

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import ('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'dashboard',
    loadChildren: () => import ('./protected/protected.module').then( m => m.ProtectedModule ),
    canLoad: [ ValidarTokenGuard ],
    canActivate: [ ValidarTokenGuard ]
  },
  {
    path: '**',
    redirectTo: 'auth'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
