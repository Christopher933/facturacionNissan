import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-contrarecibo',
  templateUrl: './contrarecibo.component.html',
  styleUrls: ['./contrarecibo.component.scss']
})
export class ContrareciboComponent implements OnInit {

  info_factura;
  form_contrarecibo: FormGroup;
  is_loading = false;
  storage;
  perfil_info;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<ContrareciboComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) {
    this.storage= JSON.parse(localStorage.getItem("session"));
    this.info_factura = data;
    this.form_contrarecibo = this.form_builder.group({
      promise_date : ["", Validators.required]
    })
    console.log("contra", this.info_factura)
   }

  ngOnInit(): void {
    this.getPerfilInfo()
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  sendContrarecibo(){
    if(this.form_contrarecibo.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Favor de ingresar una fecha promesa de pago'
      })
      return;
    }
    this.is_loading =true;
    let t = this.info_factura.shipping_date
    let shipping_date=t.split("T");
    let pd = this.info_factura.payment_deadline;
    let payment_deadline = pd.split("T");

    let data = {
      ...this.form_contrarecibo.value,
      company_name : this.info_factura.company_name,
      folio: this.info_factura.folio,
      shipping_date: shipping_date[0],
      id_invoice : this.info_factura.id_invoice,
      mount : this.info_factura.mount,
      email: this.perfil_info.email,
      payment_deadline: payment_deadline[0],
    }
    this.request_service.sendContrarecibo(data)
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }

  resendContrarecibo(){
    this.is_loading = true;
    let data = {
      id_contrarecibo : this.info_factura.id_contrarecibo
    }

    this.request_service.resendContrarecibo(data)
    .subscribe(res =>{
      this.is_loading = false;
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message
        })
      }
    })
  }

  getPerfilInfo(){
    this.request_service.getPerfil(this.info_factura.id_user)
    .subscribe(res=>{
      this.perfil_info = res;
      console.log("perfil",this.perfil_info)
    })
    
  }

}
