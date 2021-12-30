import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-enterprise',
  templateUrl: './add-enterprise.component.html',
  styleUrls: ['./add-enterprise.component.scss']
})
export class AddEnterpriseComponent implements OnInit {

  form_enterprise: FormGroup;
  enterprise_info: any;
  is_loading: boolean = false;
  is_submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog_ref: MatDialogRef<AddEnterpriseComponent>,
    public form_builder: FormBuilder,
    public empresa_service: EmpresaService
  ) { 

    this.enterprise_info = data;
    this.form_enterprise = form_builder.group({
      name_enterprise: ["", Validators.required],
      rfc: ["", Validators.required],
      is_active: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if(this.enterprise_info){
      this.insertValues()
    }else{
      this.form_enterprise.controls.is_active.setValue(1)
      this.form_enterprise.updateValueAndValidity();
    }
  }

  insertValues(){
    this.form_enterprise.controls.name_enterprise.setValue(this.enterprise_info.name_enterprise)
    this.form_enterprise.controls.name_enterprise.disable();
    this.form_enterprise.controls.rfc.setValue(this.enterprise_info.rfc)
    this.form_enterprise.controls.rfc.disable();
    this.form_enterprise.controls.is_active.setValue(this.data.is_active)
    this.form_enterprise.updateValueAndValidity();
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  addEnterprise(){
    this.is_submitted = true;
    if(this.form_enterprise.invalid){
      return;
    }
    this.is_loading = true
    this.empresa_service.addEnterprise(this.form_enterprise.value)
    .subscribe(res=>{
      this.is_loading = false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.dialog_ref.close(true)
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }

  updateEnterprise(){
    if(this.form_enterprise.invalid){
      return;
    }
    this.is_loading = true
    let data = {
      id_enterprise: this.enterprise_info.id_enterprise,
      is_active: this.form_enterprise.controls.is_active.value
    }
    this.empresa_service.updateEnterprise(data)
    .subscribe(res=>{
      this.is_loading = false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.dialog_ref.close(true)
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }

  get f(){ return this.form_enterprise.controls }

}
