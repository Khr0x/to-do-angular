import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginCredentials, LoginResponse, User } from '@core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Estado reactivo del usuario
  #currentUser = signal<User | null>(null);
  
  // Exponemos el usuario como un Signal de solo lectura
  public currentUser = computed(() => this.#currentUser());
  public isAuthenticated = computed(() => !!this.#currentUser());

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: LoginCredentials) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.#currentUser.set(res.user);
        }),
        catchError(err => {
          console.error('Error en login:', err);
          return throwError(() => err);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.#currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Aquí podrías hacer una petición 'me' o 'validate' a tu API
    // Por ahora, simularemos que recuperamos el usuario si hay token
    // this.http.get<User>(`${this.API_URL}/me`)...
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
