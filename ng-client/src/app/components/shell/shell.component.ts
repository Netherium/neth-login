import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../../models/auth-user.model';
import { Router } from '@angular/router';
import { ResponsiveLayoutService } from '../../services/responsive-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  isSmall$: Observable<boolean> = this.layout.isSmall();
  currentUser: Observable<AuthUser | null>;
  darkTheme?: boolean;

  constructor(
    private layout: ResponsiveLayoutService,
    private breakpointObserver: BreakpointObserver,
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }

  setTheme(isDarkTheme: boolean): void {
    this.themeService.setTheme(isDarkTheme);
  }

  selectedThemeChanged(event: boolean): void {
    this.themeService.selectedThemeChanged(event);
  }
}
