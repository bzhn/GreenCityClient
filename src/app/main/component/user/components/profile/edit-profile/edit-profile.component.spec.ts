import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';
import { EditProfileComponent } from './edit-profile.component';
import { SocialNetworksComponent } from './social-networks/social-networks.component';
import { Router } from '@angular/router';
import { SharedMainModule } from '@shared/shared-main.module';
import { InputGoogleAutocompleteComponent } from '@shared/components/input-google-autocomplete/input-google-autocomplete.component';

class Test {}

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    (window as any).google = {
      maps: {
        places: {
          AutocompleteService: class {
            getPlacePredictions(request, callback) {
              const predictions = [
                { description: 'Place 1', place_id: '1' },
                { description: 'Place 2', place_id: '2' }
              ];
              callback(predictions, 'OK');
            }
          }
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [EditProfileComponent, InputGoogleAutocompleteComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([{ path: '**', component: Test }]),
        HttpClientTestingModule,
        SharedMainModule,
        TranslateModule.forRoot()
      ],
      providers: [
        EditProfileFormBuilder,
        EditProfileService,
        MatSnackBarComponent,
        SocialNetworksComponent,
        ProfileService,
        { provide: 'google', useValue: google }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create EditProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('General methods:', () => {
    const initMethods = ['initForm', 'getInitialValue', 'subscribeToLangChange', 'bindLang'];

    for (let i = 0; i < initMethods.length; i++) {
      it(`ngOnInit should init ${i + 1}-st element ${initMethods[i]}`, () => {
        const spy = spyOn(component as any, initMethods[i]);
        component.ngOnInit();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    }

    it('ngOnDestroy should destroy one method', () => {
      spyOn((component as any).langChangeSub, 'unsubscribe');
      component.ngOnDestroy();
      expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should return the correct form values', () => {
      component.editProfileForm.setValue({
        name: 'John',
        city: 'City',
        credo: 'Some credo',
        showLocation: true,
        showEcoPlace: false,
        showShoppingList: true,
        socialNetworks: []
      });
      component.coordinates = { latitude: 123, longitude: 456 };
      component.socialNetworksToServer = ['Facebook', 'Twitter'];

      const result = component.getFormValues();

      expect(result.firstName).toBe('John');
      expect(result.latitude).toBe(123);
      expect(result.longitude).toBe(456);
      expect(result.userCredo).toBe('Some credo');
      expect(result.showLocation).toBe(true);
      expect(result.showEcoPlace).toBe(false);
      expect(result.showShoppingList).toBe(true);
      expect(result.socialNetworks).toEqual(['Facebook', 'Twitter']);
    });
  });

  describe('Testing of warnings in cases of user leaves the page', () => {
    beforeEach(() => {
      component.initialValues = {
        city: '',
        name: '',
        userCredo: '',
        showLocation: '',
        showEcoPlace: '',
        showShoppingList: '',
        socialNetworks: []
      };
      component.editProfileForm.value.city = '';
      component.editProfileForm.value.name = '';
      component.editProfileForm.value.credo = '';
      component.editProfileForm.value.showLocation = '';
      component.editProfileForm.value.showEcoPlace = '';
      component.editProfileForm.value.showShoppingList = '';
      component.socialNetworksToServer = [];
    });

    it('should return false in case of form fields were not changed', () => {
      expect(component.checkChanges()).toBeFalsy();
    });

    it('should return true in case of form fields were not changed', () => {
      expect(component.canDeactivate()).toBeTruthy();
    });
  });

  describe('Testing controls for the form:', () => {
    const controlsName = ['name', 'city', 'credo'];
    const maxLength =
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. ' +
      'Facilis asperiores minus corrupti impedit cumque sapiente est architecto obcaecati quisquam velit quidem quis nesciunt';
    const invalidCity = ['@Lviv', '.Lviv', 'Kiev6', 'Kyiv$'];
    const validCity = ['Lviv', 'Ivano-Frankivsk', 'Kiev(Ukraine)', 'Львов, Украина'];

    for (let i = 0; i < controlsName.length; i++) {
      it(`should create form with ${i + 1}-st formControl: ${controlsName[i]}`, () => {
        expect(component.editProfileForm.contains(controlsName[i])).toBeTruthy();
      });

      it(`The formControl: ${controlsName[i]} should be marked as invalid if the value is too long`, () => {
        const control = component.editProfileForm.get(controlsName[i]);
        control.setValue(maxLength);
        expect(control.valid).toBeFalsy();
      });
    }

    describe('The formControl: city should be marked as invalid if the value:', () => {
      for (let i = 0; i < invalidCity.length; i++) {
        it(`${i + 1}-st - ${invalidCity[i]}.`, () => {
          const control = component.editProfileForm.get('city');
          control.setValue(invalidCity[i]);
          expect(control.valid).toBeTruthy();
        });
      }
    });

    describe('The formControl: city should be marked as valid if the value:', () => {
      for (let i = 0; i < validCity.length; i++) {
        it(`${i + 1}-st - ${validCity[i]}.`, () => {
          const control = component.editProfileForm.get('city');
          control.setValue(validCity[i]);
          expect(control.valid).toBeTruthy();
        });
      }
    });
  });

  describe('Testing services:', () => {
    let editProfileService: EditProfileService;
    let profileService: ProfileService;
    let mockUserInfo: EditProfileModel;

    beforeEach(() => {
      editProfileService = fixture.debugElement.injector.get(EditProfileService);
      profileService = fixture.debugElement.injector.get(ProfileService);
      mockUserInfo = {
        userLocationDto: { cityEn: 'Lviv' },
        name: 'John',
        userCredo: 'My Credo is to make small steps that leads to huge impact. Let’s change the world together.',
        profilePicturePath: './assets/img/profileAvatarBig.png',
        rating: 658,
        showEcoPlace: true,
        showLocation: true,
        showShoppingList: true,
        socialNetworks: [{ id: 220, url: 'http://instagram.com/profile' }]
      } as EditProfileModel;
    });

    it('getInitialValue should call ProfileService', () => {
      const spy = spyOn(profileService, 'getUserInfo').and.returnValue(of(mockUserInfo));
      component.getInitialValue();
      expect(spy.calls.any()).toBeTruthy();
    });

    it('onSubmit should call EditProfileService', () => {
      const spy = spyOn(editProfileService, 'postDataUserProfile').and.returnValue(of(mockUserInfo));
      component.onSubmit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
