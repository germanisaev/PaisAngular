import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { Employee, SearchResult, State } from '../models/employee.model';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, delay, of, retry, switchMap, tap, throwError } from 'rxjs';

const REST_API_SERVER: string = 'https://localhost:7266/api/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
    
    private data!: Employee;
    private dataSub = new BehaviorSubject<Employee>(this.data);
    public getDataSub = this.dataSub.asObservable();
    public setDataSub(emp: Employee) {
        this.dataSub.next(emp);
    }

    private _refreshNeeded$ = new Subject<void>();

    get refreshNeeded$() {
        return this._refreshNeeded$;
    }

	httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    getItems(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${REST_API_SERVER}/getemployeelist`)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
                catchError(this.errorHandler)
            );
    }

    getItemBy(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${REST_API_SERVER}/getemployeebyid?Id=${id}`)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
                catchError(this.errorHandler)
            );
    }

    createItem(item: Employee): Observable<Employee> { 
        return this.http.post<Employee>(`${REST_API_SERVER}/addemployee`, JSON.stringify(item), this.httpOptions)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
                catchError(this.errorHandler)
            );
    }

    deleteItem(id: number) { 
        return this.http.delete(`${REST_API_SERVER}/deleteemployee?Id=${id}`, this.httpOptions)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
                catchError(this.errorHandler)
            );
    }
  
    patchItem(item: Employee, id: number) {
        return this.http.patch(`${REST_API_SERVER}/updateemployee/${id}`, JSON.stringify(item), this.httpOptions)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
                catchError(this.errorHandler)
            );
    }

    updateItem(item: Employee) { // https://localhost:7266/api/Employee/updateemployee
        return this.http.put(`${REST_API_SERVER}/updateemployee`, JSON.stringify(item), this.httpOptions)
            .pipe(
                tap(() => {
                    this._refreshNeeded$.next();
                }),
                retry(3),
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
