import { TestBed } from '@angular/core/testing';

import { TokenInterceptorService } from '../app/services/token-interceptor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpGenericService } from '../app/services/http-generic.service';
import { ErrorHandlingService } from '../app/services/error-handling.service';

describe('TokenInterceptorService', () => {
  let service: TokenInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpGenericService },
        { provide: ErrorHandlingService },
      ],
    });
    service = TestBed.inject(TokenInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
