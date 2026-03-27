import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-theming-demo',
  standalone: true,
  imports: [FormsModule, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './theming-demo.html',
  styleUrl: './theming-demo.scss',
})
export class ThemingDemoComponent {
  resultDefault: DateRangeResult | null = null;
  resultRounded: DateRangeResult | null = null;
  resultCompact: DateRangeResult | null = null;

  readonly snippetTheme = `// styles.scss — global Material M3 theme
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$blue-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}`;

  readonly snippetCssVars = `/* Override CSS custom properties per instance */
.my-picker {
  --drp-panel-border-radius: 24px;   /* rounder panel */
  --drp-preset-width: 200px;         /* wider sidebar */
  --drp-calendar-gap: 24px;          /* more space between calendars */
  --drp-preset-active-bg: var(--mat-sys-tertiary-container);
  --drp-preset-active-color: var(--mat-sys-on-tertiary-container);
}`;

  readonly snippetScss = `// In your component SCSS — use the theme() mixin for full control
@use 'ngx-dual-rangepicker' as drp;

:host {
  @include drp.theme($your-theme);
  @include drp.color($your-dark-theme);
}`;
}
