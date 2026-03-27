import { Injectable } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

/**
 * Wraps the `_goToDateInView` internal API of `MatCalendar` to isolate its usage.
 * If this method is removed in a future Material version, only this service needs updating.
 */
@Injectable({ providedIn: 'root' })
export class DateRangePickerService {
  /**
   * Programmatically navigate a `MatCalendar` to the month containing `date`.
   * Falls back to setting `activeDate` directly if `_goToDateInView` is unavailable.
   */
  navigateToDate(calendar: MatCalendar<Date>, date: Date): void {
    if (typeof (calendar as any)['_goToDateInView'] === 'function') {
      (calendar as any)['_goToDateInView'](date, 'month');
    } else {
      calendar.activeDate = date;
    }
  }
}
