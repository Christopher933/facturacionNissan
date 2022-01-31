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
  invoices_pending:Array<any> = [];
  array_invoices:Array<any>= [];
  array_titles: Array<any> = ["FOLIO","MONTO", "EMPRESA", "SUCURSAL", "EMISION"]

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
        text: 'Favor de ingresar todos los datos'
      })
      return;
    }
    this.is_loading =true;
    let pd = this.info_factura.payment_deadline;
    let payment_deadline = pd.split("T");
    this.array_invoices.push(this.info_factura)

    let data = {
      promise_date: this.form_contrarecibo.controls.promise_date.value,
      company_name : this.info_factura.company_name,
      rfc: this.info_factura.rfc,
      invoices : this.array_invoices,
      id_invoice : this.info_factura.id_invoice,
      email: this.info_factura.email,
      payment_deadline: payment_deadline[0],
      created_by: this.request_service.id_user,
      full_name: `${this.request_service.first_name} ${this.request_service.last_name_1}`,
      id_user: this.info_factura.id_user,
      name_branch: this.info_factura.name_branch,
      name_enterprise: this.info_factura.name_enterprise,
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
        this.array_invoices = [];
        this.getInvoicesInProgress();
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
      this.getInvoicesInProgress()
    })
    
  }

  getInvoicesInProgress(){
    let data = {
      id_user : this.info_factura.id_user,
      id_invoice: this.info_factura.id_invoice
    }
    this.request_service.getInvoicesInProgress(data)
    .subscribe(res=>{
      if(res.status){
        this.invoices_pending = res.result;
      }
    })
  }

  addInvoiceArray(index:number, invoice){
    console.log(this.array_invoices.indexOf(invoice.id_invoice))
    if(this.array_invoices.indexOf(invoice) > -1){
      let i = this.array_invoices.indexOf(invoice)
      this.array_invoices.splice(i,1);
    }else{
      this.array_invoices.push(invoice);
    }
    console.log(this.array_invoices)
  }

}
