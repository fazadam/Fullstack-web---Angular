import { TestBed } from '@angular/core/testing';

import { LoginServiceAuthService } from './login-service-auth.service';

describe('LoginServiceAuthService', () => {
  let service: LoginServiceAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServiceAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
