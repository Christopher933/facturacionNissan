import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { RequestService } from 'src/app/shared/services/request.service';
import { AddBranchProviderComponent } from '../../_dialogs/add-branch-provider/add-branch-provider.component';
import { AddMonthlyComplianceComponent } from '../../_dialogs/add-monthly-compliance/add-monthly-compliance.component';
import { PerfilDocumentsComponent } from '../../_dialogs/perfil-documents/perfil-documents.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit ,AfterViewInit{

  perfil:any;
  form_perfil:FormGroup;
  submenu_selected= 1;
  is_submitted = false;


  //table users
  @ViewChild('search_input', { static: false }) search_input:any= ElementRef;
  @ViewChild('input_number', { static: false }) input_number:any= ElementRef;

  branchs_titles = ["NOMBRE", "COLONIA", "TELEFONO", "CORREO", "ESTATUS"]
  documents_titles = ["","NOMBRE","MES","CREACION", "STATUS"]
  documents = [{name: "Cumplimiento del mes"},{name: "Cuentas Bancarias"},{name: "Cedula fiscal"},{name: "Acta constitutiva"},{name: "Comprobante de domicilio"},{name: "INE"},]
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
  monthly_compliance:any = null;
  files_perfil = [];
  months = [
    {name: "Enero", value: 1},
    {name: "Febrero", value: 2},
    {name: "Marzo", value: 3},
    {name: "Abril", value: 4},
    {name: "Mayo", value: 5},
    {name: "Junio", value: 6},
    {name: "Julio", value: 7},
    {name: "Agosto", value: 8},
    {name: "Septiembre", value: 9},
    {name: "Octubre", value: 10},
    {name: "Noviembre", value: 11},
    {name: "Diciembre", value: 12},
  ];

  constructor(
    public request_service: RequestService,
    public form_builder: FormBuilder,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    public empresa_service: EmpresaService,
  ) { 

    this.form_perfil = this.form_builder.group({
      email : [""],
      phone : [""]
    });
   
  }

  ngOnInit(): void {
    this.getPerfil();

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

    this.getLastMonthlyCompliance();
    this.getFilesPerfil();
  }

  ngAfterViewInit():void{
    this.form_perfil.get("email").setValue(this.perfil.email)
    this.form_perfil.get("phone").setValue(this.perfil.phone)
  }

  getPerfil(){
    this.request_service.getPerfil(this.request_service.id_user)
      .subscribe(res=>{
        this.perfil= res.result;
        console.log("perfil",this.perfil)
      })
  }

  updateProfile(){
    let data = {
      ...this.form_perfil.value,
      id_user: this.request_service.id_user,
    }

    this.request_service.updateProfile(data)
      .subscribe(res=>{
        this.getPerfil();
        this.alerta();
      })
  }

  alerta(){
    this.snackbar.open('Informacion Actualizada', 'Undo', {
      duration: 3000
    });
  }

  openMonthlyComplianceDialog(){
    let dialog= this.dialog.open(AddMonthlyComplianceComponent,{
      width: "600px",
      height: "550px",
      data : this.monthly_compliance,
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getLastMonthlyCompliance()
      }
    })
  }

  openFilesDialog(file){
    let temp = file.name;
    let type_file = temp.replace(/\s+/g, '')
    let dialog= this.dialog.open(PerfilDocumentsComponent,{
      width: "600px",
      height: "550px",
      data : {
        file_info : file,
        type_file: type_file
      },
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getFilesPerfil();
      }
    })
  }

  selectSubmenu(number:number){
    this.submenu_selected=number;
    this.is_submitted=false;

    if(this.submenu_selected==1){

      return;
    }

    if(this.submenu_selected==2){
      setTimeout(() => {
        this.getBranchs();
        this.getBranchsByParameter();
      }, 200);
      return;
    }

    if(this.submenu_selected == 3){
    }
  }

  getBranchs(){
    this.empresa_service.getAllBranchsProvider()
    .subscribe(res =>{
      console.log("vamooss",res)
      this.is_loading = false;
      this.branchs = res.result;
      this.totalPages(res.total);
    })
  }

  openDialogBranch(branch){
    let dialog = this.dialog.open(AddBranchProviderComponent,{
      width: "600px",
      height: "650px",
      data: {
        branch,
        enterprises: this.enterprises,
        id_provider: this.perfil.id_provider
      },
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getBranchs();
      }
    })
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
          this.empresa_service.filter_branchs_provider.parameter = ""
        }else{
          this.empresa_service.filter_branchs_provider.parameter = query_search;
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
          this.empresa_service.filter_branchs_provider.page =this.page;
          this.getBranchs();
        }else{
          if(numberPage>this.total_pages){
            this.page=this.total_pages;
            this.empresa_service.filter_branchs_provider.page=this.page;
            this.getBranchs();
          }
        }
    }

    totalPages(res){
      if(res>0){
        this.total_count=res;
        console.log(this.total_count)
        let total = (this.total_count/this.empresa_service.filter_branchs_provider.limit) 
        this.total_pages=Math.ceil(total);
        if(this.empresa_service.filter_branchs_provider.limit*this.page<this.total_count)
        {
          this.showing_page=this.empresa_service.filter_branchs_provider.limit*this.page;
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
      this.empresa_service.filter_branchs_provider.page=this.page;
    }

    changeLimit(value){
      this.empresa_service.filter_branchs_provider.limit = value;
      this.resetPage();
      this.getBranchs();
    }

    getBranchsByStatus(event){
      this.resetPage();
      this.is_loading = true;
      this.empresa_service.filter_branchs_provider.is_active = event.id_status;
      this.getBranchs();
    }
  
    clearStatusInput(){
      this.resetPage();
      this.empresa_service.filter_branchs_provider.is_active = ""
      this.getBranchs();
    }


    getLastMonthlyCompliance(){
      let data = {
        id_user: this.request_service.id_user
      }

      this.request_service.getLastMonthlyCompliance(data)
      .subscribe(res=>{
        if(res.status){
          this.monthly_compliance = res.result;
        }
      })
    }

    getFilesPerfil(){
      this.request_service.getFilesPerfil()
      .subscribe(res=>{
        this.files_perfil = res.result;
        console.log("files",res)
      })
    }

}
