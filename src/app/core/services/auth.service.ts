import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError, switchMap } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginCredentials, RegisterCredentials, User } from '@core/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = `${environment.apiUrl}/v1/auth`;

  #currentUser = signal<User | null>(null);
  #isLoading = signal<boolean>(true);
  
  public currentUser = computed(() => this.#currentUser());
  public isAuthenticated = computed(() => !!this.#currentUser());
  public isLoading = computed(() => this.#isLoading());

  constructor() {
    this.checkAuthStatus();
  }

  login(credentials: LoginCredentials) {
    return this.http.post<boolean>(`${this.API_URL}/login`, credentials)
      .pipe(
        switchMap(() => this.getUserProfile()),
        catchError(err => {
          this.#currentUser.set(null);
          return throwError(() => err);
        })
      );
  }

  getUserProfile() {
    return this.http.get<User>(`${this.API_URL}/me`)
    .pipe(
      tap(user => this.#currentUser.set(user))
    );
  }

  register(data: RegisterCredentials) {
    return this.http.post<any>(`${this.API_URL}/register`, data);
  }
  
  

  logout() {
    this.http.post(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.#currentUser.set(null);
          this.router.navigate(['/auth/login']);
        }),
        catchError(() => {
          this.#currentUser.set(null);
          this.router.navigate(['/auth/login']);
          return throwError(() => new Error('Logout failed'));
        })
      )
      .subscribe();
  }

  private checkAuthStatus() {
    this.getUserProfile().subscribe({
      next: () => this.#isLoading.set(false),
      error: () => {
        this.#currentUser.set(null);
        this.#isLoading.set(false);
      }
    });
  }
}
