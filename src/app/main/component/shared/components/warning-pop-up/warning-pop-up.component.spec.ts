import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WarningPopUpComponent } from '@shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

xdescribe('WarningPopUpComponent', () => {
  let component: WarningPopUpComponent;
  let fixture: ComponentFixture<WarningPopUpComponent>;

  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };

  const popupDataStub = {
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
    popupCancel: 'popupCancel',
    popupConfirm: 'popupConfirm'
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WarningPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule, HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: popupDataStub },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing the basic functionality', () => {
    it('should create keyboard event inside ngOnInit', () => {
      const spy = spyOn((component as any).matDialogRef, 'keydownEvents').and.returnValue(of());
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should call setTitles inside ngOnInit', () => {
      const spy = spyOn(component as any, 'setTitles');
      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should set titles after setTitles method', () => {
      component.ngOnInit();

      expect(component.popupTitle).toBe(popupDataStub.popupTitle);
      expect(component.popupSubtitle).toBe(popupDataStub.popupSubtitle);
      expect(component.popupCancel).toBe(popupDataStub.popupCancel);
      expect(component.popupConfirm).toBe(popupDataStub.popupConfirm);
    });

    it('should call close method inside userReply if isUbsOrderSubmit is false', () => {
      component.isUbsOrderSubmit = false;
      const spy = spyOn((component as any).matDialogRef, 'close');
      component.userReply(true);

      expect(spy).toHaveBeenCalled();
    });

    it('should call close method inside userReply if isUbsOrderSubmit is true', () => {
      component.isUbsOrderSubmit = true;
      const matDialogRef = 'matDialogRef';
      const spy = spyOn(component[matDialogRef], 'close');
      const localStorageService = 'localStorageService';
      const removeUbsFondyOrderIdMock = spyOn(component[localStorageService], 'removeUbsPaymentOrderId');
      component.userReply(true);
      expect(removeUbsFondyOrderIdMock).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it('should cancel streams after ngOnDestroy', () => {
      const nextSpy = spyOn((component as any).destroyed$, 'next');
      const completeSpy = spyOn((component as any).destroyed$, 'complete');
      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
