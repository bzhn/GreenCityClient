import { BaseCalendar } from '@global-user/components/profile/calendar/calendar-week/calendar-week-interface';

export interface CalendarInterface extends BaseCalendar {
  numberOfDate: number | string;
  year: number;
  month: number;
  firstDay: number;
  totalDaysInMonth: number;
  isCurrentDayActive: boolean;
}
