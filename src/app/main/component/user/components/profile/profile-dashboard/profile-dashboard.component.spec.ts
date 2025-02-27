import { ComponentFixture, TestBed, async, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileDashboardComponent } from '@global-user/components';

import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventResponse, EventResponseDto } from 'src/app/main/component/events/models/events.interface';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventType } from 'src/app/ubs/ubs/services/event-type.enum';

describe('ProfileDashboardComponent', () => {
  let component: ProfileDashboardComponent;
  let fixture: ComponentFixture<ProfileDashboardComponent>;

  const HabitAssignServiceMock = jasmine.createSpyObj('habitAssignService', ['getAssignedHabits']);
  HabitAssignServiceMock.getAssignedHabits = () => of([{ id: 1 }]);

  const LocalStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getUserId', 'languageBehaviourSubject', 'setCurentPage']);
  LocalStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  LocalStorageServiceMock.setCurentPage = () => of('previousPage', '/profile');

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () =>
    of({
      ecoNews: {},
      authorNews: [{ newsId: 1 }],
      pageNumber: 1,
      error: 'error',
      ecoNewsByAuthor: true
    });

  const MockHabits = {
    id: 1,
    status: 'INPROGRESS',
    userId: 10,
    duration: 20,
    workingDays: 2,
    habitStreak: 10,
    habit: {
      shoppingListItems: [{ id: 1, status: 'INPROGRESS', text: 'text', selected: true, custom: true }]
    }
  };

  const MockResult: EventResponseDto = {
    currentPage: 0,
    first: true,
    hasNext: true,
    hasPrevious: false,
    last: false,
    number: 0,
    page: [
      {
        additionalImages: [],
        creationDate: '2022-05-31',
        dates: [
          {
            coordinates: {
              latitude: 1,
              longitude: 1,
              cityEn: 'Lviv',
              cityUa: 'Львів',
              countryEn: 'Ukraine',
              countryUa: 'Україна',
              houseNumber: '55',
              regionEn: 'Lvivska oblast',
              regionUa: 'Львівська область',
              streetEn: 'Svobody Ave',
              streetUa: 'Свободи',
              formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
              formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
            },
            event: null,
            finishDate: '2022-06-29T04:00:00Z',
            id: null,
            onlineLink: 'http',
            startDate: '2022-06-29T04:00:00Z'
          }
        ],
        description: 'description',
        id: 95,
        open: true,
        organizer: {
          id: 12,
          name: 'username',
          organizerRating: 4
        },
        tags: [
          {
            id: 1,
            nameUa: 'Укр тег',
            nameEn: 'Eng Tag'
          }
        ],
        title: 'title',
        titleImage: 'image title',
        isSubscribed: true,
        isFavorite: false,
        likes: 8,
        countComments: 9,
        isRelevant: true,
        isOrganizedByFriend: false,
        eventRate: 0
      }
    ],
    totalElements: 12,
    totalPages: 1
  };

  const mockFavouriteEvents: EventResponse[] = [
    {
      additionalImages: [],
      creationDate: '2022-05-31',
      dates: [
        {
          coordinates: {
            latitude: 1,
            longitude: 1,
            cityEn: 'Lviv',
            cityUa: 'Львів',
            countryEn: 'Ukraine',
            countryUa: 'Україна',
            houseNumber: '55',
            regionEn: 'Lvivska oblast',
            regionUa: 'Львівська область',
            streetEn: 'Svobody Ave',
            streetUa: 'Свободи',
            formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
            formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
          },
          event: null,
          finishDate: '2022-06-29T04:00:00Z',
          id: null,
          onlineLink: 'http',
          startDate: '2022-06-29T04:00:00Z'
        }
      ],
      description: 'description',
      id: 96,
      open: true,
      organizer: {
        id: 12,
        name: 'username',
        organizerRating: 3
      },
      tags: [
        {
          id: 1,
          nameUa: 'Укр тег',
          nameEn: 'Eng Tag'
        }
      ],
      title: 'title',
      titleImage: 'image title',
      isSubscribed: true,
      isFavorite: true,
      likes: 8,
      countComments: 9,
      isRelevant: true,
      isOrganizedByFriend: false,
      eventRate: 0
    },
    {
      additionalImages: [],
      creationDate: '2022-05-31',
      dates: [
        {
          coordinates: {
            latitude: 1,
            longitude: 1,
            cityEn: 'Lviv',
            cityUa: 'Львів',
            countryEn: 'Ukraine',
            countryUa: 'Україна',
            houseNumber: '55',
            regionEn: 'Lvivska oblast',
            regionUa: 'Львівська область',
            streetEn: 'Svobody Ave',
            streetUa: 'Свободи',
            formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
            formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
          },
          event: null,
          finishDate: '2022-06-29T04:00:00Z',
          id: null,
          onlineLink: 'http',
          startDate: '2022-06-29T04:00:00Z'
        }
      ],
      description: 'description',
      id: 14,
      open: true,
      organizer: {
        id: 12,
        name: 'username',
        organizerRating: 3
      },
      tags: [
        {
          id: 1,
          nameUa: 'Укр тег',
          nameEn: 'Eng Tag'
        }
      ],
      title: 'title',
      titleImage: 'image title',
      isSubscribed: true,
      isFavorite: true,
      likes: 8,
      countComments: 9,
      isRelevant: true,
      isOrganizedByFriend: false,
      eventRate: 0
    }
  ];

  const eventsServiceMock = jasmine.createSpyObj('EventsService', ['getAllUserEvents', 'getUserFavoriteEvents']);
  eventsServiceMock.getAllUserEvents = () => of(MockResult);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileDashboardComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        InfiniteScrollModule,
        NgxPaginationModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: HabitAssignService, useValue: HabitAssignServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: HttpClient, useValue: HttpClient }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onInit should call four method', () => {
    const spy1 = spyOn(component as any, 'subscribeToLangChange');
    const spy2 = spyOn(component as any, 'getUserId');
    const spy3 = spyOn(component, 'dispatchNews');
    const spy4 = spyOn(component, 'initGetUserEvents');

    component.ngOnInit();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy4).toHaveBeenCalledTimes(1);
  });

  it('onInit news should have expected result', () => {
    component.ngOnInit();
    component.authorNews$.subscribe((item: any) => {
      expect(component.news[0]).toEqual({ newsId: 1 } as any);
    });
  });

  it('should update eventType and call getUserEvents when online event is checked', () => {
    const eventType = EventType.ONLINE;
    component.isOnlineChecked = true;
    const spy = spyOn(component, 'getUserEvents');
    component.onCheckboxChange(eventType);
    expect(component.isOnlineChecked).toBe(true);
    expect(component.isOfflineChecked).toBe(false);
    expect(component.eventType).toBe(eventType);
    expect(spy).toHaveBeenCalled();
  });

  it('should update eventType and call getUserEvents when offline event is checked', () => {
    const eventType = EventType.OFFLINE;
    component.isOfflineChecked = true;
    const spy = spyOn(component, 'getUserEvents');
    component.onCheckboxChange(eventType);
    expect(component.isOnlineChecked).toBe(false);
    expect(component.isOfflineChecked).toBe(true);
    expect(component.eventType).toBe(eventType);
    expect(spy).toHaveBeenCalled();
  });

  it('should update eventType and call getUserEvents when both checkboxes are unchecked', () => {
    const spy = spyOn(component, 'getUserEvents');
    component.onCheckboxChange();
    expect(component.isOnlineChecked).toBe(false);
    expect(component.isOfflineChecked).toBe(false);
    expect(component.eventType).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('Should call getAllUserEvents method before subscribe', waitForAsync(() => {
    component.userId = 12;
    const spy1 = spyOn(eventsServiceMock, 'getAllUserEvents').and.returnValue(of(MockResult));
    const spy2 = spyOn(eventsServiceMock.getAllUserEvents(), 'subscribe');
    component.initGetUserEvents();
    expect(spy1).toHaveBeenCalledBefore(spy2);
    expect(spy2).toHaveBeenCalled();
    expect(component.eventsList).toEqual(MockResult.page);
    expect(component.totalEvents).toEqual(MockResult.totalElements);
  }));

  it('dispatchNews expect store.dispatch have been called', () => {
    (component as any).currentPage = 1;
    (component as any).hasNext = true;
    component.dispatchNews(false);
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('changeStatus should return right Id', () => {
    HabitAssignServiceMock.habitsInProgress = [{ id: 4 }, { id: 2 }];
    component.changeStatus({ id: 4 } as any);
    expect(HabitAssignServiceMock.habitsInProgress).toEqual([{ id: 2 }] as any);
  });

  it('getUserId expect userId shoud be 2', () => {
    LocalStorageServiceMock.getUserId = () => 2;
    (component as any).getUserId();
    expect(component.userId).toBe(2);
  });

  it('executeRequests habitsInProgress.duration to be 20', () => {
    MockHabits.status = 'INPROGRESS';
    HabitAssignServiceMock.getAssignedHabits = () => of([MockHabits]);
    component.executeRequests();
    expect(HabitAssignServiceMock.habitsInProgress[0].duration).toBe(20);
  });

  it('executeRequests habitsAcquired to be 2', () => {
    const spy = spyOn(component, 'setHabitsForView');
    MockHabits.status = 'ACQUIRED';
    HabitAssignServiceMock.getAssignedHabits = () => of([MockHabits]);
    component.executeRequests();

    expect(component.habitsAcquired[0].workingDays).toBe(2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('setHabitsForView should return array length', () => {
    component.numberOfHabitsOnView = 2;
    HabitAssignServiceMock.habitsInProgress = [1, 2, 3];
    component.habitsAcquired = [1, 2, 3, 4] as any;
    component.setHabitsForView();
    expect(HabitAssignServiceMock.habitsInProgressToView.length).toBe(2);
    expect(component.habitsAcquiredToView.length).toBe(2);
  });

  it('getMoreHabitsInProgressForView expect habitsInProgressToView get new value', () => {
    spyOn(component, 'getMoreHabits').and.returnValue(['array'] as any);
    component.getMoreHabitsInProgressForView();
    expect(HabitAssignServiceMock.habitsInProgressToView).toEqual(['array']);
  });

  it('getMoreHabitsAcquiredForView habitsAcquiredToView should change lenght', () => {
    spyOn(component, 'getMoreHabits').and.returnValue(['array', 'tho'] as any);
    component.getMoreHabitsAcquiredForView();
    expect(component.habitsAcquiredToView.length).toBe(2);
  });

  it('getMoreHabits should return HABIT', () => {
    component.numberOfHabitsOnView = 3;
    const res = component.getMoreHabits(['H', 'A'] as any, [1, 2, 'B', 'I', 'T'] as any);
    expect(res.join('')).toEqual('HABIT');
  });

  it('sortHabitsData', () => {
    const res = (component as any).sortHabitsData([
      { habit: { id: 2 }, createDateTime: '2023-03-20T04:00:00Z' },
      { habit: { id: 4 }, createDateTime: '2023-03-22T04:00:00Z' }
    ]);
    expect(res[0].habit.id).toBe(4);
    expect(res[1].habit.id).toBe(2);
  });

  it('tabChanged', () => {
    component.isActiveNewsScroll = false;
    component.tabChanged({ index: 1, tab: {} as any });
    expect(component.isActiveNewsScroll).toBe(true);
  });

  it('getUserEvents should call service', async(() => {
    const spy = spyOn(eventsServiceMock, 'getAllUserEvents').and.returnValue(of(MockResult));
    component.eventsPage = 0;
    component.getUserEvents();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.eventsPage).toBe(1);
    expect(component.eventsList).toEqual(MockResult.page);
  }));

  it('onScroll', () => {
    const spy = spyOn(component, 'dispatchNews');
    component.onScroll();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should remove unfavourite event from array', () => {
    component.favouriteEvents = mockFavouriteEvents;
    component.removeUnFavouriteEvent(14);
    expect(component.favouriteEvents.length).toEqual(1);
  });

  it('should toggle isFavoriteBtnClicked property on escapeFromFavorites method', () => {
    expect(component.isFavoriteBtnClicked).toBeFalse();
    component.escapeFromFavorites();
    expect(component.isFavoriteBtnClicked).toBeTrue();
    component.escapeFromFavorites();
    expect(component.isFavoriteBtnClicked).toBeFalse();
  });

  it('should set isFavoriteBtnClicked to true and call getUserFavouriteEvents when goToFavorites is called', () => {
    spyOn(component, 'getUserFavouriteEvents');
    component.goToFavorites();
    expect(component.isFavoriteBtnClicked).toBeTrue();
    expect(component.getUserFavouriteEvents).toHaveBeenCalled();
  });

  it('should call getUserFavoriteEvents and set favouriteEvents when getUserFavouriteEvents is called', () => {
    eventsServiceMock.getUserFavoriteEvents.and.returnValue(of(MockResult));
    component.getUserFavouriteEvents();
    expect(eventsServiceMock.getUserFavoriteEvents).toHaveBeenCalledWith(0, component.eventsPerPage);
    expect(component.favouriteEvents).toEqual(MockResult.page);
  });
});
