import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeHomeComponent } from './subscribe-home.component';

describe('SubscribeHomeComponent', () => {
  let component: SubscribeHomeComponent;
  let fixture: ComponentFixture<SubscribeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeHomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
