import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';

@Component({
  selector: 'app-perfil-documents',
  templateUrl: './perfil-documents.component.html',
  styleUrls: ['./perfil-documents.component.scss']
})
export class PerfilDocumentsComponent implements OnInit {

  type_document;
  form_perfil: FormGroup;
  is_loading = false;
  storage;
  perfil_info;
  form_file: FormGroup
  file:any;
  fd= new FormData();
  bank_accounts;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<PerfilDocumentsComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) { 
    this.storage= JSON.parse(localStorage.getItem("session"));
    this.type_document = data;

    this.form_file = this.form_builder.group({
      id_user : this.storage.token,
      archivo : [""]
    })
    
  }

  ngOnInit(): void {
    if(this.type_document == "cuentas bancarias"){
      this.getBankAccounts();
    }
  }

  insertFile(event){
    console.log(event)
    this.file = event;
  }

  sendFile(){
    this.fd.append("id_user", this.storage.token)
    this.fd.append("archivo", this.file)

    this.request_service.uploadBankAccounts(this.fd)
    .subscribe(res =>{
      console.log(res)
    })
  }

  getBankAccounts(){
    this.request_service.getBankAccounts(this.storage.token)
    .subscribe(res =>{
      console.log(res)
      this.bank_accounts = res.data[0];
    })
  }

  closeDialog(){
    this.dialog_ref.close();
  }
}
