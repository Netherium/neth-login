import { inject, TestBed } from '@angular/core/testing';

import { ErrorHandlingService } from '../app/services/error-handling.service';

describe('ErrorHandlingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlingService],
    });
  });

  it('should be created', inject(
    [ErrorHandlingService],
    (service: ErrorHandlingService) => {
      expect(service).toBeTruthy();
    }
  ));
});
