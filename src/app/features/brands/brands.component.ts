import { Component, inject, OnInit, signal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrand } from '../../core/models/IBrand/ibrand.interface';
import { RouterLink } from '@angular/router';
import { MainHeaderComponent } from '../../shared/components/main-header/main-header.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, MainHeaderComponent, LoadingComponent, TranslatePipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  isLoading = signal(false);
  brandList = signal<IBrand[]>([]);

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    this.isLoading.set(true);

    this.brandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
}
