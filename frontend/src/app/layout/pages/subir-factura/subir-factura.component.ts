import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'
import { AddMonthlyComplianceComponent } from '../../_dialogs/add-monthly-compliance/add-monthly-compliance.component';

@Component({
  selector: 'app-subir-factura',
  templateUrl: './subir-factura.component.html',
  styleUrls: ['./subir-factura.component.scss']
})


export class SubirFacturaComponent implements OnInit {
  form_factura:FormGroup;
  is_submitted = false;
  fd = new FormData();
  archives = [];
  storage= JSON.parse(localStorage.getItem("session"));
  shipping_date;
  monthly_compliance;
  branchs:Array<any>
  enterprises: Array<any>
  section:number = 1;
  pdf_name:string;
  xml_name:string;

  constructor(
    public request_service: RequestService,
    public form_builder: FormBuilder,
    public router: Router,
    public empresa_service: EmpresaService,
    public dialog: MatDialog,
  ) {

    this.form_factura=this.form_builder.group({
      fecha_emision: ["",Validators.required],
      fecha_limite:  ["",Validators.required],
      folio:         ["",Validators.required],
      monto:         ["",Validators.required],
      moneda:        ["",Validators.required],
      pdf: [""],
      xml: [""],
      id_branch: ["", Validators.required],
      id_enterprise: ["", Validators.required]
    });
   }

  ngOnInit(): void {
    this.getLastMonthlyCompliance();
    this.getEnterprises();
  }

  uploadArchive(event:any, type: string){
    console.log(event.name)
    if(type == "pdf"){
      this.archives.push(event);
      this.pdf_name = event.name
      this.form_factura.get("pdf").setValue(true);
    }else{
      if(event.type != "text/xml"){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Favor de subir archivo xml'
        })
        return;
      }
      this.archives.push(event);
      this.xml_name = event.name
      this.form_factura.get("xml").setValue(true);
    }

    console.log(this.archives)
  }


  goSend(){
  if(!this.monthly_compliance){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Favor de subir su opinion de cumplimiento'
    })
    this.openDialogMonthlyCompliance();
    return;
  }
  let now = new Date();
  this.shipping_date  = now.getFullYear() + "-" +(now.getMonth()+1) + "-"+ now.getDay();
   this.archives.forEach((item) => this.fd.append("archivos", item))
   this.fd.append("issue_date",this.form_factura.get("fecha_emision").value);
   this.fd.append("payment_deadline",this.form_factura.get("fecha_limite").value);
   this.fd.append("folio",this.form_factura.get("folio").value);
   this.fd.append("mount",this.form_factura.get("monto").value);
   this.fd.append("coin",this.form_factura.get("moneda").value);
   this.fd.append("id_user",this.storage.token);
   this.fd.append("shipping_date",this.shipping_date)
   this.fd.append("id_branch",this.form_factura.controls.id_branch.value)

   this.request_service.uploadFactura(this.fd)
   .subscribe(res=>{
     this.fd.delete("archivos")
     this.fd.delete("issue_date");
     this.fd.delete("payment_deadline");
     this.fd.delete("folio");
     this.fd.delete("mount");
     this.fd.delete("coin");
     this.fd.delete("id_user");
     this.fd.delete("shipping_date");
     this.fd.delete("id_branch");
     if(res.status){
       this.section = 1;
       this.is_submitted = false;
       Swal.fire({
         icon: 'success',
         title: 'Success',
         text: 'Informacion de factura subida correctamente'
       })
       this.archives = [];
       this.form_factura.reset();
     }else{
       Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: res.message,
       })
     }

   })
    
  }

  getLastMonthlyCompliance(){
    let data = {
      id_user: this.request_service.id_user
    }

    this.request_service.getLastMonthlyCompliance(data)
    .subscribe(res=>{
      console.log(res)
      if(res.status){
        this.monthly_compliance = res.result;
      }
    })
  }

  getBranch(id_enterprise){
    let data = {
      id_enterprise: id_enterprise
    }
    this.empresa_service.getBranch(data)
    .subscribe(res =>{
      console.log(res.result)
      this.branchs = res.result;
    })
  }

  getEnterprises(){
    this.empresa_service.getEnterprises()
    .subscribe(res=>{
      console.log("enterprise",res)
      this.enterprises = res.result;
    })
  }

  nextSection(){
    this.is_submitted = true;
    if(this.form_factura.invalid){
      return;
    }
    if(this.section == 2){
      if(this.form_factura.controls.pdf.value == "" && this.form_factura.controls.xml.value == ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Favor de subir los archivos'
        })
        return;
      }
      this.goSend();
      return;
    }
    this.section ++;
  }

  goBack(){
    if(this.section == 2){
      this.section --;
    }
  }

  deleteFile(){
      this.archives = null;
      this.form_factura.controls.pdf.setValue(null);
      this.form_factura.controls.xml.setValue(null);
      this.pdf_name = "";
      this.xml_name = "";
  }

  openDialogMonthlyCompliance(){
    let dialog= this.dialog.open(AddMonthlyComplianceComponent,{
      width: "600px",
      height: "550px",
      data : null,
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getLastMonthlyCompliance()
      }
    })
  }

  get f(){ return this.form_factura.controls}

}
