import { Component, computed, inject, signal } from '@angular/core';
import { JsonPipe, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  NgxDualRangepickerComponent,
  DateRangeResult,
  SelectionMode,
} from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';
import { ThemeService, PALETTES } from '../../shared/theme.service';

const THEME_DEFAULTS = {
  borderRadius: '12px',
  presetWidth: '168px',
  calendarGap: '16px',
  panelPadding: '16px',
};

@Component({
  selector: 'app-playground-demo',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    NgStyle,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxDualRangepickerComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './playground-demo.html',
  styleUrl: './playground-demo.scss',
})
export class PlaygroundDemoComponent {
  readonly theme = inject(ThemeService);
  readonly palettes = PALETTES;

  // ── Component inputs ──────────────────────────────────────────────────────
  selectionMode = signal<SelectionMode>('date');
  lockedMode = signal<SelectionMode | null>(null);
  enableTimePicker = signal(false);
  showPresets = signal(true);
  showModeSelector = signal(true);
  layout = signal<'auto' | 'horizontal' | 'vertical'>('auto');
  placeholder = signal('Select a date range');
  disabled = signal(false);
  required = signal(false);

  // ── CSS custom properties ─────────────────────────────────────────────────
  borderRadius = signal(THEME_DEFAULTS.borderRadius);
  presetWidth = signal(THEME_DEFAULTS.presetWidth);
  calendarGap = signal(THEME_DEFAULTS.calendarGap);
  panelPadding = signal(THEME_DEFAULTS.panelPadding);

  readonly pickerStyle = computed(() => ({
    '--drp-panel-border-radius': this.borderRadius(),
    '--drp-preset-width': this.presetWidth(),
    '--drp-calendar-gap': this.calendarGap(),
    '--drp-panel-padding': this.panelPadding(),
  }));

  readonly cssIsDefault = computed(() =>
    this.borderRadius() === THEME_DEFAULTS.borderRadius &&
    this.presetWidth() === THEME_DEFAULTS.presetWidth &&
    this.calendarGap() === THEME_DEFAULTS.calendarGap &&
    this.panelPadding() === THEME_DEFAULTS.panelPadding,
  );

  result: DateRangeResult | null = null;

  resetCss(): void {
    this.borderRadius.set(THEME_DEFAULTS.borderRadius);
    this.presetWidth.set(THEME_DEFAULTS.presetWidth);
    this.calendarGap.set(THEME_DEFAULTS.calendarGap);
    this.panelPadding.set(THEME_DEFAULTS.panelPadding);
  }

  get generatedSnippet(): string {
    const attrs: string[] = [];
    if (this.selectionMode() !== 'date') attrs.push(`selectionMode="${this.selectionMode()}"`);
    if (this.lockedMode() !== null) attrs.push(`lockedMode="${this.lockedMode()}"`);
    if (this.enableTimePicker()) attrs.push(`[enableTimePicker]="true"`);
    if (!this.showPresets()) attrs.push(`[showPresets]="false"`);
    if (!this.showModeSelector()) attrs.push(`[showModeSelector]="false"`);
    if (this.layout() !== 'auto') attrs.push(`layout="${this.layout()}"`);
    if (this.placeholder() !== 'Select a date range')
      attrs.push(`placeholder="${this.placeholder()}"`);
    if (this.disabled()) attrs.push(`[disabled]="true"`);
    if (this.required()) attrs.push(`[required]="true"`);
    attrs.push(`[(ngModel)]="result"`);
    const indent = attrs.map(a => `  ${a}`).join('\n');

    const cssLines: string[] = [];
    if (this.borderRadius() !== THEME_DEFAULTS.borderRadius)
      cssLines.push(`--drp-panel-border-radius:${this.borderRadius()}`);
    if (this.presetWidth() !== THEME_DEFAULTS.presetWidth)
      cssLines.push(`--drp-preset-width:${this.presetWidth()}`);
    if (this.calendarGap() !== THEME_DEFAULTS.calendarGap)
      cssLines.push(`--drp-calendar-gap:${this.calendarGap()}`);
    if (this.panelPadding() !== THEME_DEFAULTS.panelPadding)
      cssLines.push(`--drp-panel-padding:${this.panelPadding()}`);

    const styleAttr = cssLines.length
      ? `\n  style="${cssLines.join('; ')}"` : '';

    return `<ngx-dual-rangepicker\n${indent}${styleAttr}\n/>`;
  }
}
