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

  form!: FormGroup;
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
        User: this.form.value.user,
        Pass: this.form.value.pass,
      }
      await this.request_service.reqPOST(`/log_in/`, data)
      .pipe(first()).subscribe(
        (data: any) => {
          this.loading = false;
          
          var obj_storage = { 'token': data.systemUserId, 'role': data.title, 'name': data.userFullName };

          // Put the object into storage
          localStorage.setItem('session', JSON.stringify(obj_storage));
          this.router.navigate(['/layout']);
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
