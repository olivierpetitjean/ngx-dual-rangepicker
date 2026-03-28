import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
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
  readonly selectedRange = input<DateRange<Date | null> | null>(null);
  readonly vertical = input<boolean>(false);

  readonly rangeSelected = output<DateRange<Date | null>>();

  /** Suit la sélection lors d'un preset ou d'une réouverture, mais peut être écrasé par la navigation. */
  readonly leftPageStart = linkedSignal<number>(() => {
    const start = this.selectedRange()?.start;
    if (start) {
      const y = start.getFullYear();
      return y - (y % YEARS_PER_PANEL);
    }
    return this.defaultPageStart();
  });

  readonly rightPageStart = linkedSignal<number>(() => {
    const start = this.selectedRange()?.start;
    const end = this.selectedRange()?.end;
    const leftPage = start
      ? (() => { const y = start.getFullYear(); return y - (y % YEARS_PER_PANEL); })()
      : this.defaultPageStart();
    if (end) {
      const y = end.getFullYear();
      const endPage = y - (y % YEARS_PER_PANEL);
      return endPage > leftPage ? endPage : leftPage + YEARS_PER_PANEL;
    }
    return leftPage + YEARS_PER_PANEL;
  });

  /** Réagit automatiquement aux changements de selectedRange (preset, réouverture). */
  private readonly rangeStart = linkedSignal<number | null>(
    () => this.selectedRange()?.start?.getFullYear() ?? null,
  );
  private readonly rangeEnd = linkedSignal<number | null>(
    () => this.selectedRange()?.end?.getFullYear() ?? null,
  );
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
      this.rangeSelected.emit(new DateRange<Date | null>(new Date(cell.year, 0, 1), null));
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
    if (this.leftPageStart() + YEARS_PER_PANEL < this.rightPageStart()) {
      this.leftPageStart.update((s) => s + YEARS_PER_PANEL);
    }
  }

  prevRightPage(): void {
    if (this.rightPageStart() - YEARS_PER_PANEL > this.leftPageStart()) {
      this.rightPageStart.update((s) => s - YEARS_PER_PANEL);
    }
  }

  nextRightPage(): void {
    this.rightPageStart.update((s) => s + YEARS_PER_PANEL);
  }
}
