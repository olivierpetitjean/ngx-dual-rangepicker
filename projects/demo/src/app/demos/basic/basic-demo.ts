import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-basic-demo',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './basic-demo.html',
})
export class BasicDemoComponent {
  result: DateRangeResult | null = null;

  readonly snippetHtml = `<ngx-dual-rangepicker
  placeholder="Select a date range"
  [(ngModel)]="result"
/>`;

  readonly snippetTs = `import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { FormsModule } from '@angular/forms';

// In your component:
result: DateRangeResult | null = null;`;
}
