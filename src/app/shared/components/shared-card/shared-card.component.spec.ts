import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCardComponent } from './shared-card.component';

describe('SharedCardComponent', () => {
  let component: SharedCardComponent;
  let fixture: ComponentFixture<SharedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
