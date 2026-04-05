import { TestBed } from '@angular/core/testing';

import { SafeToastrService } from './safe-toastr.service';

describe('SafeToastrService', () => {
  let service: SafeToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
