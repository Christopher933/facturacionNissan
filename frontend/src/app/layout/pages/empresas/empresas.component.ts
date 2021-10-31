import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import { AddBranchComponent } from '../../_dialogs/add-branch/add-branch.component';
import { AddEnterpriseComponent } from '../../_dialogs/add-enterprise/add-enterprise.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit, AfterViewInit {

  form_user: FormGroup;
  is_sumitted = false;
  submenu_selected= 1;


  //table users
  @ViewChild('search_input', { static: false }) search_input:any= ElementRef;
  @ViewChild('input_number', { static: false }) input_number:any= ElementRef;

  enterprise_titles = ["RAZON SOCIAL", "RFC", "ESTATUS"];
  branchs_titles = ["NOMBRE", "EMPRESA", "TELEFONO", "CORREO", "ESTATUS"]
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
  enterprises= [];
  branchs = [];

  constructor(
    public request_service: RequestService,
    public empresa_service: EmpresaService,
    public router: Router,
    public form_builder: FormBuilder,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getEnterprises();
    this.getBranchs();
    this.admin_status=[
      {
        id_status: 1,
        value: "ACTIVO"
      },
      {
        id_status: 0,
        value: "BLOQUEADO"
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

  ngAfterViewInit():void{
  }

  selectSubmenu(number:number){
    this.submenu_selected=number;
    this.is_sumitted=false;
    if(this.submenu_selected == 2){
      setTimeout(() => {
         this.getBranchsByParameter()
      }, 100);
    }
  }

  getEnterprises(){
    this.empresa_service.getEnterprises()
    .subscribe(res=>{
      console.log(res)
      this.enterprises = res.result;
    })
  }

  openDialogEnterprises(enterprise){
    let dialog = this.dialog.open(AddEnterpriseComponent,{
      width: "600px",
      height: "450px",
      data: enterprise,
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getEnterprises();
      }
    })
  }

  openDialogBranch(branch){
    let dialog = this.dialog.open(AddBranchComponent,{
      width: "600px",
      height: "650px",
      data: {
        branch,
        enterprises: this.enterprises
      },
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getBranchs();
      }
    })
  }

  getBranchs(){
    this.empresa_service.getAllBranchs()
    .subscribe(res =>{
      console.log(res)
      this.is_loading = false;
      this.branchs = res.result;
      this.totalPages(res.total);
    })
  }

    getBranchsByStatus(event){
    this.resetPage();
    this.is_loading = true;
    this.empresa_service.filter_branchs.is_active = event.id_status;
    this.getBranchs();
  }

  clearStatusInput(){
    this.resetPage();
    this.empresa_service.filter_branchs.is_active = ""
    this.getBranchs();
  }

  getBranchsByParameter() {
    this.resetPage();
    fromEvent(this.search_input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((query_search:any) => {
        if(query_search === ""){
          this.empresa_service.filter_branchs.parameter = ""
        }else{
          this.empresa_service.filter_branchs.parameter = query_search;
        }
        this.getBranchs();
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
          this.empresa_service.filter_branchs.page =this.page;
          this.getBranchs();
        }else{
          if(numberPage>this.total_pages){
            this.page=this.total_pages;
            this.empresa_service.filter_branchs.page=this.page;
            this.getBranchs();
          }
        }
    }

    totalPages(res){
      if(res>0){
        this.total_count=res;
        console.log(this.total_count)
        let total = (this.total_count/this.empresa_service.filter_branchs.limit) 
        this.total_pages=Math.ceil(total);
        if(this.empresa_service.filter_branchs.limit*this.page<this.total_count)
        {
          this.showing_page=this.empresa_service.filter_branchs.limit*this.page;
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
      this.empresa_service.filter_branchs.page=this.page;
    }

    changeLimit(value){
      this.empresa_service.filter_branchs.limit = value;
      this.resetPage();
      this.getBranchs();
    }

}
