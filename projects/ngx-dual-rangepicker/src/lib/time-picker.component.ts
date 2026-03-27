import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DUAL_CALENDAR_INTL } from './date-range-picker.tokens';

export interface TimeValue {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'ngx-time-picker',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent implements OnInit {
  readonly intl = inject(DUAL_CALENDAR_INTL);

  /** Whether both start and end fall on the same day (enables startTime <= endTime validation). */
  readonly sameDay = input<boolean>(false);

  /** Use 12-hour format instead of 24-hour. */
  readonly use12Hour = input<boolean>(false);

  readonly startTime = model<TimeValue>({ hours: 0, minutes: 0 });
  readonly endTime = model<TimeValue>({ hours: 23, minutes: 59 });

  startTimeDisplay = signal('00:00');
  endTimeDisplay = signal('23:59');

  startError = signal('');
  endError = signal('');

  ngOnInit(): void {
    this.syncDisplayFromModel();
  }

  private syncDisplayFromModel(): void {
    const s = this.startTime();
    const e = this.endTime();
    this.startTimeDisplay.set(this.formatTime(s.hours, s.minutes));
    this.endTimeDisplay.set(this.formatTime(e.hours, e.minutes));
  }

  onStartTimeInput(value: string): void {
    this.startTimeDisplay.set(value);
    this.validate();
  }

  onStartTimeBlur(): void {
    const parsed = this.parseTime(this.startTimeDisplay());
    if (parsed) {
      this.startTimeDisplay.set(this.formatTime(parsed.hours, parsed.minutes));
    } else {
      // Reset to last committed model value
      const t = this.startTime();
      this.startTimeDisplay.set(this.formatTime(t.hours, t.minutes));
    }
    this.validate();
  }

  onEndTimeInput(value: string): void {
    this.endTimeDisplay.set(value);
    this.validate();
  }

  onEndTimeBlur(): void {
    const parsed = this.parseTime(this.endTimeDisplay());
    if (parsed) {
      this.endTimeDisplay.set(this.formatTime(parsed.hours, parsed.minutes));
    } else {
      const t = this.endTime();
      this.endTimeDisplay.set(this.formatTime(t.hours, t.minutes));
    }
    this.validate();
  }

  private validate(): void {
    const startParsed = this.parseTime(this.startTimeDisplay());
    const endParsed = this.parseTime(this.endTimeDisplay());

    let startErr = '';
    let endErr = '';

    if (!startParsed) startErr = 'Invalid time (HH:MM)';
    if (!endParsed) endErr = 'Invalid time (HH:MM)';

    if (!startErr && !endErr && this.sameDay() && startParsed && endParsed) {
      const startTotal = startParsed.hours * 60 + startParsed.minutes;
      const endTotal = endParsed.hours * 60 + endParsed.minutes;
      if (startTotal > endTotal) {
        endErr = 'End time must be after start time';
      }
    }

    this.startError.set(startErr);
    this.endError.set(endErr);

    if (!startErr && !endErr && startParsed && endParsed) {
      this.startTime.set(startParsed);
      this.endTime.set(endParsed);
    }
  }

  private parseTime(value: string): { hours: number; minutes: number } | null {
    const match = value.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const maxH = this.use12Hour() ? 12 : 23;
    if (hours < 0 || hours > maxH || minutes < 0 || minutes > 59) return null;
    return { hours, minutes };
  }

  private formatTime(hours: number, minutes: number): string {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}
