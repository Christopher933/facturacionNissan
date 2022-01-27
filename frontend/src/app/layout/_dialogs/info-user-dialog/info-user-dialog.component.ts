import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-info-user-dialog',
  templateUrl: './info-user-dialog.component.html',
  styleUrls: ['./info-user-dialog.component.scss']
})
export class InfoUserDialogComponent implements OnInit, AfterViewInit {

  is_loading: boolean = false;
  is_sumitted = false;
  fd = new FormData();
  file = [];
  storage= JSON.parse(localStorage.getItem("session"));
  info_user;
  form_user: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<InfoUserDialogComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) { 
      this.info_user = this.data;
      console.log(this.data)

      this.form_user = form_builder.group({
        user_name: [{value:"",disabled: true}],
        email: [""],
        company_name: [{value:"",disabled: true}],
        phone: [""],
        rfc: [{value:"",disabled: true}],
        id_role: [""],
        status: [""],
        first_name: [""],
        last_name_1: [""],
        last_name_2 : [""]
      })
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    this.form_user.controls.user_name.setValue(this.data.user_name);
    this.form_user.controls.email.setValue(this.data.email);
    this.form_user.controls.company_name.setValue(this.data.company_name);
    this.form_user.controls.phone.setValue(this.data.phone);
    this.form_user.controls.rfc.setValue(this.data.rfc);
    this.form_user.controls.id_role.setValue(this.data.id_role);
    this.form_user.controls.status.setValue(this.data.status);
    this.form_user.controls.first_name.setValue(this.data.first_name);
    this.form_user.controls.last_name_1.setValue(this.data.last_name_1);
    this.form_user.controls.last_name_2.setValue(this.data.last_name_2);
    this.form_user.updateValueAndValidity();
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  updateUser(){
    this.is_loading = true;
    let data = {
      ...this.form_user.value,
      id_user : this.info_user.id_user,
      update_by : this.request_service.id_user
    }

    this.request_service.updateUser(data)
    .subscribe(res => {
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

}
