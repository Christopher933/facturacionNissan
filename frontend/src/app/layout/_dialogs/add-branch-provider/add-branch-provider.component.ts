import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-branch-provider',
  templateUrl: './add-branch-provider.component.html',
  styleUrls: ['./add-branch-provider.component.scss']
})
export class AddBranchProviderComponent implements OnInit {

  branch_info:any;
  form_branch:FormGroup
  is_loading: boolean = false;
  is_submitted = false;
  enterprises = [];
  branchs = [];
  id_provider: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog_ref: MatDialogRef<AddBranchProviderComponent>,
    public form_builder: FormBuilder,
    public empresa_service: EmpresaService,
    public request_service: RequestService
  ) {
    this.branch_info = data.branch;
    this.id_provider = data.id_provider;
    this.form_branch = this.form_builder.group({
      name_branch: ["", Validators.required],
      street: ["", Validators.required],
      colony: ["",Validators.required],
      city: ["",Validators.required],
      state: ["",Validators.required],
      zip_code: ["",Validators.required],
      phone: ["",Validators.required],
      email: ["",Validators.required],
      is_active: ["1",Validators.required],
    })

    this.data.enterprises.forEach(element => {
      if(element.is_active){
        this.enterprises.push(element)
      }
    });
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
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  addBranch(){
    this.is_submitted = true;
    if(this.form_branch.invalid){
      return;
    }

    let data = {
      ...this.form_branch.value,
      id_provider: this.id_provider
    }  
    this.is_loading = true;
    this.empresa_service.addBranchProvider(data)
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

  updateBranch(){
    this.is_submitted = true;
    if(this.form_branch.invalid){
      return;
    }
      
    this.is_loading = true;
    let data = {
      id_provider_branch : this.branch_info.id_provider_branch,
      ...this.form_branch.value
    }
    this.empresa_service.updateBranchProvider(data)
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
