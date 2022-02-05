import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import { LoginCredentials } from '../models/login-credentials.model';
import { AuthUser } from '../models/auth-user.model';
import { JWT } from '../models/jwt.model';
import { JwtDecoded } from '../models/jwt-decoded.model';
import { RegisterCredentials } from '../models/register-credentials.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSubject: BehaviorSubject<AuthUser | null>;
  currentUser: Observable<AuthUser | null>;
  private authUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      this.getStoredUser()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * POST LoginCredentials
   * set JWT to localStorage
   */
  login(
    loginCredentials: LoginCredentials
  ): Observable<AuthUser | HttpErrorResponse> {
    return this.http
      .post<JWT>(`${this.authUrl}/auth/login`, loginCredentials, httpOptions)
      .pipe(
        switchMap((jwt) => {
          if (jwt && jwt.token) {
            localStorage.setItem('JWT', JSON.stringify(jwt.token));
            return this.http
              .get<AuthUser>(`${this.authUrl}/auth/profile`, {
                headers: new HttpHeaders(this.getAuthHeaders()),
              })
              .pipe(
                map((user) => {
                  localStorage.setItem('User', JSON.stringify(user));
                  this.currentUserSubject.next(user);
                  return user;
                })
              );
          } else {
            return EMPTY;
          }
        }),
        catchError(
          this.errorHandler.handleErrorWithMessage('authService.login')
        )
      );
  }

  /**
   * POST RegisterCredentials to /auth/register
   * set JWT to localStorage
   * get User from /auth/profile
   */
  register(
    registerCredentials: RegisterCredentials
  ): Observable<AuthUser | HttpErrorResponse> {
    return this.http
      .post<JWT>(
        `${this.authUrl}/auth/register`,
        registerCredentials,
        httpOptions
      )
      .pipe(
        switchMap((jwt) => {
          if (jwt && jwt.token) {
            localStorage.setItem('JWT', JSON.stringify(jwt.token));
            return this.http
              .get<AuthUser>(`${this.authUrl}/auth/profile`, {
                headers: new HttpHeaders(this.getAuthHeaders()),
              })
              .pipe(
                map((user) => {
                  localStorage.setItem('User', JSON.stringify(user));
                  this.currentUserSubject.next(user);
                  return user;
                })
              );
          } else {
            return EMPTY;
          }
        }),
        catchError(
          this.errorHandler.handleErrorWithMessage('authService.register')
        )
      );
  }

  /**
   * Cleans up localStorage from JWT, User
   * and sets currentUser to null
   */
  logout(): void {
    localStorage.removeItem('JWT');
    localStorage.removeItem('User');
    this.currentUserSubject.next(null);
  }

  /**
   * Returns JWT headers for token-interception
   */
  getAuthHeaders(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.getStoredJWT()}`,
    };
  }

  /**
   * Returns AuthUser from localstorage
   */
  getStoredUser(): AuthUser {
    return JSON.parse(<string>localStorage.getItem('User'));
  }

  /**
   * Returns JWT from localstorage
   */
  getStoredJWT(): string {
    return JSON.parse(<string>localStorage.getItem('JWT'));
  }

  /**
   *  Used by AuthGuard
   *  Returns if user has valid token and not expired
   */
  isAuthenticated(): boolean {
    try {
      const token = this.getStoredJWT();
      const decodedToken = jwt_decode<JwtDecoded>(token);
      const dateNow = new Date().getTime() / 1000;

      return decodedToken.exp > dateNow;
    } catch (e) {
      return false;
    }
  }
}
