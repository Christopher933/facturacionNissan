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
  info_contrarecibo;
  date_sent;
  perfil_info;
  name_file: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog_ref: MatDialogRef<PaymentComponent>,
    public form_builder: FormBuilder,
    public request_service: RequestService
  ) {
    this.info_contrarecibo = this.data;
    this.form_payment = form_builder.group({
      pdf: ["",Validators.required]
    })
   }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  uploadArchive(event:any){
    this.file.push(event);
    this.name_file = event.name;
    this.form_payment.get("pdf").setValue(true);
  }

  deleteFile(){
    this.name_file = "";
    this.file = [];
    this.form_payment.controls.pdf.setValue(null);
  }

  goSend(){
    if(this.form_payment.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Favor de llenar todos los datos'
      })
      return;
    }

     this.fd.append("id_contrarecibo",this.info_contrarecibo.id_contrarecibo);
     this.fd.append("email",this.info_contrarecibo.email );
     this.fd.append("created_by",this.request_service.id_user );
     this.fd.append("company_name",this.info_contrarecibo.company_name );
     this.fd.append("rfc",this.info_contrarecibo.rfc );
     this.fd.append("id_user",this.info_contrarecibo.id_user );
     this.fd.append("full_name",`${this.request_service.first_name} ${ this.request_service.last_name_1 }`);
     this.file.forEach((item) => this.fd.append("archivo", item))

      this.request_service.sendPayment(this.fd)
      .subscribe(res=>{
        this.fd.delete("id_contrarecibo")
        this.fd.delete("email");
        this.fd.delete("sent_date");
        this.fd.delete("archivo");
        this.fd.delete("company_name");
        this.fd.delete("rfc");
        this.fd.delete("id_user");
        this.fd.delete("full_name");
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
      
    }
}
