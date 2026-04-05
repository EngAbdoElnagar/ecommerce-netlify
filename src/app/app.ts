import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import * as AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from './core/services/myTranslate/my-translate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ecommerce');
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  private myTranslateService = inject(MyTranslateService);

    constructor() {
      this.translate.addLangs(['de', 'en']);
      if (isPlatformBrowser(this.platformId)) {
        if (localStorage.getItem("lang")) {
          this.translate.use(localStorage.getItem("lang")!);
          // change Direction
          this.myTranslateService.changeDirection();
        }
      }
    }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 800,
        once: true,
        mirror: false
      });
    }
  }
}
