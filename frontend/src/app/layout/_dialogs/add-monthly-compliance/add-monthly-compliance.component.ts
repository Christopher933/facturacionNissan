import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-add-monthly-compliance',
  templateUrl: './add-monthly-compliance.component.html',
  styleUrls: ['./add-monthly-compliance.component.scss']
})
export class AddMonthlyComplianceComponent implements OnInit {

  type_document;
  form_compliance: FormGroup;
  is_loading = false;
  storage;
  perfil_info;
  name_file:string;
  form_file: FormGroup
  file:any;
  type_file;
  is_submitted: boolean = false;
  fd= new FormData();
  monthly_compliance;
  months = [
    {name: "Enero", value: 1},
    {name: "Febrero", value: 2},
    {name: "Marzo", value: 3},
    {name: "Abril", value: 4},
    {name: "Mayo", value: 5},
    {name: "Junio", value: 6},
    {name: "Julio", value: 7},
    {name: "Agosto", value: 8},
    {name: "Septiembre", value: 9},
    {name: "Octubre", value: 10},
    {name: "Noviembre", value: 11},
    {name: "Diciembre", value: 12},
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<AddMonthlyComplianceComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) {
    this.monthly_compliance = data;
    console.log(this.monthly_compliance)
    this.form_compliance = this.form_builder.group({
      id_user : this.request_service.id_user,
      archivo : ["", Validators.required],
      month: ["", Validators.required]
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
    this.form_compliance.controls.archivo.setValue(null);
  }

  sendFile(){
    this.is_submitted = true;
    if(this.form_compliance.invalid){
      return;
    }
    this.is_loading = true;
    this.fd.append("type_file", "opinion_cumplimiento")
    this.fd.append("id_user", this.request_service.id_user)
    this.fd.append("month", this.form_compliance.controls.month.value)
    this.fd.append("archivo", this.file)

    this.request_service.uploadMonthlyCompliance(this.fd)
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
        this.fd.delete("month");
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
    if(!this.form_compliance.controls.archivo.value){
      return;
    }
    this.is_loading = true;
    this.fd.append("type_file", "opinion_cumplimiento")
    this.fd.append("id_user", this.request_service.id_user)
    this.fd.append("id_monthly_compliance", this.monthly_compliance.id_monthly_compliance)
    this.fd.append("archivo", this.file)

    this.request_service.updateMonthlyCompliance(this.fd)
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

}
