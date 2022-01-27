import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  form_provider: FormGroup
  form_admin: FormGroup
  enterprises: Array<any>
  is_loading:boolean = false;
  is_submitted:boolean = false;
  branchs: Array<any> = []
  section:number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<AddUserComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService,
    public empresa_service: EmpresaService,
  ) {
    this.form_admin = this.form_builder.group({
      user_name: ["", Validators.required],
      password: ["", Validators.required],
      id_role: ["", Validators.required],
      email: ["", Validators.required],
      status: ["1", Validators.required],
      id_branch: ["", Validators.required],
      id_enterprise: ["", Validators.required],
      first_name : ["", Validators.required],
      last_name_1 : ["", Validators.required],
      last_name_2 : ["", Validators.required],
    })

    this.form_provider = this.form_builder.group({
      user_name: ["", Validators.required],
      password: ["", Validators.required],
      id_role: ["3", Validators.required],
      email: ["", Validators.required],
      status: ["1", Validators.required],
      id_branch: ["", Validators.required],
      phone: ["", Validators.required],
      company_name: ["", Validators.required],
      rfc: ["", Validators.required],
      id_regimen: ["", Validators.required],
      id_enterprise: ["", Validators.required]
    })

   }

  ngOnInit(): void {
    this.getEnterprises();
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  insertUser(form_user){
    this.is_submitted = true;
    if(form_user.invalid){return}
    this.is_loading = true;
    let data = {
      ...form_user.value,
      id_user: this.request_service.id_user
    }
    this.request_service.insertUser(data)
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

  getBranch(id_enterprise){
    let data = {
      id_enterprise: id_enterprise
    }
    this.empresa_service.getBranch(data)
    .subscribe(res =>{
      console.log(res.result)
      this.branchs = res.result;
    })
  }

  getEnterprises(){
    this.empresa_service.getEnterprises()
    .subscribe(res=>{
      console.log("enterprise",res)
      this.enterprises = res.result;
    })
  }

  goBack(){
    this.section = 0;
    this.is_submitted = false;
    this.form_admin.reset();
    this.form_provider.reset();
  }

  get f_admin() { return this.form_admin.controls }
  get f_provider() { return this.form_provider.controls }
}
