import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/shared/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { FacturaInformacionComponent } from '../../_dialogs/factura-informacion/factura-informacion.component';
import { InfoUserDialogComponent } from '../../_dialogs/info-user-dialog/info-user-dialog.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  form_user: FormGroup;
  is_sumitted = false;
  submenu_selected= 1;


  //table users
  @ViewChild('search_input', { static: false }) search_input:any= ElementRef;
  @ViewChild('input_number', { static: false }) input_number:any= ElementRef;

  head_title = ["USUARIO", "CORREO","RFC","ROL","STATUS"];
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
  users = [];
  perfil = [];

  constructor(
    public request_service: RequestService,
    public router: Router,
    public form_builder: FormBuilder,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {

    this.form_user = this.form_builder.group({
      user_name : ["", Validators.required],
      password : ["", Validators.required],
      rfc : ["", Validators.required],
      company_name : ["", Validators.required],
      id_role : ["", Validators.required],
      phone: ["",Validators.required],
      email : ["",Validators.required],
    });
   }

  ngOnInit(): void {
    this.getAllUsers();
    
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

  createUser(){
    this.is_sumitted = true;
    console.log(this.form_user.value)
    if(this.form_user.valid){
      this.request_service.insertUser(this.form_user.value)
       .subscribe(res=>{
         this.is_sumitted=false;
         this.form_user.reset();
         if(this.submenu_selected == 3){
          this.form_user.controls.id_role.setValue(3);
          this.form_user.updateValueAndValidity();
         }
          this.snackbar.open('Usuario Creado', 'Undo', {
            duration: 3000
          });
       })
    }
  }


  selectSubmenu(number:number){
    this.submenu_selected=number;
    this.is_sumitted=false;

    if(this.submenu_selected==1){
      this.form_user.reset();
      this.form_user.get("rfc").clearValidators();
      this.form_user.get("company_name").clearValidators();
      this.form_user.get("phone").clearValidators();
      this.form_user.updateValueAndValidity();
      return;
    }

    if(this.submenu_selected==2){
      this.form_user.reset();
      this.form_user.controls.id_role.setValue(3);
      this.form_user.updateValueAndValidity();
      return;
    }

    if(this.submenu_selected == 3){
      setTimeout(() => {
        this.getUsersByParameter();
      }, 500);
      this.getAllUsers();
    }
  }

  get f() { return this.form_user.controls}


  //table users
  openDialog(i){
    let dialog= this.dialog.open(InfoUserDialogComponent,{
      width: "600px",
      height: "650px",
      data : this.users[i],
    })

    dialog.afterClosed().subscribe(result=>{
      if(result){
        this.getAllUsers();
      }
    })
  }

  getAllUsers(){
    this.request_service.getAllUsers()
    .subscribe(res =>{
      console.log(res)
      this.is_loading = false;
      this.users = res.result;
      this.totalPages(res.total);
    })
  }

  getUsersById(event){
    this.resetPage();
    this.is_loading = true;
    this.request_service.filter_users.id_status = event.id_status;
    this.getAllUsers();
  }


  clearStatusInput(){
    this.resetPage();
    this.request_service.filter_users.id_status = ""
    this.getAllUsers();
  }

  getUsersByParameter() {
    this.resetPage();
    fromEvent(this.search_input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((query_search:any) => {
        if(query_search === ""){
          this.request_service.filter_users.parameter = ""
        }else{
          this.request_service.filter_users.parameter = query_search;
        }
        this.getAllUsers();
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
          this.request_service.filter_users.page =this.page;
          this.getAllUsers();
        }else{
          if(numberPage>this.total_pages){
            this.page=this.total_pages;
            this.request_service.filter_users.page=this.page;
            this.getAllUsers();
          }
        }
    }

    totalPages(res){
      if(res>0){
        this.total_count=res;
        console.log(this.total_count)
        let total = (this.total_count/this.request_service.filter_users.limit) 
        this.total_pages=Math.ceil(total);
        if(this.request_service.filter_users.limit*this.page<this.total_count)
        {
          this.showing_page=this.request_service.filter_users.limit*this.page;
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
      this.request_service.filter_users.page=this.page;
    }

    changeLimit(value){
      this.request_service.filter_users.limit = value;
      this.resetPage();
      this.getAllUsers();
    }

}
