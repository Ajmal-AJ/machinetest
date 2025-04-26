import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { UserForm } from '../models/registration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://taskapi.ajmalaj.com/api';
  public userListRefreshNeeded = new Subject<void>();
  private resetFormSubject = new Subject<void>();


  constructor(private http : HttpClient) { }


  getRegisteredUsers() : Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/`);
  }

  postUserRegisterData(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/register/`, data)
      .pipe(
        tap(() => {
          this.userListRefreshNeeded.next();
        })
      );
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/`, data);
  }


  deleteUser(id:number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}/`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${id}/`);
  }



  get refreshNeeded$() {
    return this.userListRefreshNeeded.asObservable();
  }

  get resetForm$() {
    return this.resetFormSubject.asObservable();
  }

  resetForm() {
    this.resetFormSubject.next();
  }
}
