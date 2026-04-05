import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../core/models/ICategory/icategory.interface';
import { RouterLink } from '@angular/router';
import { MainHeaderComponent } from '../../shared/components/main-header/main-header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, MainHeaderComponent, LoadingComponent, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categoriesService = inject(CategoriesService);

  isLoading = signal(false);
  categoryList = signal<ICategory[]>([]);

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.isLoading.set(true);
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
}
