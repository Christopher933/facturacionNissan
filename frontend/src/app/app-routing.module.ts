import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
 
  {
    path: 'layout',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }