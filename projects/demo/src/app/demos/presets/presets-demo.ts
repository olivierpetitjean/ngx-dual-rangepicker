import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { NgxDualRangepickerComponent, DateRangeResult, DateRangePreset } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-presets-demo',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './presets-demo.html',
})
export class PresetsDemoComponent {
  resultDefault: DateRangeResult | null = null;
  resultCustom: DateRangeResult | null = null;
  resultNoPresets: DateRangeResult | null = null;

  /** Custom preset list — fiscal quarters starting in April */
  readonly fiscalPresets: DateRangePreset[] = [
    {
      label: 'Q1 (Apr–Jun)',
      range: () => {
        const y = new Date().getFullYear();
        return new DateRange(new Date(y, 3, 1), new Date(y, 5, 30));
      },
    },
    {
      label: 'Q2 (Jul–Sep)',
      range: () => {
        const y = new Date().getFullYear();
        return new DateRange(new Date(y, 6, 1), new Date(y, 8, 30));
      },
    },
    {
      label: 'Q3 (Oct–Dec)',
      range: () => {
        const y = new Date().getFullYear();
        return new DateRange(new Date(y, 9, 1), new Date(y, 11, 31));
      },
    },
    {
      label: 'Q4 (Jan–Mar)',
      range: () => {
        const y = new Date().getFullYear();
        return new DateRange(new Date(y, 0, 1), new Date(y, 2, 31));
      },
    },
    {
      label: 'Full year',
      range: () => {
        const y = new Date().getFullYear();
        return new DateRange(new Date(y, 3, 1), new Date(y + 1, 2, 31));
      },
    },
  ];

  readonly snippetCustom = `import { DateRangePreset } from 'ngx-dual-rangepicker';
import { DateRange } from '@angular/material/datepicker';

fiscalPresets: DateRangePreset[] = [
  {
    label: 'Q1 (Apr–Jun)',
    range: () => {
      const y = new Date().getFullYear();
      return new DateRange(new Date(y, 3, 1), new Date(y, 5, 30));
    },
  },
  // ...
];`;

  readonly snippetNoPresets = `<!-- Hide the presets sidebar entirely -->
<ngx-dual-rangepicker [showPresets]="false" />`;
}
