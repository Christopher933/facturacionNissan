import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { RequestService } from 'src/app/shared/services/request.service';
import { ContrareciboInformationComponent } from '../../_dialogs/contrarecibo-information/contrarecibo-information.component';

@Component({
  selector: 'app-status-contrarecibo',
  templateUrl: './status-contrarecibo.component.html',
  styleUrls: ['./status-contrarecibo.component.scss']
})
export class StatusContrareciboComponent implements OnInit {

  @ViewChild('search_input', { static: true }) search_input:any= ElementRef;
  @ViewChild('input_number', { static: true }) input_number:any= ElementRef;
  @ViewChild('input_date', { static: false }) input_date:any= ElementRef;

  head_title = ["FOLIO", "PROMESA DE PAGO","STATUS","RAZON SOCIAL"];
  lead:any;
  bandera=1;
  status: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  total_count:number=0;
  page=1;
  show_profile=false;
  total_pages=1;
  showing_page:number=0;
  is_loading=false;
  user:any;
  is_show_clear_icon:boolean=false;
  facturas = [];
  perfil = [];
  monthly_compliance: any;
  branchs: Array<any>
  contrarecibos: Array<any> = []

  constructor(
    public request_service: RequestService,
    private dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getAllContrarecibos()
    this.getContrarecibosByParameter();

    this.status=[
      {
        id_status: 0,
        value: "Pendiente"
      },
      {
        id_status: 1,
        value: "Pagada"
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

  getAllContrarecibos(){
    this.request_service.getAllContrarecibo()
    .subscribe(res=>{
      console.log(res)
      this.contrarecibos = res.result;
      this.is_loading = false;
      this.totalPages(res.total);
    })
  }

  getContrarecibosById(event){
    this.resetPage();
    this.is_loading = true;
    this.request_service.filter_contrarecibo.id_status_contrarecibo = event.id_status;
    this.getAllContrarecibos();
  }

  clearStatusInput(){
    this.resetPage();
    this.request_service.filter_contrarecibo.id_status_contrarecibo = ""
    this.getAllContrarecibos();
  }

  getContrareciboByDate(event){
    this.resetPage();
    this.is_loading = true;
    this.is_show_clear_icon=true;
    this.request_service.filter_contrarecibo.promise_date = event;
    this.getAllContrarecibos();
  }

  clearDateFilter(){
    this.resetPage();
    this.input_date.nativeElement.value=null;
    this.is_show_clear_icon=false;
    this.request_service.filter_contrarecibo.promise_date = null
    this.getAllContrarecibos();
  }

  openDialog(info_contrarecibo){
    this.dialog.open(ContrareciboInformationComponent, {
      width: "700px",
      height: "800px",
      data : info_contrarecibo
    })
  }

  getContrarecibosByParameter() {
    this.resetPage();
    fromEvent(this.search_input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((query_search:any) => {
        if(query_search === ""){
          this.request_service.filter_contrarecibo.parameter = ""
        }else{
          this.request_service.filter_contrarecibo.parameter = query_search;
        }
        this.getAllContrarecibos();
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
        this.request_service.filter_contrarecibo.page =this.page;
        this.getAllContrarecibos();
      }else{
        if(numberPage>this.total_pages){
          this.page=this.total_pages;
          this.request_service.filter_contrarecibo.page=this.page;
          this.getAllContrarecibos();
        }
      }
  }

  totalPages(res){
    if(res>0){
      this.total_count=res;
      console.log(this.total_count)
      let total = (this.total_count/this.request_service.filter_contrarecibo.limit) 
      this.total_pages=Math.ceil(total);
      if(this.request_service.filter_contrarecibo.limit*this.page<this.total_count)
      {
        this.showing_page=this.request_service.filter_contrarecibo.limit*this.page;
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
    this.request_service.filter_contrarecibo.page=this.page;
  }

  changeLimit(value){
    this.request_service.filter_contrarecibo.limit = value;
    this.resetPage();
    this.getAllContrarecibos();
  }
}
