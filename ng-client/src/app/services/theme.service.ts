import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkTheme?: boolean;

  /**
   * Initialize theme from localStorage
   */
  initTheme(): void {
    const theme = JSON.parse(<string>localStorage.getItem(`DarkTheme`));
    if (theme) {
      this.selectedThemeChanged(true);
    } else {
      this.selectedThemeChanged(false);
    }
  }

  /**
   * Set theme, by adding class 'dark-theme'
   */
  setTheme(isDarkTheme: boolean): void {
    const bodyEl = document.getElementById('body');
    if (isDarkTheme) {
      bodyEl?.classList.add('dark-theme');
    } else {
      bodyEl?.classList.remove('dark-theme');
    }
  }

  /**
   * Change selected theme and store in localStorage
   */
  selectedThemeChanged(event: boolean): void {
    this.darkTheme = event as boolean;
    localStorage.setItem(`DarkTheme`, JSON.stringify(event));
    this.setTheme(this.darkTheme);
  }
}
