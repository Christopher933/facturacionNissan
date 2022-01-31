import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, AfterViewInit {

  submenu_selected:number = 1;
  is_loading:boolean = false;
  is_submitted:boolean = false;
  notes:any;
  info_factura:any;
  form_factura: FormGroup;
  form_files: FormGroup;
  files: Array<any>= [];
  pdf_name:string;
  xml_name:string;
  enterprises: Array<any> = [];
  branchs: Array<any> = [];
  fd = new FormData();

  constructor(
    public request_service: RequestService,
    public dialog_ref: MatDialogRef<NotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public form_builder: FormBuilder,
    public empresa_service: EmpresaService
  ) {
    this.notes = data.notes;
    this.info_factura = data.info_factura

    this.form_files = this.form_builder.group({
      pdf: ["", Validators.required],
      xml: ["",Validators.required]
    })

    this.form_factura=this.form_builder.group({
      fecha_emision: ["",Validators.required],
      fecha_limite:  ["",Validators.required],
      folio:         ["",Validators.required],
      monto:         ["",Validators.required],
      moneda:        ["",Validators.required],
      id_branch: ["", Validators.required],
      id_enterprise: ["", Validators.required]
    });
   }

  ngOnInit(): void {
    this.getEnterprises()
    this.getBranch(this.info_factura.id_enterprise)
  }

  ngAfterViewInit(): void {
      let fecha_emision = this.info_factura.issue_date.split("T");
      let fecha_limite = this.info_factura.payment_deadline.split("T");
      this.form_factura.controls.fecha_emision.setValue(fecha_emision[0]);
      this.form_factura.controls.fecha_limite.setValue(fecha_limite[0]);
      this.form_factura.controls.folio.setValue(this.info_factura.folio);
      this.form_factura.controls.monto.setValue(this.info_factura.mount);
      this.form_factura.controls.moneda.setValue(this.info_factura.coin);
      this.form_factura.controls.id_branch.setValue(this.info_factura.id_branch);
      this.form_factura.controls.id_enterprise.setValue(this.info_factura.id_enterprise);
  }

  selectSubmenu(number:number){
    this.submenu_selected=number;

  }

  closeDialog(){
    this.dialog_ref.close(true);
  }

  uploadArchive(event:any, type: string){
    console.log(event.name)
    if(type == "pdf"){
      this.files.push(event);
      this.pdf_name = event.name
      this.form_files.get("pdf").setValue(true);
    }else{
      if(event.type != "text/xml"){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Favor de subir archivo xml'
        })
        return;
      }
      this.files.push(event);
      this.xml_name = event.name
      this.form_files.get("xml").setValue(true);
    }
  }

  deleteFile(){
    this.files = [];
    this.form_files.controls.pdf.setValue(null);
    this.form_files.controls.xml.setValue(null);
    this.pdf_name = "";
    this.xml_name = "";
}

  getEnterprises(){
    this.empresa_service.getEnterprises()
    .subscribe(res=>{
      this.enterprises = res.result;
    })
  }

  getBranch(id_enterprise){
    let data = {
      id_enterprise: id_enterprise
    }
    this.empresa_service.getBranch(data)
    .subscribe(res =>{
      this.branchs = res.result;
    })
  }

  updateInfoInvoice(){
    this.is_submitted = true;
    if(this.form_factura.invalid){ return; }
    this.is_loading = true;
    let data = {
      issue_date: this.form_factura.controls.fecha_emision.value,
      payment_deadline:  this.form_factura.controls.fecha_limite.value,
      mount:  this.form_factura.controls.monto.value ,
      folio:  this.form_factura.controls.folio.value , 
      coin:  this.form_factura.controls.moneda.value,
      id_user: this.info_factura.id_user , 
      id_branch:  this.form_factura.controls.id_branch.value, 
      id_invoice: this.info_factura.id_invoice , 
      update_by : this.request_service.id_user
    }

    this.request_service.updateInfoInvoice(data)
    .subscribe(res=>{
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

  updateFilesInvoice(){
    if(this.form_files.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Favor de subir los archivos'
      })
      return;
    }
    this.is_loading = true;
    this.files.forEach((item) => this.fd.append("archivos", item))
    this.fd.append("old_pdf", this.info_factura.path_pdf);
    this.fd.append("old_xml", this.info_factura.path_xml);
    this.fd.append("update_by", this.request_service.id_user);
    this.fd.append("id_user", this.info_factura.id_user);
    this.fd.append("folio", this.info_factura.folio);
    this.fd.append("id_invoice", this.info_factura.id_invoice);

    this.request_service.updateFilesInvoice(this.fd)
    .subscribe(res=>{
      this.is_loading = false;
      this.fd.delete("archivos");
      this.fd.delete("old_pdf");
      this.fd.delete("old_xml");
      this.fd.delete("update_by");
      this.fd.delete("id_user");
      this.fd.delete("folio");
      this.fd.delete("id_invoice");
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message
        })
        this.deleteFile();
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
        })
      }
    }, error =>{
      this.fd.delete("archivos");
      this.fd.delete("old_pdf");
      this.fd.delete("old_xml");
      this.fd.delete("update_by");
      this.fd.delete("id_user");
      this.fd.delete("folio");
      this.fd.delete("id_invoice");
    })
    this.fd.delete("archivos");
    this.fd.delete("old_pdf");
    this.fd.delete("old_xml");
    this.fd.delete("update_by");
    this.fd.delete("id_user");
    this.fd.delete("folio");
    this.fd.delete("id_invoice");
  }

  get f_files() {  return this.form_files.controls }
  get f_factura() {  return this.form_factura.controls }

}
