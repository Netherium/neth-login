import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ErrorHandlingService } from '../app/services/error-handling.service';
import { HttpGenericService } from '../app/services/http-generic.service';

describe('HttpGenericService', () => {
  let service: HttpGenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpGenericService },
        { provide: ErrorHandlingService },
      ],
    });
    service = TestBed.inject(HttpGenericService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
