import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { Employee, SearchResult, State } from '../models/employee.model';
import { BehaviorSubject, Observable, Subject, catchError, debounceTime, delay, of, retry, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

    private data!: Employee;
    private dataSub = new BehaviorSubject<Employee>(this.data);
    public getDataSub = this.dataSub.asObservable();
    public setDataSub(emp: Employee) {
        this.dataSub.next(emp);
    }
}