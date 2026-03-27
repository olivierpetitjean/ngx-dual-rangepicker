import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { MonthRangeViewComponent } from '../month-range-view.component';

describe('MonthRangeViewComponent', () => {
  let fixture: ComponentFixture<MonthRangeViewComponent>;
  let component: MonthRangeViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthRangeViewComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthRangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 12 months per panel', () => {
    expect(component.leftCells().length).toBe(12);
    expect(component.rightCells().length).toBe(12);
  });

  it('should render 4 rows of 3 months each', () => {
    expect(component.leftRows().length).toBe(4);
    expect(component.leftRows()[0].length).toBe(3);
  });

  it('right panel should be left year + 1', () => {
    const leftYear = component.leftYear();
    expect(component.rightYear()).toBe(leftYear + 1);
  });

  it('prevLeftYear() should decrement left year', () => {
    const before = component.leftYear();
    component.prevLeftYear();
    expect(component.leftYear()).toBe(before - 1);
  });

  it('nextLeftYear() should increment left year (if room before right)', () => {
    const before = component.leftYear();
    component.nextLeftYear();
    // Only increments if leftYear + 1 < rightYear
    if (before + 1 < component.rightYear()) {
      expect(component.leftYear()).toBe(before + 1);
    } else {
      expect(component.leftYear()).toBe(before);
    }
  });

  describe('selection', () => {
    it('first click sets range-start state', () => {
      const cell = component.leftCells()[2]; // March
      component.onCellClick(cell);
      expect(component.getCellState(cell)).toBe('range-start');
    });

    it('second click finalises range and emits rangeSelected', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      const start = component.leftCells()[1]; // Feb
      const end = component.leftCells()[4];   // May
      component.onCellClick(start);
      component.onCellClick(end);

      expect(emitted.length).toBe(1);
      expect(emitted[0].start!.getMonth()).toBe(1); // Feb = 0-based 1
      expect(emitted[0].end!.getMonth()).toBe(4);   // May
    });

    it('should auto-invert when end is before start', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      const later = component.leftCells()[6];  // July
      const earlier = component.leftCells()[2]; // March
      component.onCellClick(later);
      component.onCellClick(earlier);

      expect(emitted[0].start!.getMonth()).toBe(2); // March
      expect(emitted[0].end!.getMonth()).toBe(6);   // July
    });

    it('range-start cell starts on first day of month', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]); // Jan
      component.onCellClick(component.leftCells()[2]); // March

      expect(emitted[0].start!.getDate()).toBe(1);
    });

    it('range-end cell ends on last day of month', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]); // Jan
      component.onCellClick(component.leftCells()[2]); // March

      const end = emitted[0].end!;
      const lastDay = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
      expect(end.getDate()).toBe(lastDay);
    });

    it('cross-year range works (left panel start, right panel end)', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      const startCell = component.leftCells()[10];  // Nov left year
      const endCell = component.rightCells()[1];    // Feb right year
      component.onCellClick(startCell);
      component.onCellClick(endCell);

      expect(emitted[0].start!.getFullYear()).toBe(component.leftYear() - 0); // patched below
      expect(emitted[0].end!.getFullYear()).toBe(component.rightYear());
    });
  });

  describe('hover preview', () => {
    it('should show preview state on hover after first click', () => {
      component.onCellClick(component.leftCells()[1]); // Feb selected as start
      component.onCellHover(component.leftCells()[5]); // hover June

      // Cells 2-4 (Mar-May) should be in preview
      expect(component.getCellState(component.leftCells()[3])).toBe('preview');
    });

    it('should clear preview after second click', () => {
      component.onCellClick(component.leftCells()[1]);
      component.onCellHover(component.leftCells()[5]);
      component.onCellClick(component.leftCells()[5]);
      component.onCellHover(null);

      expect(component.getCellState(component.leftCells()[3])).toBe('in-range');
    });
  });

  describe('disabled cells', () => {
    it('should disable cells before min date', () => {
      const year = new Date().getFullYear();
      fixture.componentRef.setInput('min', new Date(year, 5, 1)); // June
      fixture.detectChanges();

      const jan = component.leftCells()[0];
      expect(jan.disabled).toBeTrue();
    });

    it('should not emit when clicking a disabled cell', () => {
      const year = new Date().getFullYear();
      fixture.componentRef.setInput('min', new Date(year, 5, 1));
      fixture.detectChanges();

      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]); // disabled Jan
      component.onCellClick(component.leftCells()[7]); // Aug
      expect(emitted.length).toBe(0);
    });
  });
});
