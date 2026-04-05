import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import { MyTranslateService } from '../../../../core/services/myTranslate/my-translate.service';

@Component({
  selector: 'app-slider',
  imports: [TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
})
export class SliderComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly myTranslateService = inject(MyTranslateService);

  isBrowser = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      register();
      this.isBrowser.set(true);
    }
  }
}
