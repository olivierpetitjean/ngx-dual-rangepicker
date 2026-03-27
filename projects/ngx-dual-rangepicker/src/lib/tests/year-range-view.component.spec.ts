import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRange } from '@angular/material/datepicker';
import { YearRangeViewComponent } from '../year-range-view.component';

describe('YearRangeViewComponent', () => {
  let fixture: ComponentFixture<YearRangeViewComponent>;
  let component: YearRangeViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearRangeViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearRangeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 12 years per panel', () => {
    expect(component.leftCells().length).toBe(12);
    expect(component.rightCells().length).toBe(12);
  });

  it('right panel starts immediately after left panel', () => {
    expect(component.rightPageStart()).toBe(component.leftPageStart() + 12);
  });

  it('should have no gap between panels', () => {
    const leftLast = component.leftCells().at(-1)!.year;
    const rightFirst = component.rightCells()[0].year;
    expect(rightFirst).toBe(leftLast + 1);
  });

  it('prevLeftPage() should go back 12 years', () => {
    const before = component.leftPageStart();
    component.prevLeftPage();
    expect(component.leftPageStart()).toBe(before - 12);
  });

  it('nextLeftPage() should advance 12 years when room exists', () => {
    // Open a gap: advance right page first so left can advance too
    component.nextRightPage();
    const before = component.leftPageStart();
    component.nextLeftPage();
    expect(component.leftPageStart()).toBe(before + 12);
  });

  describe('selection', () => {
    it('first click sets range-start state', () => {
      const cell = component.leftCells()[2];
      component.onCellClick(cell);
      expect(component.getCellState(cell)).toBe('range-start');
    });

    it('second click finalises range and emits rangeSelected', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      const start = component.leftCells()[0];
      const end = component.leftCells()[4];
      component.onCellClick(start);
      component.onCellClick(end);

      expect(emitted.length).toBe(1);
      expect(emitted[0].start!.getFullYear()).toBe(start.year);
      expect(emitted[0].end!.getFullYear()).toBe(end.year);
    });

    it('should auto-invert when end year is before start year', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      const later = component.leftCells()[5];
      const earlier = component.leftCells()[1];
      component.onCellClick(later);
      component.onCellClick(earlier);

      expect(emitted[0].start!.getFullYear()).toBeLessThan(emitted[0].end!.getFullYear());
      expect(emitted[0].start!.getFullYear()).toBe(earlier.year);
    });

    it('range starts on Jan 1', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]);
      component.onCellClick(component.leftCells()[2]);

      expect(emitted[0].start!.getMonth()).toBe(0);
      expect(emitted[0].start!.getDate()).toBe(1);
    });

    it('range ends on Dec 31', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]);
      component.onCellClick(component.leftCells()[2]);

      expect(emitted[0].end!.getMonth()).toBe(11);
      expect(emitted[0].end!.getDate()).toBe(31);
    });

    it('cross-panel range works', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[10]);
      component.onCellClick(component.rightCells()[2]);

      expect(emitted[0].start!.getFullYear()).toBeLessThan(emitted[0].end!.getFullYear());
    });

    it('clicking again after full selection resets to first click', () => {
      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]);
      component.onCellClick(component.leftCells()[3]);
      component.onCellClick(component.leftCells()[6]); // reset

      expect(component.getCellState(component.leftCells()[6])).toBe('range-start');
      expect(component.getCellState(component.leftCells()[0])).toBe('');
    });
  });

  describe('hover preview', () => {
    it('should show preview on hover after first click', () => {
      component.onCellClick(component.leftCells()[1]);
      component.onCellHover(component.leftCells()[5]);

      expect(component.getCellState(component.leftCells()[3])).toBe('preview');
    });

    it('should show inverted preview when hovering before start', () => {
      component.onCellClick(component.leftCells()[5]);
      component.onCellHover(component.leftCells()[2]);

      expect(component.getCellState(component.leftCells()[3])).toBe('preview');
      expect(component.getCellState(component.leftCells()[2])).toBe('range-start');
    });
  });

  describe('disabled cells', () => {
    it('should disable cells outside min/max range', () => {
      const start = component.leftCells()[0].year;
      fixture.componentRef.setInput('min', new Date(start + 3, 0, 1));
      fixture.detectChanges();

      expect(component.leftCells()[0].disabled).toBeTrue();
      expect(component.leftCells()[2].disabled).toBeTrue();
      expect(component.leftCells()[3].disabled).toBeFalse();
    });

    it('should not emit when a disabled cell is clicked', () => {
      const start = component.leftCells()[0].year;
      fixture.componentRef.setInput('max', new Date(start + 2, 11, 31));
      fixture.detectChanges();

      const emitted: DateRange<Date>[] = [];
      component.rangeSelected.subscribe((r) => emitted.push(r));

      component.onCellClick(component.leftCells()[0]);
      component.onCellClick(component.leftCells()[11]); // disabled
      expect(emitted.length).toBe(0);
    });
  });
});
