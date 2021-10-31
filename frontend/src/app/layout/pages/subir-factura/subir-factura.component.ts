import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-subir-factura',
  templateUrl: './subir-factura.component.html',
  styleUrls: ['./subir-factura.component.scss']
})


export class SubirFacturaComponent implements OnInit {
  form_factura:FormGroup;
  is_sumitted = false;
  fd = new FormData();
  archives = [];
  storage= JSON.parse(localStorage.getItem("session"));
  shipping_date;

  constructor(
    public request_service: RequestService,
    public form_builder: FormBuilder,
    public router: Router,
  ) {

    this.form_factura=this.form_builder.group({
      fecha_emision: [""],
      fecha_limite:  [""],
      folio:         [""],
      monto:         [""],
      moneda:        [""],
      pdf: ["",Validators.required],
      xml: ["",Validators.required]
    });
   }

  ngOnInit(): void {
    
  }

  uploadArchive(event:any, type: string){
    if(type == "pdf"){
      this.archives.push(event);
      this.form_factura.get("pdf").setValue(true);
    }else{
      this.archives.push(event);
      this.form_factura.get("xml").setValue(true);
    }

    console.log(this.archives)
  }


  goSend(){
  let now = new Date();
  this.shipping_date  = now.getFullYear() + "-" +(now.getMonth()+1) + "-"+ now.getDay();
  console.log("date",this.shipping_date)
   this.archives.forEach((item) => this.fd.append("archivos", item))
   this.fd.append("issue_date",this.form_factura.get("fecha_emision").value);
   this.fd.append("payment_deadline",this.form_factura.get("fecha_limite").value);
   this.fd.append("folio",this.form_factura.get("folio").value);
   this.fd.append("mount",this.form_factura.get("monto").value);
   this.fd.append("coin",this.form_factura.get("moneda").value);
   this.fd.append("id_user",this.storage.token);
   this.fd.append("shipping_date",this.shipping_date )

    if(this.form_factura.valid){
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
        this.archives = [];
        this.form_factura.reset();
        if(res.status){
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Informacion de factura subida correctamente'
          })
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

  get f(){ return this.form_factura.controls}

}
