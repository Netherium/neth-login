import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { LoginComponent } from '../app/components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatInputHarness } from '@angular/material/input/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AuthService },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have mat-card with title 'Login'", () => {
    const h1 = fixture.nativeElement.querySelector('mat-card-title');
    expect(h1.textContent).toBe('Login');
  });

  it('should have input mat-form-field email and be empty', async () => {
    const emailField = await loader.getHarness(
      MatInputHarness.with({
        selector: '[formControlName="email"]',
      })
    );
    expect(await emailField.getValue()).toBe('');
    expect(await emailField.getType()).toBe('email');
  });

  it('should have input mat-form-field password and be empty', async () => {
    const passwordField = await loader.getHarness(
      MatInputHarness.with({
        selector: '[formControlName="password"]',
      })
    );
    expect(await passwordField.getValue()).toBe('');
    expect(await passwordField.getType()).toBe('password');
  });

  it("should have mat-button with title 'Login' and be disabled", async () => {
    const loginButton = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[mat-raised-button]',
        text: /^(Login)$/,
      })
    );

    expect(await loginButton.getText()).toBe('Login');
    expect(await loginButton.isDisabled()).toBeTrue();
  });
});
