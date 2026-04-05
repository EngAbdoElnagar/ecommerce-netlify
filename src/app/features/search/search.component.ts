import { Component, inject, OnInit, signal } from '@angular/core';
import { IProducts } from '../../core/models/IProducts/IProducts.interface';

import { CategoriesService } from '../../core/services/categories/categories.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { combineLatest } from 'rxjs';
import { ICategory } from '../../core/models/ICategory/icategory.interface';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../core/models/IBrand/ibrand.interface';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedCardComponent } from '../../shared/components/shared-card/shared-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-search',
  imports: [
    NgxPaginationModule,
    NgClass,
    FormsModule,
    SharedCardComponent,
    LoadingComponent,
    TranslatePipe,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isLoading = signal(false);
  productList = signal<IProducts[]>([]);
  categoryList = signal<ICategory[]>([]);
  brandList = signal<IBrand[]>([]);
  selectedBrands = signal<string[]>([]);
  selectedCategories = signal<string[]>([]);
  selectedMaxPrice = signal<number | null>(null);

  pageSize = signal<number>(0);
  currPage = signal<number>(1);
  total = signal<number>(0);

  loadingId = signal<string | null>(null);
  successId = signal<string>('');

  viewMode = signal<'grid' | 'list'>('grid');
  selectedSort = signal<string | null>(null);
  isSidebarOpen = signal(false);

  searchTerm: string = '';

  ngOnInit(): void {
    combineLatest([this.activatedRoute.paramMap, this.activatedRoute.queryParamMap]).subscribe(
      ([params, query]) => {
        const catIds = query.getAll('category');
        this.selectedCategories.set(catIds);

        const brandIds = query.getAll('brand');
        this.selectedBrands.set(brandIds);

        const allFilters = {
          brandId: brandIds.length > 0 ? brandIds : (params.get('id') ?? undefined),
          categoryId: catIds.length > 0 ? catIds : undefined,
          subCategoryId: query.get('subCategory') ?? undefined,
          keyword: query.get('keyword') ?? undefined,
          priceMin: query.get('minPrice') ? Number(query.get('minPrice')) : undefined,
          priceMax: query.get('maxPrice') ? Number(query.get('maxPrice')) : undefined,
          sort: query.get('sort') ?? undefined,
          page: query.get('page') ? Number(query.get('page')) : 1,
        };

        this.currPage.set(allFilters.page!);
        this.loadProducts(allFilters);
      },
    );

    this.getCategories();
    this.getBrands();
  }

  pageChanged(num: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: num },
      queryParamsHandling: 'merge',
    });
  }

  loadProducts(filters: any): void {
    this.isLoading.set(true);
    this.productsService.searchProducts(filters).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pageSize.set(res.metadata.limit);
        this.total.set(res.results);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categoryList.set(res.data),
    });
  }

  onCategoryChange(categoryId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentCats = this.selectedCategories();
    const updatedCats = isChecked
      ? [...currentCats, categoryId]
      : currentCats.filter((id) => id !== categoryId);

    this.selectedCategories.set(updatedCats);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { category: updatedCats.length > 0 ? updatedCats : null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  getBrands(): void {
    this.brandsService.getAllBrands().subscribe({
      next: (res) => this.brandList.set(res.data),
    });
  }

  onBrandChange(brandId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentBrands = this.selectedBrands();
    const updatedBrands = isChecked
      ? [...currentBrands, brandId]
      : currentBrands.filter((id) => id !== brandId);

    this.selectedBrands.set(updatedBrands);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { brand: updatedBrands.length > 0 ? updatedBrands : null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onPriceFilter(min: number, max: number): void {
    this.selectedMaxPrice.set(max);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { minPrice: min, maxPrice: max, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSort.set(value || null);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sort: value || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  vertical() {
    this.viewMode.set('grid');
  }

  list() {
    this.viewMode.set('list');
  }

  clearFilters() {
    this.selectedMaxPrice.set(null);
    this.searchTerm = '';
    this.router.navigate(['/search']);
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  onSearch(e: Event) {
    e.preventDefault();
    const keyword = this.searchTerm.trim();

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { keyword: keyword || null, page: 1 },
      queryParamsHandling: 'merge',
    });
    this.searchTerm = '';
  }
}
