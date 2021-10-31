import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {

  branch_info:any;
  form_branch:FormGroup
  is_loading: boolean = false;
  is_sumitted = false;
  enterprises = [];
  branchs = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog_ref: MatDialogRef<AddBranchComponent>,
    public form_builder: FormBuilder,
    public empresa_service: EmpresaService
  ) { 
    this.branch_info = data.branch;
    this.enterprises = data.enterprises;
    this.form_branch = this.form_builder.group({
      name_branch: ["", Validators.required],
      street: ["", Validators.required],
      colony: ["",Validators.required],
      city: ["",Validators.required],
      state: ["",Validators.required],
      zip_code: ["",Validators.required],
      phone: ["",Validators.required],
      email: ["",Validators.required],
      id_enterprise: ["", Validators.required],
      is_active: ["1",Validators.required],
    })
  }

  ngOnInit(): void {
    if(this.branch_info){
      this.insertValues();
    }
  }

  insertValues(){
    this.form_branch.controls.name_branch.setValue(this.branch_info.name_branch)
    this.form_branch.controls.name_branch.disable();
    this.form_branch.controls.street.setValue(this.branch_info.street)
    this.form_branch.controls.colony.setValue(this.branch_info.colony)
    this.form_branch.controls.city.setValue(this.branch_info.city)
    this.form_branch.controls.state.setValue(this.branch_info.state)
    this.form_branch.controls.phone.setValue(this.branch_info.phone)
    this.form_branch.controls.email.setValue(this.branch_info.email)
    this.form_branch.controls.zip_code.setValue(this.branch_info.zip_code)
    this.form_branch.controls.id_enterprise.setValue(this.branch_info.id_enterprise)
    this.form_branch.controls.is_active.setValue(this.branch_info.is_active_branch)
    this.form_branch.updateValueAndValidity();
    console.log(this.form_branch.value)
    console.log(this.branch_info)
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  addBranch(){
    this.empresa_service.addBranch(this.form_branch.value)
    .subscribe(res =>{
      console.log(res)
    })
  }

  updateBranch(){
    this.is_loading = true;
    let data = {
      id_branch : this.branch_info.id_branch,
      ...this.form_branch.value
    }
    this.empresa_service.updateBranch(data)
    .subscribe(res =>{
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

  get f() { return this.form_branch.controls }

}
