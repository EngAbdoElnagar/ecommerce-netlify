import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppourtComponent } from './suppourt.component';

describe('SuppourtComponent', () => {
  let component: SuppourtComponent;
  let fixture: ComponentFixture<SuppourtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppourtComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuppourtComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
