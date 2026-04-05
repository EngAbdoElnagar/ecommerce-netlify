import { Component } from '@angular/core';
import { SliderComponent } from "./components/slider/slider.component";
import { CategoryHomeComponent } from "./components/category-home/category-home.component";
import { ProductHomeComponent } from "./components/product-home/product-home.component";
import { OffersHomeComponent } from "./components/offers-home/offers-home.component";
import { SubscribeHomeComponent } from "./components/subscribe-home/subscribe-home.component";

@Component({
  selector: 'app-home',
  imports: [SliderComponent, CategoryHomeComponent, ProductHomeComponent, OffersHomeComponent, SubscribeHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
