import { CategoriesService } from './../../core/services/categories/categories.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ISubCategory } from '../../core/models/ISubCategory/isub-category.interface';
import { ISpecific } from '../../core/models/ISpecific/ispecific.interface';
import { MainHeaderComponent } from '../../shared/components/main-header/main-header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-sub-categories',
  imports: [RouterLink, MainHeaderComponent, TranslatePipe, LoadingComponent],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css',
})
export class SubCategoriesComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);

  isLoading = signal(false);
  categoryId = signal<string>('');

  allSubCategoryList = signal<ISubCategory[]>([]);
  specificList = signal<ISpecific>({} as ISpecific);

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log(params.get('id'));
      params.get('id');

      this.categoryId.set(params.get('id')!);
      this.getSubCategOnCategory(this.categoryId());
      this.getSpecific(this.categoryId());
    });
  }

  getSpecific(id: string) {
    this.categoriesService.Getspecificcategory(id).subscribe({
      next: (res) => {
        this.specificList.set(res.data);
        console.log(this.specificList());
      },
    });
  }

  getSubCategOnCategory(categoryId: string) {
    this.isLoading.set(true);
    this.categoriesService.getAllSubCategoriesOnCategory(categoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.allSubCategoryList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
}
