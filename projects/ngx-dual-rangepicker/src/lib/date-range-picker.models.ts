import { DateRange } from '@angular/material/datepicker';

/** Selection granularity for the picker. */
export type SelectionMode = 'date' | 'month' | 'year';

/** Overlay positioning strategy for the picker panel. */
export type PickerPosition = 'auto' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/**
 * A preset that computes a date range dynamically.
 * The `range` function is called each time the preset is selected,
 * ensuring relative ranges (e.g. "Last 7 days") are always up to date.
 */
export interface DateRangePreset {
  label: string;
  range: () => DateRange<Date>;
}

/** Value emitted by the picker when the user confirms a selection. */
export interface DateRangeResult {
  start: Date;
  end: Date;
  /** Present only when `enableTimePicker` is true. */
  startTime?: { hours: number; minutes: number };
  /** Present only when `enableTimePicker` is true. */
  endTime?: { hours: number; minutes: number };
  /** Label of the selected preset, if any. */
  preset?: string;
}
