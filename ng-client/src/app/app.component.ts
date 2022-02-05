import { AfterViewInit, Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private themeService: ThemeService
  ) {
    this.registerSVG();
  }

  registerSVG(): void {
    this.matIconRegistry.addSvgIconSetInNamespace(
      'neth',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/icon-set.svg'
      )
    );
  }

  ngAfterViewInit(): void {
    this.themeService.initTheme();
    const loader = document.getElementById('app-loader');
    setTimeout(() => {
      loader?.classList.add('animate-spinner');
    }, 100);

    setTimeout(() => {
      loader?.parentElement?.removeChild(loader);
    }, 800);
  }
}
