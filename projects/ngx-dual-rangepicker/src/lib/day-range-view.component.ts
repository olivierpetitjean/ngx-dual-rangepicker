import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';

export interface DayCell {
  date: Date;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'ngx-day-range-view',
  standalone: true,
  imports: [],
  templateUrl: './day-range-view.component.html',
  styleUrl: './day-range-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayRangeViewComponent {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  readonly rangeSelected = output<DateRange<Date>>();

  readonly leftMonth = model<Date>(this.startOfCurrentMonth());
  readonly rightMonth = signal<Date>(this.dateAdapter.addCalendarMonths(this.startOfCurrentMonth(), 1));

  private readonly rangeStart = signal<Date | null>(null);
  private readonly rangeEnd = signal<Date | null>(null);
  private readonly hoverDate = signal<Date | null>(null);

  readonly weekdayLabels = computed(() => {
    const names = this.dateAdapter.getDayOfWeekNames('narrow');
    const first = this.dateAdapter.getFirstDayOfWeek();
    return [...names.slice(first), ...names.slice(0, first)];
  });

  readonly leftWeeks = computed(() => this.buildWeeks(this.leftMonth()));
  readonly rightWeeks = computed(() => this.buildWeeks(this.rightMonth()));

  readonly leftMonthLabel = computed(() => this.monthLabel(this.leftMonth()));
  readonly rightMonthLabel = computed(() => this.monthLabel(this.rightMonth()));

  private monthLabel(date: Date): string {
    const months = this.dateAdapter.getMonthNames('long');
    return `${months[this.dateAdapter.getMonth(date)]} ${this.dateAdapter.getYear(date)}`;
  }

  private startOfCurrentMonth(): Date {
    const today = this.dateAdapter.today();
    return this.dateAdapter.createDate(
      this.dateAdapter.getYear(today),
      this.dateAdapter.getMonth(today),
      1,
    );
  }

  private buildWeeks(firstOfMonth: Date): (DayCell | null)[][] {
    const year = this.dateAdapter.getYear(firstOfMonth);
    const month = this.dateAdapter.getMonth(firstOfMonth);
    const numDays = this.dateAdapter.getNumDaysInMonth(firstOfMonth);
    const firstDow = this.dateAdapter.getFirstDayOfWeek();
    const startDow = this.dateAdapter.getDayOfWeek(firstOfMonth);
    const offset = (startDow - firstDow + 7) % 7;

    const cells: (DayCell | null)[] = Array(offset).fill(null);

    for (let d = 1; d <= numDays; d++) {
      const date = this.dateAdapter.createDate(year, month, d);
      cells.push({
        date,
        label: String(d),
        disabled: this.isDateDisabled(date),
      });
    }

    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (DayCell | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  }

  private isDateDisabled(date: Date): boolean {
    const min = this.min();
    const max = this.max();
    if (min && this.dateAdapter.compareDate(date, min) < 0) return true;
    if (max && this.dateAdapter.compareDate(date, max) > 0) return true;
    return false;
  }

  onCellClick(cell: DayCell): void {
    if (cell.disabled) return;
    const start = this.rangeStart();

    if (!start || (start && this.rangeEnd())) {
      this.rangeStart.set(cell.date);
      this.rangeEnd.set(null);
    } else {
      let s = start;
      let e = cell.date;
      if (this.dateAdapter.compareDate(e, s) < 0) [s, e] = [e, s];
      this.rangeStart.set(s);
      this.rangeEnd.set(e);
      this.hoverDate.set(null);
      this.rangeSelected.emit(new DateRange(s, e));
    }
  }

  onCellHover(cell: DayCell | null): void {
    if (this.rangeStart() && !this.rangeEnd()) {
      this.hoverDate.set(cell?.date ?? null);
    }
  }

  getCellState(cell: DayCell): 'range-start' | 'range-end' | 'in-range' | 'preview' | '' {
    const start = this.rangeStart();
    const end = this.rangeEnd();
    const hover = this.hoverDate();
    const d = cell.date;

    if (!start) return '';

    const cmpStart = this.dateAdapter.compareDate(d, start);

    if (end) {
      if (cmpStart === 0) return 'range-start';
      if (this.dateAdapter.compareDate(d, end) === 0) return 'range-end';
      if (cmpStart > 0 && this.dateAdapter.compareDate(d, end) < 0) return 'in-range';
      return '';
    }

    if (cmpStart === 0) return 'range-start';

    if (hover) {
      const cmpHover = this.dateAdapter.compareDate(start, hover);
      const lo = cmpHover <= 0 ? start : hover;
      const hi = cmpHover <= 0 ? hover : start;
      const cmpLo = this.dateAdapter.compareDate(d, lo);
      const cmpHi = this.dateAdapter.compareDate(d, hi);
      if (cmpLo === 0) return 'range-start';
      if (cmpHi === 0) return 'range-end';
      if (cmpLo > 0 && cmpHi < 0) return 'preview';
    }

    return '';
  }

  prevLeftMonth(): void {
    this.leftMonth.update((d) => this.dateAdapter.addCalendarMonths(d, -1));
  }

  nextLeftMonth(): void {
    this.leftMonth.update((d) => this.dateAdapter.addCalendarMonths(d, 1));
  }

  prevRightMonth(): void {
    this.rightMonth.update((d) => this.dateAdapter.addCalendarMonths(d, -1));
  }

  nextRightMonth(): void {
    this.rightMonth.update((d) => this.dateAdapter.addCalendarMonths(d, 1));
  }

  trackByWeek(_: number, week: (DayCell | null)[]): string {
    const first = week.find((c) => c !== null);
    return first ? first.date.toISOString() : String(_);
  }

  trackByDay(_: number, cell: DayCell | null): string {
    return cell ? cell.date.toISOString() : `null-${_}`;
  }
}
