import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-month-year-demo',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './month-year-demo.html',
})
export class MonthYearDemoComponent {
  monthResult: DateRangeResult | null = null;
  yearResult: DateRangeResult | null = null;

  readonly snippetMonth = `<ngx-dual-rangepicker
  selectionMode="month"
  placeholder="Select months"
/>`;

  readonly snippetYear = `<ngx-dual-rangepicker
  selectionMode="year"
  placeholder="Select years"
/>`;
}
