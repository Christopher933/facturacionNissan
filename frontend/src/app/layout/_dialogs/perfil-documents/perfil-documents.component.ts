import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-perfil-documents',
  templateUrl: './perfil-documents.component.html',
  styleUrls: ['./perfil-documents.component.scss']
})
export class PerfilDocumentsComponent implements OnInit {

  type_document;
  is_loading = false;
  storage;
  perfil_info;
  name_file:string;
  form_file: FormGroup
  file:any;
  type_file;
  is_submitted: boolean = false;
  fd= new FormData();
  file_info:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<PerfilDocumentsComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) { 
    this.file_info = data.file_info;
    console.log("file_info", this.file_info)
    this.type_file = data.type_file;
    console.log(this.type_file)
    this.form_file = this.form_builder.group({
      id_user : this.request_service.id_user,
      archivo : ["", Validators.required],
    })
    
  }

  ngOnInit(): void {
  }

  insertFile(event){
    this.name_file = event.name;
    this.file = event;
  }

  deleteFile(){
    this.name_file = "";
    this.file = null;
    this.form_file.controls.archivo.setValue(null);
  }

  sendFile(){
    this.is_submitted = true;
    if(this.form_file.invalid){
      return;
    }
    this.is_loading = true;
    this.fd.append("type_file", this.type_file)
    this.fd.append("id_user", this.request_service.id_user)
    this.fd.append("id_file_type", this.file_info.id_file_type)
    this.fd.append("archivo", this.file)

    this.request_service.uploadFilesPerfil(this.fd)
    .subscribe(res =>{
      this.is_loading =false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.dialog_ref.close(true)
      }else{
        this.fd.delete("id_user");
        this.fd.delete("archivo");
        this.fd.delete("type_file")
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  downloadFile(path){
    this.request_service.downloadFile(path)
    .subscribe(data =>{
      FileSaver.saveAs(data, "Opinion_cumplimiento");
    })
  }

  updateFile(){
    this.is_submitted = true;
    if(!this.form_file.controls.archivo.value){
      return;
    }
    this.is_loading = true;
    this.fd.append("type_file", this.type_file)
    this.fd.append("id_file_type", this.file_info.id_file_type)
    this.fd.append("id_perfil_files", this.file_info.id_perfil_files)
    this.fd.append("archivo", this.file)

    this.request_service.updateFilePerfil(this.fd)
    .subscribe(res=>{
      this.is_loading =false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.dialog_ref.close(true)
      }else{
        this.fd.delete("type_file")
        this.fd.delete("id_file_type")
        this.fd.delete("id_perfil_files")
        this.fd.delete("archivo")
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }
}
