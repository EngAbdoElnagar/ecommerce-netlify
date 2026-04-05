import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';

import { ProductsService } from '../../../../core/services/products/products.service';
import { IProducts } from '../../../../core/models/IProducts/IProducts.interface';
import { SharedCardComponent } from '../../../../shared/components/shared-card/shared-card.component';

@Component({
  selector: 'app-product-home',
  imports: [SectionTitleComponent, SharedCardComponent],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  productList = signal<IProducts[]>([]);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
    });
  }
}
