// Public API for ngx-dual-rangepicker

// Main component
export { NgxDualRangepickerComponent } from './lib/ngx-dual-rangepicker.component';

// Models and interfaces
export type { DateRangeResult, DateRangePreset, SelectionMode, PickerPosition } from './lib/date-range-picker.models';

// Configuration tokens
export { DUAL_CALENDAR_INTL } from './lib/date-range-picker.tokens';
export type { DualCalendarIntl } from './lib/date-range-picker.tokens';

// Default presets (so consumers can extend them)
export { DEFAULT_PRESETS } from './lib/date-range-picker.presets';
