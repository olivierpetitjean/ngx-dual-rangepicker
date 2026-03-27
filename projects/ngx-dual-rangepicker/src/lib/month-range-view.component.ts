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

export interface MonthCell {
  year: number;
  /** 0-based month index */
  month: number;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'ngx-month-range-view',
  standalone: true,
  imports: [],
  templateUrl: './month-range-view.component.html',
  styleUrl: './month-range-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthRangeViewComponent {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);

  /** The year displayed in the left panel. The right panel shows year + 1. */
  readonly leftYear = model<number>(new Date().getFullYear());

  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  /** Emitted when a complete month range has been selected. */
  readonly rangeSelected = output<DateRange<Date>>();

  private readonly rangeStart = signal<{ year: number; month: number } | null>(null);
  private readonly rangeEnd = signal<{ year: number; month: number } | null>(null);
  private readonly hoverCell = signal<{ year: number; month: number } | null>(null);

  readonly rightYear = computed(() => this.leftYear() + 1);

  readonly leftCells = computed(() => this.buildCells(this.leftYear()));
  readonly rightCells = computed(() => this.buildCells(this.rightYear()));

  /** Rows of 3 months each (4 rows × 3 cols = 12 months). */
  readonly leftRows = computed(() => this.toRows(this.leftCells()));
  readonly rightRows = computed(() => this.toRows(this.rightCells()));

  private buildCells(year: number): MonthCell[] {
    return Array.from({ length: 12 }, (_, month) => ({
      year,
      month,
      label: this.dateAdapter.getMonthNames('short')[month],
      disabled: this.isCellDisabled(year, month),
    }));
  }

  private toRows(cells: MonthCell[]): MonthCell[][] {
    const rows: MonthCell[][] = [];
    for (let i = 0; i < cells.length; i += 3) {
      rows.push(cells.slice(i, i + 3));
    }
    return rows;
  }

  private isCellDisabled(year: number, month: number): boolean {
    const min = this.min();
    const max = this.max();
    if (min && year < min.getFullYear()) return true;
    if (min && year === min.getFullYear() && month < min.getMonth()) return true;
    if (max && year > max.getFullYear()) return true;
    if (max && year === max.getFullYear() && month > max.getMonth()) return true;
    return false;
  }

  onCellClick(cell: MonthCell): void {
    if (cell.disabled) return;

    const start = this.rangeStart();

    if (!start || (start && this.rangeEnd())) {
      // First click — reset selection
      this.rangeStart.set({ year: cell.year, month: cell.month });
      this.rangeEnd.set(null);
    } else {
      // Second click — finalize range
      let s = start;
      let e = { year: cell.year, month: cell.month };

      // Auto-invert if end is before start
      if (this.compareCells(e, s) < 0) {
        [s, e] = [e, s];
      }

      this.rangeStart.set(s);
      this.rangeEnd.set(e);
      this.hoverCell.set(null);

      const rangeStart = new Date(s.year, s.month, 1);
      const rangeEnd = this.dateAdapter.createDate(
        e.year,
        e.month,
        this.dateAdapter.getNumDaysInMonth(this.dateAdapter.createDate(e.year, e.month, 1)),
      );
      this.rangeSelected.emit(new DateRange(rangeStart, rangeEnd));
    }
  }

  onCellHover(cell: MonthCell | null): void {
    if (this.rangeStart() && !this.rangeEnd()) {
      this.hoverCell.set(cell);
    }
  }

  getCellState(
    cell: MonthCell,
  ): 'range-start' | 'range-end' | 'in-range' | 'preview' | 'selected' | '' {
    const start = this.rangeStart();
    const end = this.rangeEnd();
    const hover = this.hoverCell();

    if (!start) return '';

    const cellKey = this.compareCells(cell, start);

    if (end) {
      if (cellKey === 0 && this.compareCells(cell, start) === 0) return 'range-start';
      if (this.compareCells(cell, end) === 0) return 'range-end';
      if (this.compareCells(cell, start) === 0) return 'range-start';
      if (cellKey > 0 && this.compareCells(cell, end) < 0) return 'in-range';
      return '';
    }

    // During selection (after first click, before second)
    if (this.compareCells(cell, start) === 0) return 'range-start';

    if (hover) {
      const effectiveEnd = this.compareCells(hover, start) >= 0 ? hover : start;
      const effectiveStart = this.compareCells(hover, start) >= 0 ? start : hover;

      if (this.compareCells(cell, effectiveStart) === 0) return 'range-start';
      if (this.compareCells(cell, effectiveEnd) === 0) return 'range-end';
      if (
        this.compareCells(cell, effectiveStart) > 0 &&
        this.compareCells(cell, effectiveEnd) < 0
      ) {
        return 'preview';
      }
    }

    return '';
  }

  private compareCells(
    a: { year: number; month: number },
    b: { year: number; month: number },
  ): number {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  }

  prevYear(): void {
    this.leftYear.update((y) => y - 1);
  }

  nextYear(): void {
    this.leftYear.update((y) => y + 1);
  }

  trackByMonth(_: number, cell: MonthCell): string {
    return `${cell.year}-${cell.month}`;
  }
}
