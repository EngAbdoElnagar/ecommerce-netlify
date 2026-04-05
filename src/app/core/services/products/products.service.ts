import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(pageNum: number = 1): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products?page=${pageNum}`);
  }

  getSpecificProduct(productId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products/${productId}`);
  }

  getProducts(params: any): Observable<any> {
    let myParams = new HttpParams();

    if (params.page) myParams = myParams.append('page', params.page);
    if (params.brandId) myParams = myParams.append('brand', params.brandId);
    if (params.categoryId) myParams = myParams.append('category', params.categoryId);
    if (params.subCategoryId) myParams = myParams.append('subcategory', params.subCategoryId);
    if (params.keyword) myParams = myParams.append('keyword', params.keyword);
    if (params.sort) myParams = myParams.append('sort', params.sort);

    if (params.minPrice) myParams = myParams.append('price[gte]', params.minPrice);
    if (params.maxPrice) myParams = myParams.append('price[lte]', params.maxPrice);
    if (params.rating) myParams = myParams.append('ratingsAverage[gte]', params.rating);

    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, { params: myParams });
  }

  searchProducts(params: {
    keyword?: string;
    brandId?: string[] | string;
    categoryId?: string[] | string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();

    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }

    if (params.brandId) {
      if (Array.isArray(params.brandId)) {
        params.brandId.forEach((id: string) => {
          httpParams = httpParams.append('brand', id);
        });
      } else {
        httpParams = httpParams.set('brand', params.brandId);
      }
    }

    if (params.categoryId) {
      if (Array.isArray(params.categoryId)) {
        params.categoryId.forEach((id: string) => {
          httpParams = httpParams.append('category', id);
        });
      } else {
        httpParams = httpParams.set('category', params.categoryId);
      }
    }

    if (params.priceMin) {
      httpParams = httpParams.set('price[gte]', params.priceMin);
    }

    if (params.priceMax) {
      httpParams = httpParams.set('price[lte]', params.priceMax);
    }

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }

    httpParams = httpParams.set('limit', params.limit ?? 12);
    httpParams = httpParams.set('page', params.page ?? 1);

    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, { params: httpParams });
  }
}
