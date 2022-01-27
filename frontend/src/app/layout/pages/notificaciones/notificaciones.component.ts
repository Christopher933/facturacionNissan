import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { RequestService } from 'src/app/shared/services/request.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {

  @ViewChild('search_input', { static: false }) search_input:any= ElementRef;
  @ViewChild('input_date', { static: false }) input_date:any= ElementRef;

  head_title = ["TITULO", "MENSAJE","FECHA"];
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
  is_show_clear_icon:boolean=false;
  notifications: Array<any> = []


  constructor(
    public router: Router,
    public request_service: RequestService,
    public notifications_service: NotificationsService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getNotificationsByParameter();
    }, 500);
    this.getNotifications();
  }

  getNotificationsByParameter() {
    this.resetPage();
    fromEvent(this.search_input.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((query_search:any) => {
        if(query_search === ""){
          this.notifications_service.notifications_filter.parameter = ""
        }else{
          this.notifications_service.notifications_filter.parameter = query_search;
        }
        this.getNotifications();
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
        this.notifications_service.notifications_filter.page =this.page;
        this.getNotifications();
      }else{
        if(numberPage>this.total_pages){
          this.page=this.total_pages;
          this.notifications_service.notifications_filter.page=this.page;
          this.getNotifications();
        }
      }
  }

  totalPages(res){
    if(res>0){
      this.total_count=res;
      console.log(this.total_count)
      let total = (this.total_count/ this.notifications_service.notifications_filter.limit) 
      this.total_pages=Math.ceil(total);
      if( this.notifications_service.notifications_filter.limit*this.page<this.total_count)
      {
        this.showing_page= this.notifications_service.notifications_filter.limit*this.page;
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

  changeLimit(value){
    this.notifications_service.notifications_filter.limit = value;
    this.resetPage();
    this.getNotifications();
  }

  resetPage(){
    this.page=1;
    this.notifications_service.notifications_filter.page=this.page;
  }

  getNotifications(){
    this.notifications_service.getNotifications()
    .subscribe(res =>{
      console.log(res)
      this.is_loading = false;
      this.notifications = res.result;
      this.totalPages(res.total);
    })
  }

  getNotificationsByDate(event){

  }

  clearDateFilter(){
    this.resetPage();
    this.input_date.nativeElement.value=null;
    this.is_show_clear_icon=false;
    this.request_service.filter_parameters.issue_date = null
    this.getNotifications();
  }

  readNotification(notification){
    let data = {
      id_user: this.request_service.id_user,
      id_notification: notification.id_notification_admin ? notification.id_notification_admin : notification.id_notification
    }

    this.notifications_service.readNotification(data)
    .subscribe(res=>{
      if(res.status){
        this.notifications_service.no_read--;
        notification.is_read = 1 ;
      }
    })
  }

}
