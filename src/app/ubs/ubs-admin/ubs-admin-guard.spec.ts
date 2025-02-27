import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UbsAdminGuard } from '@ubs/ubs-admin/ubs-admin-guard.guard';
import { isObservable, Observable } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';

describe('UbsAdminGuard', () => {
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

  it('should allow access for UBS admin', fakeAsync(() => {
    mockUserRoleSelector.setResult('ROLE_UBS_EMPLOYEE');
    const result = TestBed.runInInjectionContext(() => UbsAdminGuard(route, state));

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

  it('should not allow access for not admin', fakeAsync(() => {
    mockUserRoleSelector.setResult('ROLE_USER');
    const result = TestBed.runInInjectionContext(() => UbsAdminGuard(route, state));

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
