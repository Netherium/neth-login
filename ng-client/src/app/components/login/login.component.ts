import { Component } from '@angular/core';
import { LoginCredentials } from '../../models/login-credentials.model';
import { AuthService } from '../../services/auth.service';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isLoading = false;
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
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

  login(): void {
    const snackbarConfigSuccess: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary'],
    };

    const snackbarConfigError: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-accent'],
    };
    this.isLoading = true;
    const loginCredentials: LoginCredentials = {
      email: (this.loginForm.get('email') as AbstractControl).value,
      password: (this.loginForm.get('password') as AbstractControl).value,
    };
    let snackBarRef: MatSnackBarRef<any>;
    this.authService.login(loginCredentials).subscribe((data) => {
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
