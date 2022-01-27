import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  api = environment.API;
  notifications_filter: any;
  no_read;

  constructor(
    private http: HttpClient,
    public router: Router,
    public request_service: RequestService
  ) {
    this.notifications_filter = {
      id_user: request_service.id_user,
      parameter : "",
      date : null,
      limit : 10,
      page: 1
    }
   }

   getNotifications(): Observable<any>{
     return this.http.post(this.api + "/getNotifications", this.notifications_filter);
   }

   getNotificationsNoRead(id_user): Observable<any>{
     return this.http.post(this.api + "/getNotificationsNoRead", id_user)
   }

   readNotification(data):Observable<any>{
     return this.http.post(this.api+ "/readNotification", data)
   }
}
