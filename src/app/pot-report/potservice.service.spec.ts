import { TestBed } from '@angular/core/testing';

import { PotserviceService } from './potservice.service';

describe('PotserviceService', () => {
  let service: PotserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
