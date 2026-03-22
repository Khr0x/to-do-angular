import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordPatternValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  passwordPatternValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && !this.PASSWORD_REGEX.test(control.value)) {
      return { passwordPattern: true };
    }
    return null;
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }
    }
    return null;
  }

  getPasswordErrorMessage(): string {
    const control = this.registerForm.get('password');
    if (!control || !control.touched || control.valid) return '';

    if (control.hasError('required')) return 'La contraseña es requerida';
    if (control.hasError('minlength')) return 'Mínimo 8 caracteres';
    if (control.hasError('passwordPattern')) return 'Debe incluir mayúscula, minúscula, número y carácter';

    return 'Contraseña no válida';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.registerForm.get('confirmPassword');
    if (!control || !control.touched || control.valid) return '';

    if (control.hasError('required')) return 'Confirma tu contraseña';
    if (control.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';

    return 'Confirmación no válida';
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const registerData = this.registerForm.getRawValue();

    this.authService.register(registerData)
    .pipe(
      finalize(() => this.isLoading.set(false))
    )
    .subscribe({
      next: () => this.router.navigate(['/auth/register-success']),
      error: (err: any) => {
        this.errorMessage.set(err.error?.message || 'Error al crear la cuenta. Intenta de nuevo.');
      }
    });

  }
}
