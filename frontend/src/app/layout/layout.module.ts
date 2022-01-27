import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MainComponent } from './main/main.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SubirFacturaComponent } from './pages/subir-factura/subir-factura.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { EstatusFacturaComponent } from './pages/estatus-factura/estatus-factura.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FacturaInformacionComponent } from './_dialogs/factura-informacion/factura-informacion.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContrareciboComponent } from './_dialogs/contrarecibo/contrarecibo.component';
import { PaymentComponent } from './_dialogs/payment/payment.component';
import { InfoUserDialogComponent } from './_dialogs/info-user-dialog/info-user-dialog.component';
import { PerfilDocumentsComponent } from './_dialogs/perfil-documents/perfil-documents.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { AddEnterpriseComponent } from './_dialogs/add-enterprise/add-enterprise.component';
import { AddBranchComponent } from './_dialogs/add-branch/add-branch.component';
import { AddBranchProviderComponent } from './_dialogs/add-branch-provider/add-branch-provider.component';
import { AddMonthlyComplianceComponent } from './_dialogs/add-monthly-compliance/add-monthly-compliance.component';
import { AddUserComponent } from './_dialogs/add-user/add-user.component';
import { StatusContrareciboComponent } from './pages/status-contrarecibo/status-contrarecibo.component';
import { ContrareciboInformationComponent } from './_dialogs/contrarecibo-information/contrarecibo-information.component';
import { RejectNoteComponent } from './_dialogs/reject-note/reject-note.component';
import { NotesComponent } from './_dialogs/notes/notes.component';




@NgModule({
  declarations: [
    MainComponent,
    PerfilComponent,
    SubirFacturaComponent,
    NotificacionesComponent,
    EstatusFacturaComponent,
    UsuarioComponent,
    FacturaInformacionComponent,
    ContrareciboComponent,
    PaymentComponent,
    InfoUserDialogComponent,
    PerfilDocumentsComponent,
    EmpresasComponent,
    AddEnterpriseComponent,
    AddBranchComponent,
    AddBranchProviderComponent,
    AddMonthlyComplianceComponent,
    AddUserComponent,
    StatusContrareciboComponent,
    ContrareciboInformationComponent,
    RejectNoteComponent,
    NotesComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
})
export class LayoutModule { }
