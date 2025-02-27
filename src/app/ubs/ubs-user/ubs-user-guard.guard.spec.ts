import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UbsUserGuard } from '@ubs/ubs-user/ubs-user-guard.guard';
import { isObservable, Observable } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

describe('UbsUserGuard', () => {
  let store: MockStore;
  let mockUserRoleSelector;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()]
    });

    store = TestBed.inject<any>(MockStore);

    mockUserRoleSelector = store.overrideSelector(userRoleSelector, null);
  });

  it('should allow access for user', fakeAsync(() => {
    mockUserRoleSelector.setResult('ROLE_USER');
    const result = TestBed.runInInjectionContext(() => UbsUserGuard(route, state));

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeTrue();
    });

    flush();
  }));

  it('should not allow access for not user', fakeAsync(() => {
    mockUserRoleSelector.setResult('ROLE_UBS_EMPLOYEE');
    const result = TestBed.runInInjectionContext(() => UbsUserGuard(route, state));

    flush();

    if (!isObservable(result)) {
      expect(result).toBeInstanceOf(Observable);
      return;
    }

    result.subscribe((value) => {
      expect(value).toBeFalse();
    });

    flush();
  }));
});
