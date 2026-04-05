import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-offers-home',
  imports: [RouterLink,TranslatePipe],
  templateUrl: './offers-home.component.html',
  styleUrl: './offers-home.component.css',
})
export class OffersHomeComponent {}
