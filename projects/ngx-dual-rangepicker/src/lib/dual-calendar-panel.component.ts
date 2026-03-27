import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';

import { DayRangeViewComponent } from './day-range-view.component';
import { MonthRangeViewComponent } from './month-range-view.component';
import { YearRangeViewComponent } from './year-range-view.component';
import { TimePickerComponent, TimeValue } from './time-picker.component';
import { DateRangePreset, DateRangeResult, SelectionMode } from './date-range-picker.models';
import { DEFAULT_PRESETS } from './date-range-picker.presets';
import { DUAL_CALENDAR_INTL } from './date-range-picker.tokens';

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
  readonly showModeSelector = input<boolean>(true);
  readonly showPresets = input<boolean>(true);
  readonly layout = input<'auto' | 'horizontal' | 'vertical'>('auto');
  readonly initialRange = input<DateRange<Date> | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly applied = output<DateRangeResult>();
  readonly cancelled = output<void>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly activeMode = signal<SelectionMode>('date');
  readonly selectedRange = signal<DateRange<Date | null>>(new DateRange<Date | null>(null, null));
  readonly selectedPresetLabel = signal<string | null>(null);

  /** First day of the left calendar month. */
  readonly leftMonth = signal<Date>(this.startOfCurrentMonth());

  readonly startTime = signal<TimeValue>({ hours: 0, minutes: 0 });
  readonly endTime = signal<TimeValue>({ hours: 23, minutes: 59 });

  /** Whether Apply button should be enabled. */
  readonly canApply = computed(() => {
    const r = this.selectedRange();
    return r.start !== null && r.end !== null;
  });

  readonly showTimePicker = computed(
    () => this.enableTimePicker() && this.activeMode() === 'date',
  );

  readonly isSameDay = computed(() => {
    const r = this.selectedRange();
    if (!r.start || !r.end) return false;
    return this.dateAdapter.sameDate(r.start, r.end);
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

  onDayRangeSelected(range: DateRange<Date>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  // ── Month / Year custom views ─────────────────────────────────────────────

  onMonthRangeSelected(range: DateRange<Date>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  onYearRangeSelected(range: DateRange<Date>): void {
    this.selectedRange.set(range);
    this.selectedPresetLabel.set(null);
  }

  // ── Presets ───────────────────────────────────────────────────────────────

  onPresetClick(preset: DateRangePreset): void {
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

  onApply(): void {
    const range = this.selectedRange();
    if (!range.start || !range.end) return;

    const result: DateRangeResult = {
      start: this.mergeTime(range.start, this.startTime()),
      end: this.mergeTime(range.end, this.endTime()),
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
}
