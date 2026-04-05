import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProductsService } from '../../core/services/products/products.service';
import { BrandsService } from '../../core/services/brands/brands.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CartService } from '../../core/services/cart/cart.service';
import { IProducts } from '../../core/models/IProducts/IProducts.interface';
import { ISpecific } from '../../core/models/ISpecific/ispecific.interface';

import { MainHeaderComponent } from '../../shared/components/main-header/main-header.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { SafeToastrService } from '../../core/services/safe-toastr/safe-toastr.service';
import { SharedCardComponent } from '../../shared/components/shared-card/shared-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MainHeaderComponent,
    
    NgxPaginationModule,
    RouterLink,
    SharedCardComponent,
    LoadingComponent,
    TranslatePipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly brandsService = inject(BrandsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(SafeToastrService);
  private readonly wishlistService = inject(WishlistService);

  productList = signal<IProducts[]>([]);
  specificList = signal<ISpecific>({} as ISpecific);

  pageSize = signal<number>(0);
  currPage = signal<number>(1);
  total = signal<number>(0);

  isBrandMode = signal<boolean>(false);
  isLoading = signal(false);
  loadingId = signal<string | null>(null);
  successId = signal<string>('');

  cartLoadingId = signal<string | null>(null);
  cartSuccessId = signal<string | null>(null);

  wishlistLoadingId = signal<string | null>(null);
  wishlistSuccessId = signal<string | null>(null);
  wishlistIds = signal<string[]>([]);

  ngOnInit(): void {
    combineLatest([this.activatedRoute.paramMap, this.activatedRoute.queryParamMap]).subscribe(
      ([params, query]) => {
        const allFilters = {
          brandId: params.get('id') || undefined,
          categoryId: query.get('category') || undefined,
          subCategoryId: query.get('subCategory') || undefined,
          keyword: query.get('keyword') || undefined,
          page: query.get('page') || 1,
        };

        this.currPage.set(Number(allFilters.page));

        this.loadProducts(allFilters);

        this.handleHeaderData(allFilters);
      },
    );
  }

  loadProducts(filters: any): void {
    this.isLoading.set(true);
    this.productsService.getProducts(filters).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.total.set(res.results);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  handleHeaderData(filters: any): void {
    if (filters.brandId) {
      this.isBrandMode.set(true);
      this.brandsService
        .getSpecificBrands(filters.brandId)
        .subscribe((res) => this.specificList.set(res.data));
    } else if (filters.subCategoryId) {
      this.isBrandMode.set(true);
      this.categoriesService
        .getSpecificSubCategory(filters.subCategoryId)
        .subscribe((res) => this.specificList.set(res.data));
    } else if (filters.categoryId) {
      this.isBrandMode.set(true);
      this.categoriesService
        .Getspecificcategory(filters.categoryId)
        .subscribe((res) => this.specificList.set(res.data));
    } else {
      this.isBrandMode.set(false);
    }
  }

  pageChanged(num: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: num },
      queryParamsHandling: 'merge',
    });
  }
}
