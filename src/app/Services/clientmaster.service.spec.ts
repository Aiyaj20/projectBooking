import { TestBed } from '@angular/core/testing';

import { ClientmasterService } from './clientmaster.service';

describe('ClientmasterService', () => {
  let service: ClientmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
