import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { RequestService } from 'src/app/shared/services/request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;

  //Message Alerts
  show_msg: boolean = false;
  show_error: boolean = false;
  show_success: boolean = false;
  msg_alert: string = '';

  constructor(
    private fb: FormBuilder,
    private request_service: RequestService,
    public router: Router
  ) {
    if(localStorage.getItem('session')) {
      this.router.navigate(['/layout']);
    }
   }

  ngOnInit(): void {
    this.form = this.fb.group({
      user: ["", Validators.required],
      pass: ["", Validators.required],
    });
  }

  showMessageAlert(type: string){
    if(type == 'error'){
      this.show_error = true;
    }else if(type == 'success'){
      this.show_success = true;
    }
    this.show_msg = true;
    setTimeout(()=>{
      this.show_error = false;
      this.show_success = false;
      this.show_msg = false;
    },5000)
  }
  async loginAction(){
    if(this.form.valid){
      this.loading = true;
      const data = {
        user_name: this.form.value.user,
        password: this.form.value.pass,
      }
      await this.request_service.reqPOST(`/auth`, data)
      .pipe(first()).subscribe(
        (data: any) => {
          console.log(data)
          this.loading = false;
          if(data.status){
            var obj_storage = { 
              'id_user': data.result.id_user, 
              'id_role': data.result.id_role, 
              'user_name': data.result.user_name,
              'id_branch': data.result.id_branch,
              'id_enterprise': data.result.id_enterprise,
              'first_name': data.result.first_name,
              'last_name_1': data.result.last_name_1,
              'last_name_2': data.result.last_name_2,
             };
            localStorage.setItem('session', JSON.stringify(obj_storage));
            this.request_service.id_user = data.result.id_user;
            this.request_service.id_role = data.result.id_role;
            this.request_service.id_branch = data.result.id_branch;
            this.request_service.user_name = data.result.user_name;
            this.request_service.first_name = data.result.first_name;
            this.request_service.last_name_1 = data.result.last_name_1;
            this.request_service.last_name_2 = data.result.last_name_2;
            this.request_service.filter_contrarecibo.id_user = data.result.id_user;
            this.request_service.filter_parameters.id_user = data.result.id_user;
            this.request_service.filter_parameters.id_role = data.result.id_role;
            this.request_service.filter_users.id_user = data.result.id_user;
            this.router.navigate(['/layout']);
          }else{
            this.msg_alert = data.message;
            this.showMessageAlert('error');
          }
        },
        (error: any) => {
          this.loading = false;
          this.msg_alert = error.error.message;
          
          this.showMessageAlert('error');
        }
      );
    }else{
      if(this.form.controls['user'].invalid){
        this.msg_alert = 'Please fill user';
        this.showMessageAlert('error');
      }
      if(this.form.controls['pass'].invalid){
        this.msg_alert = 'Please fill password';
        this.showMessageAlert('error');
      }
    }
  }

}
