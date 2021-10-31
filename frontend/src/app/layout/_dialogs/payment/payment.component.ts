import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  form_payment: FormGroup
  is_loading: boolean = false;
  is_sumitted = false;
  fd = new FormData();
  file = [];
  storage= JSON.parse(localStorage.getItem("session"));
  info_factura;
  date_sent;
  perfil_info;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<PaymentComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) {
    this.info_factura = this.data;
    this.form_payment = form_builder.group({
      pdf: ["",Validators.required]
    })
   }

  ngOnInit(): void {
    this.getPerfilInfo();
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  uploadArchive(event:any){
    this.file.push(event);
    this.form_payment.get("pdf").setValue(true);
    console.log(event)
    console.log(this.file)

  }

  goSend(){
    let now = new Date();
    this.date_sent  = now.getFullYear() + "-" +(now.getMonth()+1) + "-"+ now.getDay();
     this.fd.append("id_invoice",this.info_factura.id_invoice);
     this.fd.append("folio",this.info_factura.folio);
     this.fd.append("sent_date",this.date_sent );
     this.fd.append("email",this.perfil_info.email );
     this.fd.append("id_user",this.perfil_info.id_user );
     this.file.forEach((item) => this.fd.append("archivo", item))
  
      if(this.form_payment.valid){
        this.request_service.sendPayment(this.fd)
        .subscribe(res=>{
          this.fd.delete("id_invoice")
          this.fd.delete("folio");
          this.fd.delete("sent_date");
          this.file = [];
          this.form_payment.reset();
          if(res.status){
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Informacion de factura subida correctamente'
            })
            this.dialog_ref.close(true)
            console.log(res);
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: res.message,
            })
          }
  
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Favor de llenar todos los datos'
        })
      }
      
    }

    getPerfilInfo(){
      this.request_service.getPerfil(this.info_factura.id_user)
      .subscribe(res=>{
        this.perfil_info = res;
        console.log("perfil",this.perfil_info)
      })
      
    }

}
