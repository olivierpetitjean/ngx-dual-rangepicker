import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TimePickerComponent } from '../time-picker.component';

describe('TimePickerComponent', () => {
  describe('default (24h, sameDay=false)', () => {
    let fixture: ComponentFixture<TimePickerComponent>;
    let component: TimePickerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TimePickerComponent],
        providers: [provideAnimations()],
      }).compileComponents();

      fixture = TestBed.createComponent(TimePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialise with 00:00 start and 23:59 end', () => {
      expect(component.startTime()).toEqual({ hours: 0, minutes: 0 });
      expect(component.endTime()).toEqual({ hours: 23, minutes: 59 });
    });

    it('should initialise display as 00:00 and 23:59', () => {
      expect(component.startTimeDisplay()).toBe('00:00');
      expect(component.endTimeDisplay()).toBe('23:59');
    });

    it('should update startTime after valid HH:MM input + blur', () => {
      component.onStartTimeInput('08:30');
      component.onStartTimeBlur();
      expect(component.startTime()).toEqual({ hours: 8, minutes: 30 });
    });

    it('should update endTime after valid HH:MM input + blur', () => {
      component.onEndTimeInput('17:45');
      component.onEndTimeBlur();
      expect(component.endTime()).toEqual({ hours: 17, minutes: 45 });
    });

    it('should normalise single-digit values to zero-padded on blur', () => {
      component.onStartTimeInput('8:5');
      component.onStartTimeBlur();
      expect(component.startTimeDisplay()).toBe('08:05');
    });

    it('should show startError for non-time input', () => {
      component.onStartTimeInput('abc');
      expect(component.startError()).toBeTruthy();
    });

    it('should show startError for out-of-range hours', () => {
      component.onStartTimeInput('25:00');
      expect(component.startError()).toBeTruthy();
    });

    it('should show endError for out-of-range minutes', () => {
      component.onEndTimeInput('12:75');
      expect(component.endError()).toBeTruthy();
    });

    it('should reset to last valid value on invalid blur', () => {
      component.onStartTimeInput('invalid');
      component.onStartTimeBlur();
      // Resets to current startTime model value (00:00)
      expect(component.startTimeDisplay()).toBe('00:00');
      expect(component.startError()).toBe('');
    });

    it('should clear error after valid input + blur', () => {
      component.onStartTimeInput('25:00');
      expect(component.startError()).toBeTruthy();
      component.onStartTimeInput('08:00');
      component.onStartTimeBlur();
      expect(component.startError()).toBe('');
    });

    it('should not validate cross-time order when sameDay is false', () => {
      component.onStartTimeInput('22:00');
      component.onStartTimeBlur();
      component.onEndTimeInput('08:00');
      component.onEndTimeBlur();
      expect(component.endError()).toBe('');
    });
  });

  describe('with sameDay=true', () => {
    let fixture: ComponentFixture<TimePickerComponent>;
    let component: TimePickerComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TimePickerComponent],
        providers: [provideAnimations()],
      }).compileComponents();

      fixture = TestBed.createComponent(TimePickerComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('sameDay', true);
      fixture.detectChanges();
    });

    it('should set endError when end time is before start', () => {
      component.onStartTimeInput('10:00');
      component.onStartTimeBlur();
      component.onEndTimeInput('09:00');
      component.onEndTimeBlur();
      expect(component.endError()).toContain('End time must be after start time');
    });

    it('should not set endError when end equals start', () => {
      component.onStartTimeInput('10:30');
      component.onStartTimeBlur();
      component.onEndTimeInput('10:30');
      component.onEndTimeBlur();
      expect(component.endError()).toBe('');
    });

    it('should not set endError when end is after start', () => {
      component.onStartTimeInput('08:00');
      component.onStartTimeBlur();
      component.onEndTimeInput('17:00');
      component.onEndTimeBlur();
      expect(component.endError()).toBe('');
    });
  });
});
