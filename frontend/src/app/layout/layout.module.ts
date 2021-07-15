import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MainComponent } from './main/main.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SubirFacturaComponent } from './pages/subir-factura/subir-factura.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { EstatusFacturaComponent } from './pages/estatus-factura/estatus-factura.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MainComponent,
    PerfilComponent,
    SubirFacturaComponent,
    NotificacionesComponent,
    EstatusFacturaComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
  ]
})
export class LayoutModule { }
