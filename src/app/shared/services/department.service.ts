import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Department } from '../models/department.model';

const REST_API_SERVER: string = 'https://localhost:7266/api/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getItems(): Observable<Department[]> {
      return this.http.get<Department[]>(`${REST_API_SERVER}/getdepartmentlist`)
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
