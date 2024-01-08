import { Injectable } from '@angular/core';
import { RoleCompany } from '../models/role.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const REST_API_SERVER: string = 'https://localhost:7266/api/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getItems(): Observable<RoleCompany[]> {
      return this.http.get<RoleCompany[]>(`${REST_API_SERVER}/getrolelist`)
          .pipe(
              catchError(this.errorHandler)
          );
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
    } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
