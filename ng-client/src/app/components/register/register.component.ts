import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterCredentials } from '../../models/register-credentials.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  isLoading = false;
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, Validators.minLength(5)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])(.*)$/),
      ],
    ],
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  register(): void {
    const snackbarConfigSuccess: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary'],
    };

    const snackbarConfigError: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-accent'],
    };
    this.isLoading = true;
    const registerCredentials: RegisterCredentials = {
      email: (this.registerForm.get('email') as AbstractControl).value,
      fullName: (this.registerForm.get('fullName') as AbstractControl).value,
      password: (this.registerForm.get('password') as AbstractControl).value,
    };
    let snackBarRef: MatSnackBarRef<any>;
    this.authService.register(registerCredentials).subscribe((data) => {
      this.isLoading = false;
      if (data instanceof HttpErrorResponse) {
        snackBarRef = this.snackBar.open(
          data.error.message,
          undefined,
          snackbarConfigError
        );
      } else {
        snackBarRef = this.snackBar.open(
          `Welcome ${data.fullName}!`,
          'Logout',
          snackbarConfigSuccess
        );
        this.triggerAnimation();
        this.snackBarLogoutSubscription(snackBarRef);
      }
    });
  }

  private snackBarLogoutSubscription(snackBarRef: MatSnackBarRef<any>) {
    snackBarRef.onAction().subscribe(() => {
      this.authService.logout();
      this.router.navigate(['login']).then();
    });
  }

  private triggerAnimation(): void {
    document.getElementById('auth-loader')?.classList.add('animate-spinner');
    setTimeout(() => {
      this.router.navigate(['']).then();
    }, 500);
  }
}
