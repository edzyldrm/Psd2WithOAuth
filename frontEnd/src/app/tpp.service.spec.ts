import { TestBed, inject } from '@angular/core/testing';

import { TppService } from './tpp.service';

describe('TppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TppService]
    });
  });

  it('should be created', inject([TppService], (service: TppService) => {
    expect(service).toBeTruthy();
  }));
});
