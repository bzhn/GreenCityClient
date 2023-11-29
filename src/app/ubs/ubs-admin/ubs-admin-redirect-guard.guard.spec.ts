import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UbsAdminRedirectGuard } from './ubs-admin-redirect-guard.guard';

describe('UbsAdminRedirectGuard', () => {
  let redirectGuard: UbsAdminRedirectGuard;
  let router: Router;
  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [redirectGuard, { provide: JwtService, useValue: jwtServiceMock }]
    });
    redirectGuard = TestBed.inject(UbsAdminRedirectGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(redirectGuard).toBeTruthy();
  });
});
