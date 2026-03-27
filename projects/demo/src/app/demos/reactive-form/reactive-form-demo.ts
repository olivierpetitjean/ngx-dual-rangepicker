import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-reactive-form-demo',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    NgxDualRangepickerComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './reactive-form-demo.html',
})
export class ReactiveFormDemoComponent {
  readonly rangeControl = new FormControl<DateRangeResult | null>(null, Validators.required);

  toggleDisabled(): void {
    this.rangeControl.disabled
      ? this.rangeControl.enable()
      : this.rangeControl.disable();
  }

  reset(): void {
    this.rangeControl.reset();
  }

  readonly snippetHtml = `<ngx-dual-rangepicker [formControl]="rangeControl" />

<!-- Validation state -->
@if (rangeControl.invalid && rangeControl.touched) {
  <mat-error>A date range is required.</mat-error>
}`;

  readonly snippetTs = `import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';

rangeControl = new FormControl<DateRangeResult | null>(null, Validators.required);`;
}
