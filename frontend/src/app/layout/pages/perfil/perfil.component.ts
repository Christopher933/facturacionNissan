import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestService } from 'src/app/shared/services/request.service';
import { PerfilDocumentsComponent } from '../../_dialogs/perfil-documents/perfil-documents.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit ,AfterViewInit{

  storage:any;
  perfil:any;
  form_perfil:FormGroup;

  constructor(
    public request_service: RequestService,
    public form_builder: FormBuilder,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { 

    this.storage= JSON.parse(localStorage.getItem("session"));
    this.form_perfil = this.form_builder.group({
      email : [""],
      phone : [""]
    });
   
  }

  ngOnInit(): void {
    this.getPerfil();
  }

  ngAfterViewInit():void{
    this.form_perfil.get("email").setValue(this.perfil.email)
    this.form_perfil.get("phone").setValue(this.perfil.phone)
  }

  getPerfil(){
    this.request_service.getPerfil(this.storage.token)
      .subscribe(res=>{
        this.perfil= res.result;
        console.log(this.perfil)
      })
  }

  updateProfile(){
    let data = {
      ...this.form_perfil.value,
      id_user: this.storage.token,
    }

    this.request_service.updateProfile(data)
      .subscribe(res=>{
        this.getPerfil();
        this.alerta();
      })
  }

  alerta(){
    this.snackbar.open('Informacion Actualizada', 'Undo', {
      duration: 3000
    });
  }

  openFilesDialog(documentType){
    let dialog= this.dialog.open(PerfilDocumentsComponent,{
      width: "600px",
      height: "500px",
      data : documentType,
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
      }
    })
  }

}
