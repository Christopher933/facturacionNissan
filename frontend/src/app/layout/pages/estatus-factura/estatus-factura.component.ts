import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgModel } from '@angular/forms' ;
import { Router } from '@angular/router';
import { FacturaInformacionComponent } from '../../_dialogs/factura-informacion/factura-informacion.component';
import { RequestService } from 'src/app/shared/services/request.service';
import { ContrareciboComponent } from '../../_dialogs/contrarecibo/contrarecibo.component';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { EmpresaService } from 'src/app/shared/services/empresa.service';


@Component({
  selector: 'app-estatus-factura',
  templateUrl: './estatus-factura.component.html',
  styleUrls: ['./estatus-factura.component.scss']
})
export class EstatusFacturaComponent implements OnInit {

  @ViewChild('search_input', { static: true }) search_input:any= ElementRef;
  @ViewChild('input_number', { static: true }) input_number:any= ElementRef;
  @ViewChild('input_date', { static: false }) input_date:any= ElementRef;

  head_title = ["PROVEEDOR", "RFC","EMISION","MONTO", "ESTATUS", "FOLIO"];
  lead:any;
  bandera=1;
  admin_status: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  total_count:number=0;
  page=1;
  show_profile=false;
  total_pages=1;
  showing_page:number=0;
  is_loading=false;
  user:any;
  is_show_clear_icon:boolean=false;
  storage= JSON.parse(localStorage.getItem("session"));
  facturas = [];
  perfil = [];
  monthly_compliance: any;
  branchs: Array<any>

  

  constructor(
    private dialog: MatDialog,
    public router: Router,
    public request_service: RequestService,
    public empresa_service: EmpresaService
  ) {
    /* this.user = JSON.parse(localStorage.getItem('currentUser') || ""); */
  }
  
  ngOnInit(): void {
    this.getInvoicesByParameter()
    this.getFacturas();
    this.getBranchs();
    
    
    this.admin_status=[
      {
        id_status: 1,
        value: "En revision"
      },
      {
        id_status: 2,
        value: "Coontrarecibo"
      },
      {
        id_status: 3,
        value: "Pagada"
      },
      {
        id_status: 4,
        value: "Rechazada"
      },
    ]
    

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id_status',
      textField: 'value',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    
  }

  openDialog(i){
    let dialog= this.dialog.open(FacturaInformacionComponent,{
      width: "700px",
      height: "800px",
      data : {
        info_factura: this.facturas[i],
      }
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getFacturas();
      }
    })
  }

  getFacturas(){
    this.request_service.getFacturas()
    .subscribe(res =>{
      console.log(res)
      this.is_loading = false;
      this.facturas = res.result;
      this.totalPages(res.total);
    })
  }

  getInvoicesById(event){
    this.resetPage();
    this.is_loading = true;
    this.request_service.filter_parameters.id_status = event.id_status;
    this.getFacturas();
  }

  getInvoicesByDate(event){
    this.resetPage();
    this.is_loading = true;
    this.is_show_clear_icon=true;
    this.request_service.filter_parameters.issue_date = event;
    console.log(event)
    this.getFacturas();
  }

  getInvoicesByBranch(event){
    this.resetPage();
    this.is_loading = true;
    this.request_service.filter_parameters.id_branch = event;
    this.getFacturas();
  }

  clearDateFilter(){
    this.resetPage();
    this.input_date.nativeElement.value=null;
    this.is_show_clear_icon=false;
    this.request_service.filter_parameters.issue_date = null
    this.getFacturas();
  }

  clearStatusInput(){
    this.resetPage();
    this.request_service.filter_parameters.id_status = ""
    this.getFacturas();
  }

  getInvoicesByParameter() {
    this.resetPage();
    fromEvent(this.search_input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((query_search:any) => {
        if(query_search === ""){
          this.request_service.filter_parameters.parameter = ""
        }else{
          this.request_service.filter_parameters.parameter = query_search;
        }
        this.getFacturas();
      });
    }

  
    goNext(){
      if(this.page==this.total_pages){
        return;
      }
      this.is_loading=true;
      this.setPage(Math.min(this.total_pages,this.page+1));
    }
  
    goPrevious(){
      if(this.page==1){
        return;
      }
      this.is_loading=true;
      this.setPage(Math.max(1,this.page - 1));
    }
  
    setPage(numberPage:number){
        if(numberPage>=1 && numberPage <= this.total_pages ){
          this.page=numberPage;
          this.request_service.filter_parameters.page =this.page;
          this.getFacturas();
        }else{
          if(numberPage>this.total_pages){
            this.page=this.total_pages;
            this.request_service.filter_parameters.page=this.page;
            this.getFacturas();
          }
        }
    }

    totalPages(res){
      if(res>0){
        this.total_count=res;
        console.log(this.total_count)
        let total = (this.total_count/this.request_service.filter_parameters.limit) 
        this.total_pages=Math.ceil(total);
        if(this.request_service.filter_parameters.limit*this.page<this.total_count)
        {
          this.showing_page=this.request_service.filter_parameters.limit*this.page;
        }else{
          this.showing_page=this.total_count;
        }
      }else{
        this.page=1
        this.total_pages=1
        this.total_count=0;
        this.showing_page=0;
      }
  
    }

    resetPage(){
      this.page=1;
      this.request_service.filter_parameters.page=this.page;
    }

    changeLimit(value){
      this.request_service.filter_parameters.limit = value;
      this.resetPage();
      this.getFacturas();
    }

    getBranchs(){
      this.empresa_service.getAllBranchs()
      .subscribe(res =>{
        this.branchs = res.result;
      })
    }

}
