import { DateRange } from '@angular/material/datepicker';
import { DateRangePreset } from './date-range-picker.models';

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

function startOfQuarter(date: Date): Date {
  const month = date.getMonth();
  const quarterStart = month - (month % 3);
  return new Date(date.getFullYear(), quarterStart, 1);
}

function endOfQuarter(date: Date): Date {
  const month = date.getMonth();
  const quarterEnd = month - (month % 3) + 2;
  return endOfMonth(date.getFullYear(), quarterEnd);
}

export const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Today',
    range: () => {
      const today = startOfDay(new Date());
      return new DateRange(today, today);
    },
  },
  {
    label: 'Yesterday',
    range: () => {
      const yesterday = startOfDay(new Date());
      yesterday.setDate(yesterday.getDate() - 1);
      return new DateRange(yesterday, yesterday);
    },
  },
  {
    label: 'Last 7 days',
    range: () => {
      const end = startOfDay(new Date());
      const start = startOfDay(new Date());
      start.setDate(start.getDate() - 6);
      return new DateRange(start, end);
    },
  },
  {
    label: 'Last 30 days',
    range: () => {
      const end = startOfDay(new Date());
      const start = startOfDay(new Date());
      start.setDate(start.getDate() - 29);
      return new DateRange(start, end);
    },
  },
  {
    label: 'This month',
    range: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = endOfMonth(now.getFullYear(), now.getMonth());
      return new DateRange(start, end);
    },
  },
  {
    label: 'Last month',
    range: () => {
      const now = new Date();
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const start = new Date(year, month, 1);
      const end = endOfMonth(year, month);
      return new DateRange(start, end);
    },
  },
  {
    label: 'This quarter',
    range: () => {
      const now = new Date();
      return new DateRange(startOfQuarter(now), endOfQuarter(now));
    },
  },
  {
    label: 'This year',
    range: () => {
      const year = new Date().getFullYear();
      return new DateRange(new Date(year, 0, 1), new Date(year, 11, 31));
    },
  },
  {
    label: 'Last year',
    range: () => {
      const year = new Date().getFullYear() - 1;
      return new DateRange(new Date(year, 0, 1), new Date(year, 11, 31));
    },
  },
];
