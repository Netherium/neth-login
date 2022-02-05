import { TestBed } from '@angular/core/testing';

import { ResponsiveLayoutService } from '../app/services/responsive-layout.service';

describe('ResponsiveLayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponsiveLayoutService = TestBed.inject(
      ResponsiveLayoutService
    );
    expect(service).toBeTruthy();
  });
});
