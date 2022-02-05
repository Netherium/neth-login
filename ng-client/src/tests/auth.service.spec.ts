import { TestBed } from '@angular/core/testing';

import { AuthService } from '../app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandlingService } from '../app/services/error-handling.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService }, { provide: ErrorHandlingService }],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
