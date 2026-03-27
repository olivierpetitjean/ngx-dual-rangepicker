import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { NgxDualRangepickerComponent } from '../ngx-dual-rangepicker.component';
import { DateRangeResult } from '../date-range-picker.models';

// ── Wrapper host for CVA tests ────────────────────────────────────────────────
@Component({
  standalone: true,
  imports: [NgxDualRangepickerComponent, ReactiveFormsModule],
  template: `<ngx-dual-rangepicker [formControl]="ctrl" />`,
})
class HostComponent {
  ctrl = new FormControl<DateRangeResult | null>(null);
}

describe('NgxDualRangepickerComponent', () => {
  let fixture: ComponentFixture<NgxDualRangepickerComponent>;
  let component: NgxDualRangepickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxDualRangepickerComponent],
      providers: [provideAnimations(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxDualRangepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBeFalse();
  });

  it('open() should set isOpen to true', () => {
    component.open();
    expect(component.isOpen()).toBeTrue();
  });

  it('close() should set isOpen to false', () => {
    component.open();
    component.close();
    expect(component.isOpen()).toBeFalse();
  });

  it('toggle() should open when closed', () => {
    component.toggle();
    expect(component.isOpen()).toBeTrue();
  });

  it('toggle() should close when open', () => {
    component.open();
    component.toggle();
    expect(component.isOpen()).toBeFalse();
  });

  it('should not open when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    component.open();
    expect(component.isOpen()).toBeFalse();
  });

  it('Escape key should close the panel', () => {
    component.open();
    component.onOverlayKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isOpen()).toBeFalse();
  });

  it('backdrop click should close the panel', () => {
    component.open();
    component.onBackdropClick();
    expect(component.isOpen()).toBeFalse();
  });

  it('should emit opened when panel opens', () => {
    let emitted = false;
    component.opened.subscribe(() => (emitted = true));
    component.open();
    expect(emitted).toBeTrue();
  });

  it('should emit closed when panel closes', () => {
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));
    component.open();
    component.close();
    expect(emitted).toBeTrue();
  });

  describe('onApplied', () => {
    it('should update displayValue', () => {
      const result: DateRangeResult = {
        start: new Date(2024, 2, 10),
        end: new Date(2024, 2, 20),
      };
      component.onApplied(result);
      expect(component.displayValue()).toBeTruthy();
    });

    it('should close the panel after apply', () => {
      component.open();
      component.onApplied({ start: new Date(), end: new Date() });
      expect(component.isOpen()).toBeFalse();
    });

    it('should emit rangeChanged with the result', () => {
      const emitted: DateRangeResult[] = [];
      component.rangeChanged.subscribe((r) => emitted.push(r));

      const result: DateRangeResult = { start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) };
      component.onApplied(result);
      expect(emitted.length).toBe(1);
      expect(emitted[0]).toEqual(result);
    });
  });

  describe('writeValue (CVA)', () => {
    it('should update displayValue when given a valid range', () => {
      component.writeValue({ start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) });
      expect(component.displayValue()).toBeTruthy();
    });

    it('should clear displayValue when given null', () => {
      component.writeValue({ start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) });
      component.writeValue(null);
      expect(component.displayValue()).toBe('');
    });
  });

  describe('clearSelection', () => {
    it('should clear displayValue', () => {
      component.writeValue({ start: new Date(2024, 0, 1), end: new Date(2024, 0, 31) });
      component.clearSelection();
      expect(component.displayValue()).toBe('');
    });
  });
});

describe('NgxDualRangepickerComponent — CVA with FormControl', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideAnimations(), provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render inside a reactive form', () => {
    const picker = fixture.debugElement.query(By.css('ngx-dual-rangepicker'));
    expect(picker).toBeTruthy();
  });

  it('should reflect writeValue from FormControl', () => {
    const value: DateRangeResult = { start: new Date(2024, 2, 1), end: new Date(2024, 2, 31) };
    host.ctrl.setValue(value);
    fixture.detectChanges();

    const picker = fixture.debugElement.query(By.directive(NgxDualRangepickerComponent));
    const pickerComp = picker.componentInstance as NgxDualRangepickerComponent;
    expect(pickerComp.displayValue()).toBeTruthy();
  });

  it('setDisabledState should be callable without error', () => {
    expect(() => host.ctrl.disable()).not.toThrow();
  });
});
