import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { DayCell, DayRangeViewComponent } from '../day-range-view.component';

describe('DayRangeViewComponent', () => {
  let fixture: ComponentFixture<DayRangeViewComponent>;
  let component: DayRangeViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayRangeViewComponent],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DayRangeViewComponent);
    component = fixture.componentInstance;
    component.leftMonth.set(new Date(2024, 0, 1));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable end-date candidates shorter than minCalendarDays', () => {
    fixture.componentRef.setInput('minCalendarDays', 3);
    component.onCellClick(day(10));
    fixture.detectChanges();

    expect(day(11).disabled).toBeTrue();
    expect(day(12).disabled).toBeFalse();
  });

  it('should disable end-date candidates longer than maxCalendarDays', () => {
    fixture.componentRef.setInput('maxCalendarDays', 3);
    component.onCellClick(day(10));
    fixture.detectChanges();

    expect(day(12).disabled).toBeFalse();
    expect(day(13).disabled).toBeTrue();
  });

  it('should not emit when a calendar-day constraint rejects the second click', () => {
    const emitted: DateRange<Date | null>[] = [];
    component.rangeSelected.subscribe((range) => emitted.push(range));

    fixture.componentRef.setInput('minCalendarDays', 3);
    component.onCellClick(day(10));
    component.onCellClick(day(11));

    expect(emitted.length).toBe(1);
    expect(emitted[0].start!.getDate()).toBe(10);
    expect(emitted[0].end).toBeNull();
  });

  function day(dayOfMonth: number): DayCell {
    const cell = component.leftWeeks()
      .flat()
      .find((c): c is DayCell =>
        c !== null &&
        c.date.getFullYear() === 2024 &&
        c.date.getMonth() === 0 &&
        c.date.getDate() === dayOfMonth,
      );
    if (!cell) throw new Error(`Missing day ${dayOfMonth}`);
    return cell;
  }
});
