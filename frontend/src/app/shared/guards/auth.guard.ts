import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(public router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
    if(localStorage.getItem('session')) {
      return true;
    }else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
  
}
