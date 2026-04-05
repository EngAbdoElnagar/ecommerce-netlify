import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDelailsComponent } from './product-delails.component';

describe('ProductDelailsComponent', () => {
  let component: ProductDelailsComponent;
  let fixture: ComponentFixture<ProductDelailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDelailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDelailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
