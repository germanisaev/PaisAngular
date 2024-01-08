import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject!: BehaviorSubject<User>;
  public user!: Observable<User>;
  public getUser!: Observable<User>;

  constructor() {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
    this.getUser = this.userSubject.asObservable();
  }

  public setUser(data: any) {
    this.userSubject.next(data);
  }

  login(username: any, password: any) {
    let data: User = {
      username: username,
      password: password
    };
    localStorage.setItem('user', JSON.stringify(data));
    this.setUser(data);
    return this.getUser;
  }
}
