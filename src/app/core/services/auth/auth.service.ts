import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { IUser } from '../../models/IUser/iuser.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  isLogged = signal<boolean>(false);
  currentUser = signal<IUser | null>(null);

  constructor() {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const savedUser = localStorage.getItem('freshUser');
      const token = localStorage.getItem('freshToken');

      if (savedUser && token) {
        this.currentUser.set(JSON.parse(savedUser));
        this.isLogged.set(true);
      }
    }
  }

  signOut(): void {
    localStorage.removeItem('freshToken');
    localStorage.removeItem('freshUser');
    this.currentUser.set(null);
    this.isLogged.set(false);
    this.router.navigate(['/login']);
  }

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/signup`, data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/signin`, data);
  }

  forgotPassword(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/forgotPasswords`, data);
  }

  verifyResetCode(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/auth/verifyResetCode`, data);
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v1/auth/resetPassword`, data);
  }

  updateLoggedUserPassword(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v1/users/changeMyPassword`, data);
  }
}
