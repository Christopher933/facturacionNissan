import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { RequestService } from 'src/app/shared/services/request.service';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-contrarecibo-information',
  templateUrl: './contrarecibo-information.component.html',
  styleUrls: ['./contrarecibo-information.component.scss']
})
export class ContrareciboInformationComponent implements OnInit {

  info_contrarecibo;
  invoices: Array<any> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public request_service : RequestService,
    public dialog_ref: MatDialogRef<ContrareciboInformationComponent>,
    public dialog: MatDialog
  ) {
    this.info_contrarecibo = data;
   }

  ngOnInit(): void {
    this.getInvoicesByContrarecibo()
  }

  downloadFile(path, name, folio){
    this.request_service.downloadFile(path)
    .subscribe(data =>{
      FileSaver.saveAs(data,name + folio);
    })
  }

  openDialogPayment(){
    let dialog= this.dialog.open(PaymentComponent,{
      width: '500px',
      height: '400px',
      data: this.info_contrarecibo
    })
    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.dialog_ref.close(true);
      }
    })
  }

  closeDialog(){
    this.dialog_ref.close()
  }

  getInvoicesByContrarecibo(){
    let data = {
      id_contrarecibo : this.info_contrarecibo.id_contrarecibo
    }
    this.request_service.getInvoicesByContrarecibo(data)
    .subscribe(res =>{
      this.invoices =res.result;
    })
  }

}
