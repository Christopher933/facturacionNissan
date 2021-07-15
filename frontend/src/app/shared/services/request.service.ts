import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  api = environment.API;

  constructor(
    private http: HttpClient,
  ) { }

  reqPOST(url: string, data: any): Observable<any> {
    return this.http.post<any>(this.api + url, data)
      .pipe(
        catchError((err) =>
          err.error === 404 ? throwError('Not found') : throwError(err)
        )
      );
  }
}
