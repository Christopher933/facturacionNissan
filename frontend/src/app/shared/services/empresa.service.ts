import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  api = environment.API;
  filter_branchs;
  filter_branchs_provider;

  constructor(
    private http: HttpClient,
    public router: Router,
    public request_service: RequestService
  ) {

    this.filter_branchs = {
      id_user: this.request_service.id_user,
      is_active: "",
      parameter: "",
      page : 1,
      limit: 10,
    }

    this.filter_branchs_provider = {
      id_user: this.request_service.id_user,
      is_active: "",
      parameter: "",
      page : 1,
      limit: 10,
    }
  }


  getEnterprises(): Observable<any>{
    return this.http.post(this.api + "/getEnterprises", { id_user : this.request_service.id_user})
  }

  addEnterprise(data: object):Observable<any>{
    return this.http.post(this.api + "/addEnterprise",data)
  }

  updateEnterprise(data: object):Observable<any>{
    return this.http.post(this.api+"/updateEnterprise", data)
  }

  getAllBranchs(): Observable<any>{
    return this.http.post(this.api+"/getAllBranchs", this.filter_branchs)
  }

  addBranch(data:object): Observable<any>{
    return this.http.post(this.api + "/addBranch", data)
  }

  updateBranch(data:object): Observable<any>{
    return this.http.post(this.api + "/updateBranch", data)
  }

  addBranchProvider(data:object): Observable<any>{
    return this.http.post(this.api + "/addBranchProvider", data)
  }

  updateBranchProvider(data:object): Observable<any>{
    return this.http.post(this.api + "/updateBranchProvider", data)
  }

  getAllBranchsProvider(): Observable<any>{
    return this.http.post(this.api + "/getAllBranchsProvider", this.filter_branchs_provider)
  }

  getBranch(data):Observable<any>{
    return this.http.post(this.api + "/getBranch", data)
  }
}
