import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { EstatusFacturaComponent } from './pages/estatus-factura/estatus-factura.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SubirFacturaComponent } from './pages/subir-factura/subir-factura.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        redirectTo: "perfil",
        pathMatch: 'full',
      },
      {
        path:"perfil",
        component: PerfilComponent
      },
      {
        path:"subirFactura",
        component: SubirFacturaComponent
      },
      {
        path: "notificaciones",
        component: NotificacionesComponent,
      },
      {
        path:"estatus",
        component: EstatusFacturaComponent
      },
      {
        path:"usuario",
        component: UsuarioComponent,
      },
      {
        path:"empresas",
        component: EmpresasComponent,
      },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
