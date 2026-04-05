import { inject, Injectable, RendererFactory2, Renderer2, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MyTranslateService {
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly platformId = inject(PLATFORM_ID);
  private renderer: Renderer2;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  changeDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const lang = localStorage.getItem('lang') || 'en';
      const htmlElement = document.documentElement;

      if (lang === 'en') {
        this.renderer.setAttribute(htmlElement, 'dir', 'ltr');
        this.renderer.setAttribute(htmlElement, 'lang', 'en');
      } else if (lang === 'ar') {
        this.renderer.setAttribute(htmlElement, 'dir', 'rtl');
        this.renderer.setAttribute(htmlElement, 'lang', 'ar');
      }
    }
  }
}
