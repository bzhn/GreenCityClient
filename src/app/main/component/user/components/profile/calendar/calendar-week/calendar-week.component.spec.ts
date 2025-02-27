import { CalendarWeekComponent } from './calendar-week.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarWeekInterface } from './calendar-week-interface';
import { Language } from 'src/app/main/i18n/Language';

describe('HabitCalendarComponent', () => {
  let component: CalendarWeekComponent;
  let fixture: ComponentFixture<CalendarWeekComponent>;
  let day: CalendarWeekInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarWeekComponent, CalendarBaseComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: TranslateService, useValue: {} },
        { provide: LanguageService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekComponent);
    component = fixture.componentInstance;
    day = {
      date: new Date('Sun Jul 02 2023 12:21:28 GMT+0300'),
      dayName: 'test',
      isCurrent: true,
      hasHabitsInProgress: true,
      areHabitsDone: true
    };
    component.currentDate = new Date('Sun Jul 02 2023 00:00:00 GMT+0300');
    component.weekDates = [];
    component.language = Language.UA;
    component.weekTitle = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should find first week date', () => {
    expect((component as any).getFirstWeekDate()).toEqual(new Date('Mon Jun 26 2023 00:00:00 GMT+0300'));
  });

  xit('should find first week date', () => {
    component.currentDate = new Date('Mon Jul 03 2023 00:00:00 GMT+0300');
    fixture.detectChanges();
    expect((component as any).getFirstWeekDate()).toEqual(new Date('Mon Jul 03 2023 00:00:00 GMT+0300'));
  });

  it('should create calendar', () => {
    (component as any).buildWeekCalendar(component.currentDate);
    expect(component.weekDates.length).toBe(7);
  });

  it('title has to be changed after changing language', () => {
    const spy = spyOn<any>(component, 'buildWeekCalendarTitle');
    (component as any).getLanguage();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should go to next week when isNext is true', () => {
    component.weekDates = [day];
    const initialWeekDates = [...component.weekDates];
    component.changeWeek(true);
    expect(component.weekDates).not.toEqual(initialWeekDates);
  });

  it('should go to previous week when isNext is false', () => {
    component.weekDates = [day];
    const initialWeekDates = [...component.weekDates];
    component.changeWeek(false);
    expect(component.weekDates).not.toEqual(initialWeekDates);
  });

  it('should call openDialogDayHabits if checkCanOpenPopup returns true', () => {
    spyOn(component, 'checkCanOpenPopup').and.returnValue(true);
    const openDialogDayHabitsSpy = spyOn(component, 'openDialogDayHabits');
    const dayAsCalendarInterface = component.toCalendarMonth(day);
    const mockEvent = new MouseEvent('click');
    component.showHabits(mockEvent, day);
    expect(openDialogDayHabitsSpy).toHaveBeenCalledWith(mockEvent, false, dayAsCalendarInterface);
  });

  it('should not call openDialogDayHabits if checkCanOpenPopup returns false', () => {
    spyOn(component, 'checkCanOpenPopup').and.returnValue(false);
    const openDialogDayHabitsSpy = spyOn(component, 'openDialogDayHabits');
    const mockEvent = new MouseEvent('click');
    component.showHabits(mockEvent, day);
    expect(openDialogDayHabitsSpy).not.toHaveBeenCalled();
  });
});
