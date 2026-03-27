import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import { By } from '@angular/platform-browser';

import { DualCalendarPanelComponent } from '../dual-calendar-panel.component';
import { DEFAULT_PRESETS } from '../date-range-picker.presets';

describe('DualCalendarPanelComponent', () => {
  let fixture: ComponentFixture<DualCalendarPanelComponent>;
  let component: DualCalendarPanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DualCalendarPanelComponent],
      providers: [provideAnimations(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(DualCalendarPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the day-range-view in date mode', () => {
    const dayView = fixture.debugElement.query(By.css('ngx-day-range-view'));
    expect(dayView).toBeTruthy();
  });

  it('should default to date mode', () => {
    expect(component.activeMode()).toBe('date');
  });

  it('should switch to month mode', () => {
    component.onModeChange('month');
    fixture.detectChanges();
    expect(component.activeMode()).toBe('month');
    expect(fixture.debugElement.query(By.css('ngx-month-range-view'))).toBeTruthy();
  });

  it('should switch to year mode', () => {
    component.onModeChange('year');
    fixture.detectChanges();
    expect(component.activeMode()).toBe('year');
    expect(fixture.debugElement.query(By.css('ngx-year-range-view'))).toBeTruthy();
  });

  it('Apply button should be disabled when no range is selected', () => {
    expect(component.canApply()).toBeFalse();
  });

  it('Apply button should be enabled after full range selection', () => {
    const start = new Date(2024, 2, 10);
    const end = new Date(2024, 2, 20);
    component.selectedRange.set(new DateRange(start, end));
    expect(component.canApply()).toBeTrue();
  });

  it('should emit applied event on onApply() with complete range', () => {
    const emitted: any[] = [];
    component.applied.subscribe((r) => emitted.push(r));

    const start = new Date(2024, 2, 10);
    const end = new Date(2024, 2, 20);
    component.selectedRange.set(new DateRange(start, end));
    component.onApply();

    expect(emitted.length).toBe(1);
    // onApply merges startTime (00:00) and endTime (23:59 default) into the dates
    expect(emitted[0].start.getFullYear()).toBe(start.getFullYear());
    expect(emitted[0].start.getMonth()).toBe(start.getMonth());
    expect(emitted[0].start.getDate()).toBe(start.getDate());
    expect(emitted[0].end.getFullYear()).toBe(end.getFullYear());
    expect(emitted[0].end.getMonth()).toBe(end.getMonth());
    expect(emitted[0].end.getDate()).toBe(end.getDate());
  });

  it('should not emit applied event when range is incomplete', () => {
    const emitted: any[] = [];
    component.applied.subscribe((r) => emitted.push(r));
    component.onApply();
    expect(emitted.length).toBe(0);
  });

  it('should emit cancelled event on onCancel()', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => (cancelled = true));
    component.onCancel();
    expect(cancelled).toBeTrue();
  });

  describe('presets', () => {
    it('should render 9 default presets', () => {
      const items = fixture.debugElement.queryAll(By.css('mat-list-item'));
      expect(items.length).toBe(9);
    });

    it('should select preset and mark it active', () => {
      const preset = DEFAULT_PRESETS[0]; // Today
      component.onPresetClick(preset);
      fixture.detectChanges();
      expect(component.selectedPresetLabel()).toBe('Today');
    });

    it('should update selectedRange when preset is clicked', fakeAsync(() => {
      component.onPresetClick(DEFAULT_PRESETS[0]); // Today
      tick();
      const range = component.selectedRange();
      expect(range.start).not.toBeNull();
      expect(range.end).not.toBeNull();
    }));

    it('should include preset label in applied result', () => {
      const emitted: any[] = [];
      component.applied.subscribe((r) => emitted.push(r));

      component.onPresetClick(DEFAULT_PRESETS[0]); // Today
      component.onApply();

      expect(emitted[0].preset).toBe('Today');
    });
  });

  describe('time picker', () => {
    it('should not show time picker by default', () => {
      expect(component.showTimePicker()).toBeFalse();
    });

    it('should show time picker when enableTimePicker=true and mode=date', () => {
      fixture.componentRef.setInput('enableTimePicker', true);
      fixture.detectChanges();
      expect(component.showTimePicker()).toBeTrue();
    });

    it('should hide time picker in month mode even if enableTimePicker=true', () => {
      fixture.componentRef.setInput('enableTimePicker', true);
      component.onModeChange('month');
      expect(component.showTimePicker()).toBeFalse();
    });
  });

  describe('navigation', () => {
    it('setting leftMonth signal advances the left calendar', () => {
      const before = component.leftMonth().getMonth();
      const next = new Date(component.leftMonth());
      next.setMonth(next.getMonth() + 1);
      component.leftMonth.set(next);
      expect(component.leftMonth().getMonth()).toBe((before + 1) % 12);
    });

    it('setting leftMonth signal goes back one month', () => {
      const before = component.leftMonth().getMonth();
      const prev = new Date(component.leftMonth());
      prev.setMonth(prev.getMonth() - 1);
      component.leftMonth.set(prev);
      const expected = before === 0 ? 11 : before - 1;
      expect(component.leftMonth().getMonth()).toBe(expected);
    });
  });
});
