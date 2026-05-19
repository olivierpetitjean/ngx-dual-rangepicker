import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {
  NgxDualRangepickerComponent,
  DateRangeResult,
  MobilePanelPosition,
  SelectionMode,
} from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-config-demo',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    NgxDualRangepickerComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './config-demo.html',
  styleUrl: './config-demo.scss',
})
export class ConfigDemoComponent {
  // ── Knobs ──────────────────────────────────────────────────────────────────
  selectionMode = signal<SelectionMode>('date');
  enableTimePicker = signal(false);
  enableMobile = signal(true);
  mobilePanelPosition = signal<MobilePanelPosition>('left');
  showPresets = signal(true);
  showModeSelector = signal(true);
  layout = signal<'auto' | 'horizontal' | 'vertical'>('auto');
  placeholder = signal('Select a date range');
  minCalendarDays = signal<number | null>(null);
  maxCalendarDays = signal<number | null>(null);
  disabled = signal(false);
  required = signal(false);
  disableAnimations = signal(false);

  result: DateRangeResult | null = null;

  get generatedSnippet(): string {
    const attrs: string[] = [];
    if (this.selectionMode() !== 'date') attrs.push(`selectionMode="${this.selectionMode()}"`);
    if (this.enableTimePicker()) attrs.push(`[enableTimePicker]="true"`);
    if (this.enableMobile()) attrs.push(`[enableMobile]="true"`);
    if (this.enableMobile() && this.mobilePanelPosition() !== 'fullscreen') {
      attrs.push(`mobilePanelPosition="${this.mobilePanelPosition()}"`);
    }
    if (!this.showPresets()) attrs.push(`[showPresets]="false"`);
    if (!this.showModeSelector()) attrs.push(`[showModeSelector]="false"`);
    if (this.layout() !== 'auto') attrs.push(`layout="${this.layout()}"`);
    if (this.placeholder() !== 'Select a date range')
      attrs.push(`placeholder="${this.placeholder()}"`);
    if (this.minCalendarDays() !== null) attrs.push(`[minCalendarDays]="${this.minCalendarDays()}"`);
    if (this.maxCalendarDays() !== null) attrs.push(`[maxCalendarDays]="${this.maxCalendarDays()}"`);
    if (this.disabled()) attrs.push(`[disabled]="true"`);
    if (this.required()) attrs.push(`[required]="true"`);
    if (this.disableAnimations()) attrs.push(`[disableAnimations]="true"`);
    attrs.push(`[(ngModel)]="result"`);
    const body = attrs.length ? '\n  ' + attrs.join('\n  ') + '\n' : '';
    return `<ngx-dual-rangepicker${body}/>`;
  }

  setMinCalendarDays(value: string): void {
    this.minCalendarDays.set(this.toNullableNumber(value));
  }

  setMaxCalendarDays(value: string): void {
    this.maxCalendarDays.set(this.toNullableNumber(value));
  }

  private toNullableNumber(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
