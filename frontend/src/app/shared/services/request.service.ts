import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterInvoice } from '../models/filter-invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  api = environment.API;
  storage:any;
  filter_parameters:any;
  filter_users:any;
  id_user = ""
  id_rol = ""


  constructor(
    private http: HttpClient,
    public router: Router,
  ) { 
    if(JSON.parse(localStorage.getItem("session"))){
      this.storage = JSON.parse(localStorage.getItem("session")  || "");
      this.id_user = this.storage.token
      this.id_rol = this.storage.role
    }

    this.filter_parameters = {
      id_user : this.id_user ,
      id_rol : this.id_rol ,
      issue_date: "",
      id_status: "",
      parameter: "",
      page : 1,
      limit: 10,
    }

    this.filter_users={
      id_user: this.id_user,
      id_status: "",
      parameter: "",
      page : 1,
      limit: 10,
    }
  }


  reqPOST(url: string, data: any): Observable<any> {
    return this.http.post<any>(this.api + url, data)
      .pipe(
        catchError((err) =>
          err.error === 404 ? throwError('Not found') : throwError(err)
        )
      );
  }

  getPerfil(id): Observable<any>{
    return this.http.get(this.api+"/perfil/"+id);
  }

  updateProfile(data:object){
    return this.http.post(this.api+"/update_profile",data)
  }


  insertUser(data: object):Observable<any>{
    return this.http.post(this.api + "/insert_user",data);
  }

  uploadFactura(data:any): Observable<any>{
    return this.http.post(this.api+ "/upload_file",data)
  }

  getFacturas(): Observable<any>{
    return this.http.post(this.api+"/get_facturas", this.filter_parameters);
  }

  downloadFile(path): Observable<any>{
    return this.http.post(this.api+"/downloadArchive",{path: path},{ responseType: 'blob'})
  }

  sendContrarecibo(data): Observable<any>{
    return this.http.post(this.api+"/sendContrarecibo",data)
  }

  downloadContrarecibo(id): Observable<any>{
    return this.http.post(this.api+"/downloadContrarecibo",{id_contrarecibo: id},{ responseType: 'blob'})
  }

  resendContrarecibo(id): Observable<any>{
    return this.http.post(this.api + "/resendContrarecibo",id)
  }

  sendPayment(data): Observable<any>{
    return this.http.post(this.api + "/insertPayment", data)
  }

  downloadPayment(data): Observable<any>{
    return this.http.post(this.api + "/downloadPayment", data, { responseType: 'blob'})
  }

  getAllUsers(): Observable<any>{
    return this.http.post(this.api + "/getAllUsers",this.filter_users)
  }

  updateUser(data): Observable<any>{
    return this.http.post(this.api + "/updateUser", data)
  }

  uploadBankAccounts(data): Observable<any>{
    return this.http.post(this.api + "/uploadBankAccounts", data)
  }

  getBankAccounts(id):Observable<any>{
    return this.http.get(this.api + "/getBankAccounts/"+ id)
  }

  


  logout() {
    localStorage.removeItem('session');
    window.location.reload();
  }
}
