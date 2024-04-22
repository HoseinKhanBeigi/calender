import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dateRouteGuard } from './date-route.guard';

describe('dateRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dateRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
