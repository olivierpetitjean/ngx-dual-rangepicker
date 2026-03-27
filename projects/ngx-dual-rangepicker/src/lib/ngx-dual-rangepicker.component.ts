import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayModule,
} from '@angular/cdk/overlay';

import { DualCalendarPanelComponent } from './dual-calendar-panel.component';
import { DateRangePreset, DateRangeResult, SelectionMode } from './date-range-picker.models';
import { DEFAULT_PRESETS } from './date-range-picker.presets';

@Component({
  selector: 'ngx-dual-rangepicker',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayModule,
    DualCalendarPanelComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDualRangepickerComponent),
      multi: true,
    },
  ],
  templateUrl: './ngx-dual-rangepicker.component.html',
  styleUrl: './ngx-dual-rangepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDualRangepickerComponent implements ControlValueAccessor, OnDestroy {
  private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly host = inject(ElementRef);

  // ── Inputs ────────────────────────────────────────────────────────────────
  readonly selectionMode = input<SelectionMode>('date');
  readonly enableTimePicker = input<boolean>(false);
  readonly presets = input<DateRangePreset[]>(DEFAULT_PRESETS);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly dateFormat = input<string>('mediumDate');
  readonly placeholder = input<string>('Select a date range');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly showModeSelector = input<boolean>(true);
  readonly showPresets = input<boolean>(true);
  readonly layout = input<'auto' | 'horizontal' | 'vertical'>('auto');

  // ── Outputs ───────────────────────────────────────────────────────────────
  readonly rangeChanged = output<DateRangeResult>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // ── Internal state ────────────────────────────────────────────────────────
  readonly isOpen = signal(false);
  readonly currentRange = signal<DateRange<Date> | null>(null);
  readonly displayValue = signal<string>('');

  readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];

  // ── CVA ───────────────────────────────────────────────────────────────────
  private onChange: (value: DateRangeResult | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DateRangeResult | null): void {
    if (value?.start && value?.end) {
      this.currentRange.set(new DateRange(value.start, value.end));
      this.displayValue.set(this.formatRange(value.start, value.end));
    } else {
      this.currentRange.set(null);
      this.displayValue.set('');
    }
  }

  registerOnChange(fn: (value: DateRangeResult | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled via [disabled] input binding on the trigger
  }

  // ── Overlay ───────────────────────────────────────────────────────────────

  open(): void {
    if (this.disabled()) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    this.isOpen.set(false);
    this.onTouched();
    this.closed.emit();
  }

  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  onBackdropClick(): void {
    this.close();
  }

  // ── Panel events ──────────────────────────────────────────────────────────

  onApplied(result: DateRangeResult): void {
    this.currentRange.set(new DateRange(result.start, result.end));
    this.displayValue.set(this.formatRange(result.start, result.end));
    this.onChange(result);
    this.rangeChanged.emit(result);
    this.close();
  }

  onCancelled(): void {
    this.close();
  }

  clearSelection(): void {
    this.writeValue(null);
    this.onChange(null);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private formatRange(start: Date, end: Date): string {
    try {
      const fmt = (d: Date) =>
        this.dateAdapter.format(d, { year: 'numeric', month: 'short', day: 'numeric' } as any);
      return `${fmt(start)} – ${fmt(end)}`;
    } catch {
      return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
    }
  }

  ngOnDestroy(): void {
    this.isOpen.set(false);
  }
}
