import { TestBed } from '@angular/core/testing';

import { SpstService } from './spst.service';

describe('SpstService', () => {
  let service: SpstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
