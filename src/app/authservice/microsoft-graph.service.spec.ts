import { TestBed } from '@angular/core/testing';

import { MicrosoftGraphService } from './microsoft-graph.service';

describe('MicrosoftGraphService', () => {
  let service: MicrosoftGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrosoftGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
