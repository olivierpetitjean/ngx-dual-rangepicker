import { InjectionToken } from '@angular/core';

/** All user-facing labels in the picker UI. Override via `DUAL_CALENDAR_INTL`. */
export interface DualCalendarIntl {
  /** Button that confirms the selection. Default: 'Apply' */
  applyLabel: string;
  /** Button that dismisses the panel without applying. Default: 'Cancel' */
  cancelLabel: string;
  /** Mode selector toggle — day-level selection. Default: 'Days' */
  daysLabel: string;
  /** Mode selector toggle — month-level selection. Default: 'Months' */
  monthsLabel: string;
  /** Mode selector toggle — year-level selection. Default: 'Years' */
  yearsLabel: string;
  /** Label above the time picker section. Default: 'Time' */
  timeLabel: string;
  /** Label for the start-time input. Default: 'Start' */
  startTimeLabel: string;
  /** Label for the end-time input. Default: 'End' */
  endTimeLabel: string;
}

export const DEFAULT_INTL: DualCalendarIntl = {
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  daysLabel: 'Days',
  monthsLabel: 'Months',
  yearsLabel: 'Years',
  timeLabel: 'Time',
  startTimeLabel: 'Start',
  endTimeLabel: 'End',
};

/**
 * Injection token for customising picker labels.
 *
 * @example
 * // French labels
 * providers: [{
 *   provide: DUAL_CALENDAR_INTL,
 *   useValue: {
 *     applyLabel: 'Appliquer',
 *     cancelLabel: 'Annuler',
 *     daysLabel: 'Jours',
 *     monthsLabel: 'Mois',
 *     yearsLabel: 'Années',
 *     timeLabel: 'Heure',
 *     startTimeLabel: 'Début',
 *     endTimeLabel: 'Fin',
 *   }
 * }]
 */
export const DUAL_CALENDAR_INTL = new InjectionToken<DualCalendarIntl>('DUAL_CALENDAR_INTL', {
  providedIn: 'root',
  factory: () => DEFAULT_INTL,
});
