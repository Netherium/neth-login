import { Injectable, isDevMode } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class HttpGenericService {
  private url = `${environment.apiUrl}/`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService
  ) {}

  /**
   * Generic HttpRequest for GET method, expects single item
   * GET T
   */
  show<T>(
    id: string | null,
    endpoint: string
  ): Observable<HttpErrorResponse | T> {
    return this.http.get<T>(`${this.url + endpoint}/${id}`).pipe(
      tap((t: T) => (isDevMode() ? console.log(`service.show(${t})`) : null)),
      catchError(this.errorHandler.handleError<T>(`service.show`))
    );
  }

  /**
   * Generic HttpRequest for POST method, expects single item
   * POST T
   */
  create<T>(endpoint: string, model: T): Observable<T | HttpErrorResponse> {
    return this.http.post<T>(`${this.url + endpoint}`, model, httpOptions).pipe(
      tap((t: T) => (isDevMode() ? console.log(`service.create`, t) : null)),
      catchError(this.errorHandler.handleError<T>('service.create'))
    );
  }

  /**
   * Generic HttpRequest for POST method, expects single item
   * PUT T
   */
  update<T extends { id: string | number }>(
    endpoint: string,
    model: T
  ): Observable<T | HttpErrorResponse> {
    return this.http
      .put(`${this.url + endpoint}/${model.id}`, model, httpOptions)
      .pipe(
        tap((t: any) =>
          isDevMode() ? console.log(`service.update`, t) : null
        ),
        catchError(this.errorHandler.handleError<T>('service.update'))
      );
  }

  /**
   * Generic HttpRequest for DELETE method, expects single item
   * DELETE T
   */
  delete<T>(
    endpoint: string,
    id: string | number
  ): Observable<T | HttpErrorResponse> {
    return this.http
      .delete<T>(`${this.url + endpoint}/${id}`, httpOptions)
      .pipe(
        tap((_) => (isDevMode() ? console.log(`service.delete`, id) : null)),
        catchError(this.errorHandler.handleError<T>('service.delete'))
      );
  }
}
