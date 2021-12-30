import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/shared/services/request.service';
import * as FileSaver from 'file-saver';
import { ContrareciboComponent } from '../contrarecibo/contrarecibo.component';
import { PaymentComponent } from '../payment/payment.component';


@Component({
  selector: 'app-factura-informacion',
  templateUrl: './factura-informacion.component.html',
  styleUrls: ['./factura-informacion.component.scss']
})
export class FacturaInformacionComponent implements OnInit {

  info_factura;
  monthly_compliance =null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialog_ref: MatDialogRef<FacturaInformacionComponent>,
    public request_service: RequestService,
  ) {
     this.info_factura = data.info_factura;

     console.log(this.data)
   }

  ngOnInit(): void {
    this.getLastMonthlyCompliance();
  }

  closeDialog(){
    this.dialog_ref.close();
  }

  downloadFile(path){
    this.request_service.downloadFile(path)
    .subscribe(data =>{
      console.log("data",data)
      FileSaver.saveAs(data,this.info_factura.company_name + this.info_factura.folio);
    })
  }

  downloadContrarecibo(id){
    this.request_service.downloadContrarecibo(id)
    .subscribe(data =>{
      console.log("data",data)
      FileSaver.saveAs(data,"contrarecibo.pdf");
    })
  }

  openDialogContrarecibo(){
    let dialog= this.dialog.open(ContrareciboComponent,{
      width: '600px',
      height: 'auto',
      data: this.info_factura
    })

    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.dialog_ref.close(true);
      }
    })
  }

  openDialogPayment(){
    let dialog= this.dialog.open(PaymentComponent,{
      width: '500px',
      height: '400px',
      data: this.info_factura
    })
    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.dialog_ref.close(true);
      }
    })
  }

  downloadPayment(id: any){
    let data ={
      id_payment: id
    }
    this.request_service.downloadPayment(data)
    .subscribe(res=>{
      console.log("data",res)
      FileSaver.saveAs(res, "pago");
    })
  }

  downloadMonthlyCompliance(path){
    this.request_service.downloadFile(path)
    .subscribe(data =>{
      FileSaver.saveAs(data, "Opinion_cumplimiento");
    })
  }

  getLastMonthlyCompliance(){
    let data = {
      id_user: this.info_factura.id_user
    }

    this.request_service.getLastMonthlyCompliance(data)
    .subscribe(res=>{
      console.log(res)
      if(res.status){
        this.monthly_compliance = res.result;
      }
    })
  }
}
