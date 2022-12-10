import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('UbsAdminTariffsCourierPopUpComponent', () => {
  let component: UbsAdminTariffsCourierPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsCourierPopUpComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    headerText: 'courier',
    edit: false
  };

  const fakeCouriers = {
    courierId: 1,
    courierTranslationDtos: [
      {
        name: 'фейкКурєр',
        nameEng: 'фейкКурєр'
      }
    ]
  };

  const fakeCourierForm = new FormGroup({
    name: new FormControl('fake'),
    englishName: new FormControl('fake')
  });

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'addCourier', 'editCourier']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.addCourier.and.returnValue(of());
  tariffsServiceMock.editCourier.and.returnValue(of());

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCourierPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsCourierPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set names correctly', () => {
    component.setNewCourierName();
    component.courierForm.setValue(fakeCourierForm.value);
    expect(component.courierForm.value).toEqual(fakeCourierForm.value);
  });

  it('should check if courier exists', () => {
    component.name.setValue('новийКурєр');
    expect(component.courierExist).toBe(false);
  });

  it('should check if courier exists', () => {
    component.englishName.setValue('newCourier');
    expect(component.enCourierExist).toBe(false);
  });

  it('should select one courier from list', () => {
    const eventMock = {
      option: {
        value: ['фейкКурєр']
      }
    };
    component.couriers = [fakeCouriers];
    component.selectCourier(eventMock);
    expect(component.selectedCourier[0].courierTranslationDtos[0].name).toEqual(fakeCouriers.courierTranslationDtos[0].name);
  });

  it('should not select one courier if it does not exist', () => {
    const eventMock = {
      option: {
        value: ['новийКурєр']
      }
    };
    component.couriers = [fakeCouriers];
    component.selectCourier(eventMock);
    expect(component.selectedCourier).toEqual([]);
  });

  it('should has correct data', () => {
    expect(component.data.edit).toEqual(false);
    expect(component.data.headerText).toEqual('courier');
  });

  it('should call getting couriers in OnInit', () => {
    const spy1 = spyOn(component, 'getCouriers');
    const spy2 = spyOn(component, 'setDate');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriers).toEqual([fakeCouriers]);
    expect(component.couriersName).toEqual(['фейкКурєр']);
  });

  it('should add a new courier', () => {
    component.addCourier();
    expect(tariffsServiceMock.addCourier).toHaveBeenCalled();
  });

  it('should edit the courier', () => {
    component.selectedCourier = [{ courierId: 0 }];
    component.editCourier();
    expect(tariffsServiceMock.editCourier).toHaveBeenCalled();
  });

  it('method onNoClick should invoke destroyRef.close', () => {
    component.onNoClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });
});
