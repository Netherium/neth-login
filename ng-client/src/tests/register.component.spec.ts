import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { RegisterComponent } from '../app/components/register/register.component';
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should have mat-card with title 'Register'", () => {
    const h1 = fixture.nativeElement.querySelector('mat-card-title');
    expect(h1.textContent).toBe('Register');
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

  it('should have input mat-form-field fullName and be empty', async () => {
    const fullNameField = await loader.getHarness(
      MatInputHarness.with({
        selector: '[formControlName="fullName"]',
      })
    );

    expect(await fullNameField.getValue()).toBe('');
    expect(await fullNameField.getType()).toBe('text');
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

  it("should have mat-button with title 'Register' and be disabled", async () => {
    const registerButton = await loader.getHarness(
      MatButtonHarness.with({
        selector: '[mat-raised-button]',
        text: /^(Register)$/,
      })
    );

    expect(await registerButton.getText()).toBe('Register');
    expect(await registerButton.isDisabled()).toBeTrue();
  });
});
