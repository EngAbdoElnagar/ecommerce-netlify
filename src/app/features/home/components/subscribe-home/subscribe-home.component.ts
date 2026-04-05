import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-subscribe-home',
  imports: [TranslatePipe],
  templateUrl: './subscribe-home.component.html',
  styleUrl: './subscribe-home.component.css',
})
export class SubscribeHomeComponent {}
