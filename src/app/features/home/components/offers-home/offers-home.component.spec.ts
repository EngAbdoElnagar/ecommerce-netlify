import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersHomeComponent } from './offers-home.component';

describe('OffersHomeComponent', () => {
  let component: OffersHomeComponent;
  let fixture: ComponentFixture<OffersHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OffersHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
