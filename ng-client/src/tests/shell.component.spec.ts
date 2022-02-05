import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { ShellComponent } from '../app/components/shell/shell.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../app/services/auth.service';
import { ObserversModule } from '@angular/cdk/observers';
import { ResponsiveLayoutService } from '../app/services/responsive-layout.service';
import { ThemeService } from '../app/services/theme.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ShellComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          ObserversModule,
        ],
        providers: [
          { provide: ResponsiveLayoutService },
          { provide: ThemeService },
          { provide: AuthService },
          { provide: ComponentFixtureAutoDetect, useValue: true },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
