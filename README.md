# ngx-dual-rangepicker

> Dual-calendar date range picker for Angular 20+ and Angular Material M3.

[![npm version](https://img.shields.io/npm/v/ngx-dual-rangepicker.svg)](https://www.npmjs.com/package/ngx-dual-rangepicker)
[![license](https://img.shields.io/npm/l/ngx-dual-rangepicker.svg)](LICENSE)

---

## Features

- **Two calendar panels** side-by-side (or stacked) with independent navigation
- **Day / Month / Year** selection modes — switchable or locked
- **Built-in presets** (Today, This week, Last month, This quarter, …)
- **Optional time picker** for start and end time
- **Smart overlay positioning** — auto-fits to the viewport or use a forced position
- **Hover preview** highlights the candidate range as the user moves the cursor
- **Fully accessible** — focus trap, `role="grid"`, `aria-selected`, keyboard navigation
- **Angular Material M3** — styled with M3 tokens, dark mode included
- **Responsive** — horizontal layout on wide viewports, vertical on narrow screens
- **Standalone components**, no NgModule required

---

## Installation

```bash
npm install ngx-dual-rangepicker
```

The library requires Angular Material and the CDK as peer dependencies:

```bash
npm install @angular/material @angular/cdk
```

---

## Quick Start

### 1 — Provide a date adapter

In your `app.config.ts`:

```typescript
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // …
    provideNativeDateAdapter(),
  ],
};
```

### 2 — Import and use the component

```typescript
import { NgxDualRangepickerComponent } from 'ngx-dual-rangepicker';
import { DateRange } from '@angular/material/datepicker';

@Component({
  standalone: true,
  imports: [NgxDualRangepickerComponent],
  template: `
    <ngx-dual-rangepicker
      [(selectedRange)]="range"
      (rangeSelected)="onRange($event)"
    />
  `,
})
export class MyComponent {
  range = signal<DateRange<Date> | null>(null);

  onRange(result: DateRangeResult) {
    console.log(result.start, result.end);
  }
}
```

---

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `selectedRange` | `DateRange<Date> \| null` | `null` | Current selected range (two-way bindable via `model`) |
| `min` | `Date \| null` | `null` | Minimum selectable date |
| `max` | `Date \| null` | `null` | Maximum selectable date |
| `presets` | `DateRangePreset[]` | built-in 9 | Preset list shown in the sidebar |
| `showPresets` | `boolean` | `true` | Show / hide the preset sidebar |
| `showModeSelector` | `boolean` | `true` | Show / hide the day/month/year toggle |
| `selectionMode` | `'date' \| 'month' \| 'year'` | `'date'` | Default active mode |
| `lockedMode` | `SelectionMode \| null` | `null` | Force a mode and hide the selector |
| `enableTimePicker` | `boolean` | `false` | Enable start/end time inputs |
| `layout` | `'auto' \| 'horizontal' \| 'vertical'` | `'auto'` | Panel layout |
| `position` | `PickerPosition` | `'auto'` | Overlay position (see below) |

### `position` values

| Value | Behaviour |
|---|---|
| `'auto'` | Tries `bottom-start`, `bottom-end`, `top-start`, `top-end` — picks the first one that fits |
| `'bottom-start'` | Below the trigger, aligned left |
| `'bottom-end'` | Below the trigger, aligned right |
| `'top-start'` | Above the trigger, aligned left |
| `'top-end'` | Above the trigger, aligned right |

---

## Outputs

| Output | Type | Description |
|---|---|---|
| `rangeSelected` | `DateRangeResult` | Emitted when the user clicks **Apply** |
| `cancelled` | `void` | Emitted when the user clicks **Cancel** |

### `DateRangeResult`

```typescript
interface DateRangeResult {
  start: Date;
  end: Date;
  startTime?: TimeValue;  // only when enableTimePicker = true
  endTime?: TimeValue;    // only when enableTimePicker = true
  preset?: string;        // label of the active preset, if any
}
```

---

## Custom presets

```typescript
import { DateRangePreset } from 'ngx-dual-rangepicker';
import { DateRange } from '@angular/material/datepicker';

const myPresets: DateRangePreset[] = [
  {
    label: 'Last 7 days',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return new DateRange(start, end);
    },
  },
];
```

```html
<ngx-dual-rangepicker [presets]="myPresets" />
```

---

## Internationalisation

Override any label by providing `DUAL_CALENDAR_INTL`:

```typescript
import { DUAL_CALENDAR_INTL, DualCalendarIntl } from 'ngx-dual-rangepicker';

const myIntl: DualCalendarIntl = {
  applyLabel: 'Valider',
  cancelLabel: 'Annuler',
  daysLabel: 'Jours',
  monthsLabel: 'Mois',
  yearsLabel: 'Années',
  startTimeLabel: 'Heure de début',
  endTimeLabel: 'Heure de fin',
};

// in providers:
{ provide: DUAL_CALENDAR_INTL, useValue: myIntl }
```

---

## CSS customisation

The component is styled with Angular Material M3 system tokens. You can also override the following custom properties:

| Property | Default | Description |
|---|---|---|
| `--drp-panel-border-radius` | `12px` | Panel corner radius |
| `--drp-panel-padding` | `16px` | Inner padding of the main area |
| `--drp-preset-width` | `168px` | Width of the preset sidebar |
| `--drp-calendar-gap` | `16px` | Gap between the two calendar panels |

---

## Peer dependencies

| Package | Version |
|---|---|
| `@angular/core` | `^20.0.0` |
| `@angular/common` | `^20.0.0` |
| `@angular/forms` | `^20.0.0` |
| `@angular/cdk` | `^20.0.0` |
| `@angular/material` | `^20.0.0` |

---

## License

[MIT](LICENSE) © Olivier Petitjean
