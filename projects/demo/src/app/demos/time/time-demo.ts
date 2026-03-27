import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-time-demo',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './time-demo.html',
})
export class TimeDemoComponent {
  result: DateRangeResult | null = null;

  readonly snippetHtml = `<ngx-dual-rangepicker
  [enableTimePicker]="true"
  placeholder="Select a date and time range"
/>`;

  readonly snippetResult = `// DateRangeResult with time fields:
{
  start: Date,       // date + startTime merged
  end: Date,         // date + endTime merged
  startTime: { hours: number; minutes: number },
  endTime:   { hours: number; minutes: number }
}`;
}
