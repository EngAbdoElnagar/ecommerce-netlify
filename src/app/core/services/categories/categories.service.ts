import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/categories`);
  }

  Getspecificcategory(categId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/categories/${categId}`);
  }

  // ****
  getSpecificSubCategory(subId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/subcategories/${subId}`);
  }

  getAllSubCategoriesOnCategory(categId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/categories/${categId}/subcategories`);
  }

  // categories.service.ts
  getProductsBySubCategory(subCategoryId: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/products?subcategory[in]=${subCategoryId}`,
    );
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products?category[in]=${categoryId}`);
  }
}
