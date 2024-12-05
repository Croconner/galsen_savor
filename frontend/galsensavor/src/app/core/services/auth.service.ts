import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl: string = environment.API_BASE_URL;
  user = new BehaviorSubject<User | null>(null);
  isAdmin = new BehaviorSubject<boolean | undefined>(false);
  isLogged = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }
  // signUp method
  signUp(userObj: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, userObj);
  }

  
  //login method
  login(email: string, password: string): Observable<User> {
    const loginData = { email, password };
    return this.http.post<User>(`${this.baseUrl}/auth/login`, loginData).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user);
        this.user.next(user);
        this.isLogged.next(true);
        this.isAdmin.next(user.roles?.some(role => role.name === 'ADMIN'));
      })
    );
  }

  //change password method
  updatePassword(email: string, newPassword: string) : Observable<any> {
    const changePasswordRequest = {email, newPassword };
    return this.http.put<any>(`${this.baseUrl}/auth/update-password`, changePasswordRequest);
  }

  //logout method
  logout() {
    localStorage.removeItem('user');
    this.user.next(null);
    this.isLogged.next(false);
    this.isAdmin.next(false);
  }
}