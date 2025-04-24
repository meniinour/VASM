import { TestBed } from '@angular/core/testing';

import { MailService } from './mail.service';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

    TestBed.configureTestingModule({
      providers: [MailService],
      imports: [HttpClientTestingModule]
    });

describe('MailService', () => {
  let service: MailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

