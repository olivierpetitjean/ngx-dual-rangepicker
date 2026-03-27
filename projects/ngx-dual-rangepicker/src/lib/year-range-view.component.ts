import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { DateRange } from '@angular/material/datepicker';

export interface YearCell {
  year: number;
  disabled: boolean;
}

const YEARS_PER_PANEL = 12;

@Component({
  selector: 'ngx-year-range-view',
  standalone: true,
  imports: [],
  templateUrl: './year-range-view.component.html',
  styleUrl: './year-range-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearRangeViewComponent {
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  /** Emitted when a complete year range has been selected. */
  readonly rangeSelected = output<DateRange<Date>>();

  /**
   * The first year of the left panel page.
   * Right panel starts at leftPageStart + YEARS_PER_PANEL.
   */
  readonly leftPageStart = model<number>(this.defaultPageStart());
  readonly rightPageStart = signal<number>(this.defaultPageStart() + YEARS_PER_PANEL);

  private readonly rangeStart = signal<number | null>(null);
  private readonly rangeEnd = signal<number | null>(null);
  private readonly hoverYear = signal<number | null>(null);

  readonly leftCells = computed(() => this.buildCells(this.leftPageStart()));
  readonly rightCells = computed(() => this.buildCells(this.rightPageStart()));

  readonly leftRows = computed(() => this.toRows(this.leftCells()));
  readonly rightRows = computed(() => this.toRows(this.rightCells()));

  readonly leftPageLabel = computed(
    () => `${this.leftPageStart()} – ${this.leftPageStart() + YEARS_PER_PANEL - 1}`,
  );
  readonly rightPageLabel = computed(
    () => `${this.rightPageStart()} – ${this.rightPageStart() + YEARS_PER_PANEL - 1}`,
  );

  private defaultPageStart(): number {
    const current = new Date().getFullYear();
    return current - (current % YEARS_PER_PANEL);
  }

  private buildCells(pageStart: number): YearCell[] {
    return Array.from({ length: YEARS_PER_PANEL }, (_, i) => {
      const year = pageStart + i;
      return { year, disabled: this.isYearDisabled(year) };
    });
  }

  private toRows(cells: YearCell[]): YearCell[][] {
    const rows: YearCell[][] = [];
    for (let i = 0; i < cells.length; i += 3) {
      rows.push(cells.slice(i, i + 3));
    }
    return rows;
  }

  private isYearDisabled(year: number): boolean {
    const min = this.min();
    const max = this.max();
    if (min && year < min.getFullYear()) return true;
    if (max && year > max.getFullYear()) return true;
    return false;
  }

  onCellClick(cell: YearCell): void {
    if (cell.disabled) return;

    const start = this.rangeStart();

    if (start === null || (start !== null && this.rangeEnd() !== null)) {
      this.rangeStart.set(cell.year);
      this.rangeEnd.set(null);
    } else {
      let s = start;
      let e = cell.year;
      if (e < s) [s, e] = [e, s];

      this.rangeStart.set(s);
      this.rangeEnd.set(e);
      this.hoverYear.set(null);

      this.rangeSelected.emit(
        new DateRange(new Date(s, 0, 1), new Date(e, 11, 31)),
      );
    }
  }

  onCellHover(cell: YearCell | null): void {
    if (this.rangeStart() !== null && this.rangeEnd() === null) {
      this.hoverYear.set(cell?.year ?? null);
    }
  }

  getCellState(cell: YearCell): 'range-start' | 'range-end' | 'in-range' | 'preview' | '' {
    const start = this.rangeStart();
    const end = this.rangeEnd();
    const hover = this.hoverYear();
    const y = cell.year;

    if (start === null) return '';

    if (end !== null) {
      if (y === start) return 'range-start';
      if (y === end) return 'range-end';
      if (y > start && y < end) return 'in-range';
      return '';
    }

    if (y === start) return 'range-start';

    if (hover !== null) {
      const lo = Math.min(start, hover);
      const hi = Math.max(start, hover);
      if (y === lo) return 'range-start';
      if (y === hi) return 'range-end';
      if (y > lo && y < hi) return 'preview';
    }

    return '';
  }

  prevLeftPage(): void {
    this.leftPageStart.update((s) => s - YEARS_PER_PANEL);
  }

  nextLeftPage(): void {
    this.leftPageStart.update((s) => s + YEARS_PER_PANEL);
  }

  prevRightPage(): void {
    this.rightPageStart.update((s) => s - YEARS_PER_PANEL);
  }

  nextRightPage(): void {
    this.rightPageStart.update((s) => s + YEARS_PER_PANEL);
  }
}
