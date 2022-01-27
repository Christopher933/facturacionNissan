import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, AfterViewInit {

  constructor(
    public router: Router,
    public request_service: RequestService,
    public notifications_service: NotificationsService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.getNotificationsNoRead()
    this.getLastMonthlyCompliance();
  }

  getNotificationsNoRead(){
    let data = {
      id_user : this.request_service.id_user
    }

    this.notifications_service.getNotificationsNoRead(data)
    .subscribe(res =>{
      this.notifications_service.no_read = res.total;
    })
  }

  getLastMonthlyCompliance(){
    let data = {
      id_user: this.request_service.id_user
    }

    this.request_service.getLastMonthlyCompliance(data)
    .subscribe(res=>{
      if(res.status){
        this.request_service.is_monthly_compliance = true;
      }
    })
  }

}
