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
  showPresets = signal(true);
  showModeSelector = signal(true);
  layout = signal<'auto' | 'horizontal' | 'vertical'>('auto');
  placeholder = signal('Select a date range');
  disabled = signal(false);
  required = signal(false);

  result: DateRangeResult | null = null;

  get generatedSnippet(): string {
    const attrs: string[] = [];
    if (this.selectionMode() !== 'date') attrs.push(`selectionMode="${this.selectionMode()}"`);
    if (this.enableTimePicker()) attrs.push(`[enableTimePicker]="true"`);
    if (!this.showPresets()) attrs.push(`[showPresets]="false"`);
    if (!this.showModeSelector()) attrs.push(`[showModeSelector]="false"`);
    if (this.layout() !== 'auto') attrs.push(`layout="${this.layout()}"`);
    if (this.placeholder() !== 'Select a date range')
      attrs.push(`placeholder="${this.placeholder()}"`);
    if (this.disabled()) attrs.push(`[disabled]="true"`);
    if (this.required()) attrs.push(`[required]="true"`);
    attrs.push(`[(ngModel)]="result"`);
    const body = attrs.length ? '\n  ' + attrs.join('\n  ') + '\n' : '';
    return `<ngx-dual-rangepicker${body}/>`;
  }
}
