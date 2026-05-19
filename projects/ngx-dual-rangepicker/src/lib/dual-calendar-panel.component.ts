import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  isDevMode,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

import { DayRangeViewComponent } from './day-range-view.component';
import { MonthRangeViewComponent } from './month-range-view.component';
import { YearRangeViewComponent } from './year-range-view.component';
import { TimePickerComponent, TimeValue } from './time-picker.component';
import { DateRangePreset, DateRangeResult, SelectionMode } from './date-range-picker.models';
import { DEFAULT_PRESETS } from './date-range-picker.presets';
import { DUAL_CALENDAR_INTL } from './date-range-picker.tokens';
import {
  CalendarDayRangeConstraints,
  calendarDaysInclusive,
  isCalendarDayRangeValid,
  normalizeCalendarDayConstraint,
} from './calendar-day-range.utils';

@Component({
  selector: 'ngx-dual-calendar-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    A11yModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatListModule,
    DayRangeViewComponent,
    MonthRangeViewComponent,
    YearRangeViewComponent,
    TimePickerComponent,
  ],
  templateUrl: './dual-calendar-panel.component.html',
  styleUrl: './dual-calendar-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DualCalendarPanelComponent implements OnInit {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  readonly intl = inject(DUAL_CALENDAR_INTL);

  // ── Inputs ────────────────────────────────────────────────────────────────
  readonly selectionMode = input<SelectionMode>('date');
  readonly lockedMode = input<SelectionMode | null>(null);
  readonly enableTimePicker = input<boolean>(false);
  readonly presets = input<DateRangePreset[]>(DEFAULT_PRESETS);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly minCalendarDays = input<number | null>(null);
  readonly maxCalendarDays = input<number | null>(null);
  readonly showModeSelector = input<boolean>(true);
  readonly showPresets = input<boolean>(true);
  readonly layout = input<'auto' | 'horizontal' | 'vertical'>('auto');
  readonly mobile = input<boolean>(false);
  readonly disableAnimations = input<boolean>(false);
  readonly initialRange = input<DateRange<Date> | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly applied = output<DateRangeResult>();
  readonly cancelled = output<void>();

  // ── Responsive: auto layout switches to vertical on narrow viewports ──────
  private readonly isNarrow = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 767px)')
      .pipe(map(r => r.matches)),
    { initialValue: false },
  );

  /** True when the panel should render in vertical mode (mobile, explicit, or auto+narrow). */
  readonly isVertical = computed(
    () =>
      this.mobile() ||
      this.layout() === 'vertical' ||
      (this.layout() === 'auto' && this.isNarrow()),
  );

  // ── Internal state ────────────────────────────────────────────────────────
  readonly activeMode = signal<SelectionMode>('date');
  readonly selectedRange = signal<DateRange<Date | null>>(new DateRange<Date | null>(null, null));
  readonly selectedPresetLabel = signal<string | null>(null);

  /** First day of the left calendar month. */
  readonly leftMonth = signal<Date>(this.startOfCurrentMonth());

  readonly startTime = signal<TimeValue>({ hours: 0, minutes: 0 });
  readonly endTime = signal<TimeValue>({ hours: 23, minutes: 59 });
  readonly timePickerValid = signal(true);
  private readonly warnedCalendarConstraintMessages = new Set<string>();

  /** Whether Apply button should be enabled. */
  readonly canApply = computed(() => {
    const r = this.selectedRange();
    if (r.start === null) return false;
    if (this.showTimePicker() && !this.timePickerValid()) return false;

    const end = r.end ?? this.singleSelectionEnd(r.start);
    return this.isRangeWithinCalendarDayConstraints(r.start, end);
  });

  readonly showTimePicker = computed(
    () => this.enableTimePicker() && this.activeMode() === 'date',
  );

  readonly isSameDay = computed(() => {
    const r = this.selectedRange();
    if (!r.start || !r.end) return false;
    return this.dateAdapter.sameDate(r.start, r.end);
  });

  readonly calendarDayConstraints = computed<CalendarDayRangeConstraints>(() => {
    if (this.enableTimePicker()) return { min: null, max: null };

    const min = this.normalizeCalendarDayInput('minCalendarDays', this.minCalendarDays());
    const max = this.normalizeCalendarDayInput('maxCalendarDays', this.maxCalendarDays());

    if (min !== null && max !== null && min > max) {
      this.warnCalendarConstraint(
        'min-greater-than-max',
        'minCalendarDays cannot be greater than maxCalendarDays. Calendar day constraints are ignored.',
      );
      return { min: null, max: null };
    }

    const minDate = this.min();
    const maxDate = this.max();
    if (
      min !== null &&
      minDate !== null &&
      maxDate !== null &&
      this.dateAdapter.compareDate(minDate, maxDate) <= 0 &&
      calendarDaysInclusive(minDate, maxDate) < min
    ) {
      this.warnCalendarConstraint(
        'min-exceeds-date-window',
        'minCalendarDays is greater than the selectable min/max window. No valid range can be selected.',
      );
    }

    return { min, max };
  });

  ngOnInit(): void {
    this.activeMode.set(this.lockedMode() ?? this.selectionMode());
    const initial = this.initialRange();
    if (initial?.start) {
      this.selectedRange.set(initial);
      this.leftMonth.set(this.startOfMonth(initial.start));
    }
  }

  // ── Day-mode selection ────────────────────────────────────────────────────

  onDayRangeSelected(range: DateRange<Date | null>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  // ── Month / Year custom views ─────────────────────────────────────────────

  onMonthRangeSelected(range: DateRange<Date | null>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  onYearRangeSelected(range: DateRange<Date | null>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  // ── Presets ───────────────────────────────────────────────────────────────

  isPresetDisabled(preset: DateRangePreset): boolean {
    const range = preset.range();
    if (!range.start || !range.end) return true;

    const min = this.min();
    const max = this.max();
    if (min && this.dateAdapter.compareDate(range.start, min) < 0) return true;
    if (max && this.dateAdapter.compareDate(range.end, max) > 0) return true;
    if (!this.isRangeWithinCalendarDayConstraints(range.start, range.end)) return true;
    return false;
  }

  onPresetClick(preset: DateRangePreset): void {
    if (this.isPresetDisabled(preset)) return;

    const range = preset.range();
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(preset.label);

    if (range.start) {
      this.leftMonth.set(this.startOfMonth(range.start));
    }
  }

  // ── Mode selector ─────────────────────────────────────────────────────────

  onModeChange(mode: SelectionMode): void {
    if (this.lockedMode() !== null) return;
    this.activeMode.set(mode);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  private singleSelectionEnd(start: Date): Date {
    const mode = this.activeMode();
    if (mode === 'month') {
      const lastDay = this.dateAdapter.getNumDaysInMonth(start);
      return this.dateAdapter.createDate(start.getFullYear(), start.getMonth(), lastDay);
    }
    if (mode === 'year') {
      return this.dateAdapter.createDate(start.getFullYear(), 11, 31);
    }
    return start;
  }

  onApply(): void {
    const range = this.selectedRange();
    if (!range.start || !this.canApply()) return;

    const end = range.end ?? this.singleSelectionEnd(range.start);
    const result: DateRangeResult = {
      start: this.mergeTime(range.start, this.startTime()),
      end: this.mergeTime(end, this.endTime()),
    };

    if (this.showTimePicker()) {
      result.startTime = { ...this.startTime() };
      result.endTime = { ...this.endTime() };
    }

    if (this.selectedPresetLabel()) {
      result.preset = this.selectedPresetLabel()!;
    }

    this.applied.emit(result);
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private startOfCurrentMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  private mergeTime(date: Date, time: TimeValue): Date {
    const result = new Date(date);
    result.setHours(time.hours, time.minutes, 0, 0);
    return result;
  }

  private isRangeWithinCalendarDayConstraints(start: Date, end: Date): boolean {
    return isCalendarDayRangeValid(start, end, this.calendarDayConstraints());
  }

  private normalizeCalendarDayInput(name: string, value: number | null): number | null {
    const normalized = normalizeCalendarDayConstraint(value);
    if (value !== null && normalized === null) {
      this.warnCalendarConstraint(
        `${name}-invalid-${String(value)}`,
        `${name} must be a positive safe integer. The value is ignored.`,
      );
    }
    return normalized;
  }

  private warnCalendarConstraint(key: string, message: string): void {
    if (!isDevMode() || this.warnedCalendarConstraintMessages.has(key)) return;
    this.warnedCalendarConstraintMessages.add(key);
    console.warn(`[ngx-dual-rangepicker] ${message}`);
  }
}
