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
  filter_contrarecibo:any
  id_user:string = ""
  id_role:number;
  user_name:string;
  id_branch:number;
  id_enterprise:number;
  is_monthly_compliance: boolean = false;
  first_name: string;
  last_name_1 :string;
  last_name_2: string;


  constructor(
    private http: HttpClient,
    public router: Router,
  ) { 
    if(JSON.parse(localStorage.getItem("session"))){
      this.storage = JSON.parse(localStorage.getItem("session"));
      this.id_user = this.storage.id_user
      this.id_role = this.storage.id_role
      this.user_name = this.storage.user_name;
      this.id_branch = this.storage.id_branch;
      this.id_enterprise = this.storage.id_enterprise;
      this.first_name = this.storage.first_name;
      this.last_name_1 = this.storage.last_name_1;
      this.last_name_2 = this.storage.last_name_2;
    }

    this.filter_parameters = {
      id_user : this.id_user ,
      id_role : this.id_role ,
      issue_date: null,
      id_status: "",
      parameter: "",
      page : 1,
      limit: 10,
      id_branch:  ""
    }

    this.filter_users={
      id_user: this.id_user,
      id_status: "",
      parameter: "",
      page : 1,
      limit: 10,
    }

    this.filter_contrarecibo={
      id_user: this.id_user,
      id_status_contrarecibo: "",
      promise_date: null,
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

  getFilesPerfil():Observable<any>{
    return this.http.post(this.api + "/getFilesPerfil",{ id_user: this.id_user })
  }

  uploadMonthlyCompliance(data):Observable<any>{
    return this.http.post(this.api + "/uploadMonthlyCompliance",data)
  }

  getLastMonthlyCompliance(data):Observable<any>{
    return this.http.post(this.api + "/getLastMonthlyCompliance",data)
  }

  updateMonthlyCompliance(data):Observable<any>{
    return this.http.post(this.api + "/updateMonthlyCompliance",data)
  }

  uploadFilesPerfil(data):Observable<any>{
    return this.http.post(this.api + "/uploadFilesPerfil", data)
  }

  updateFilePerfil(data): Observable<any>{
    return this.http.post(this.api + "/updateFilePerfil", data)
  }

  getInvoicesInProgress(data):Observable<any>{
    return this.http.post(this.api + "/getInovicesInProgress",data)
  }

  getAllContrarecibo(): Observable<any>{
    return this.http.post(this.api + "/getAllContrarecibos", this.filter_contrarecibo)
  }

  getInvoicesByContrarecibo(data):Observable<any>{
    return this.http.post(this.api + "/getInvoicesByContrarecibo", data)
  }

  rejectInvoice(data): Observable<any>{
    return this.http.post(this.api + "/rejectInvoice", data)
  }

  getNotes(data): Observable<any>{
    return this.http.post(this.api + "/getNotes",data)
  }

  updateInfoInvoice(data): Observable<any>{
    return this.http.post(this.api + "/updateInfoInvoice",data)
  }

  updateFilesInvoice(data):Observable<any>{
    return this.http.post(this.api + "/updateFilesInvoice", data)
  }

  logout() {
    localStorage.removeItem('session');
    window.location.reload();
  }
}
