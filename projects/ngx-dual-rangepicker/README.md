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
- **Opt-in mobile overlay** — fullscreen, side panel, or bottom sheet on small screens
- **Internal animation control** — slide-in mobile panels, with an option to disable library animations
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
import { FormsModule } from '@angular/forms';
import { NgxDualRangepickerComponent, DateRangeResult } from 'ngx-dual-rangepicker';

@Component({
  standalone: true,
  imports: [NgxDualRangepickerComponent, FormsModule],
  template: `
    <ngx-dual-rangepicker
      [(ngModel)]="range"
      (rangeChanged)="onRange($event)"
    />
  `,
})
export class MyComponent {
  range: DateRangeResult | null = null;

  onRange(result: DateRangeResult) {
    console.log(result.start, result.end);
  }
}
```

---

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `selectionMode` | `'date' \| 'month' \| 'year'` | `'date'` | Default active mode |
| `lockedMode` | `SelectionMode \| null` | `null` | Force a mode and hide the selector |
| `enableTimePicker` | `boolean` | `false` | Enable start/end time inputs |
| `presets` | `DateRangePreset[]` | built-in 9 | Preset list shown in the sidebar |
| `min` | `Date \| null` | `null` | Minimum selectable date |
| `max` | `Date \| null` | `null` | Maximum selectable date |
| `minCalendarDays` | `number \| null` | `null` | Minimum inclusive calendar days in a selected range |
| `maxCalendarDays` | `number \| null` | `null` | Maximum inclusive calendar days in a selected range |
| `dateFormat` | `string` | `'mediumDate'` | Angular date format used in the trigger display |
| `placeholder` | `string` | `'Select a date range'` | Text shown when no range is selected |
| `disabled` | `boolean` | `false` | Disable the component; CVA compatible |
| `required` | `boolean` | `false` | Mark the trigger as required |
| `showModeSelector` | `boolean` | `true` | Show / hide the day/month/year toggle |
| `showPresets` | `boolean` | `true` | Show / hide the preset sidebar |
| `layout` | `'auto' \| 'horizontal' \| 'vertical'` | `'auto'` | Panel layout |
| `position` | `PickerPosition` | `'auto'` | Overlay position (see below) |
| `enableMobile` | `boolean` | `false` | Enable the mobile overlay automatically below 768 px |
| `mobilePanelPosition` | `MobilePanelPosition` | `'fullscreen'` | Mobile panel placement |
| `disableAnimations` | `boolean` | `false` | Disable library-owned animations and transitions |

### `position` values

| Value | Behaviour |
|---|---|
| `'auto'` | Tries `bottom-start`, `bottom-end`, `top-start`, `top-end` — picks the first one that fits |
| `'bottom-start'` | Below the trigger, aligned left |
| `'bottom-end'` | Below the trigger, aligned right |
| `'top-start'` | Above the trigger, aligned left |
| `'top-end'` | Above the trigger, aligned right |

### Mobile overlay

`enableMobile` does not force mobile mode permanently. It allows the component to switch when the viewport is narrow:

```text
mobile mode = enableMobile && viewport width <= 767px
```

| `mobilePanelPosition` value | Behaviour |
|---|---|
| `'fullscreen'` | Covers the viewport |
| `'left'` | Opens as a left side panel |
| `'right'` | Opens as a right side panel |
| `'bottom'` | Opens as a bottom sheet |

`disableAnimations` only disables animations and transitions owned by this library. Angular Material animations still follow the application's Angular Material configuration.

### Calendar day constraints

`minCalendarDays` and `maxCalendarDays` constrain the number of inclusive calendar days in the selected range:

```text
Jan 1 -> Jan 1 = 1 calendar day
Jan 1 -> Jan 2 = 2 calendar days
```

These constraints are ignored when `enableTimePicker` is `true`. Use duration-based constraints for time-aware ranges if they are added later.

Invalid values (`0`, negative, decimals, `NaN`, `Infinity`) are ignored. If `minCalendarDays` is greater than `maxCalendarDays`, both constraints are ignored and a development warning is logged.

---

## Outputs

| Output | Type | Description |
|---|---|---|
| `rangeChanged` | `DateRangeResult` | Emitted when the user clicks **Apply** |
| `opened` | `void` | Emitted when the overlay opens |
| `closed` | `void` | Emitted when the overlay closes |

### `DateRangeResult`

```typescript
interface DateRangeResult {
  start: Date;
  end: Date;
  startTime?: { hours: number; minutes: number }; // only when enableTimePicker = true
  endTime?:   { hours: number; minutes: number }; // only when enableTimePicker = true
  preset?: string;                                // label of the active preset, if any
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

Presets outside the current `min` / `max` constraints remain visible but disabled, so users can understand why the shortcut is unavailable.

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
  timeLabel: 'Heure',
  startTimeLabel: 'Début',
  endTimeLabel: 'Fin',
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
| `--drp-mobile-panel-width` | `420px` | Width of left/right mobile panels |

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
