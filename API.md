# ngx-dual-rangepicker — API Reference

> Complete API reference for `NgxDualRangepickerComponent`.
> For installation and quick start, see [README.md](README.md).

---

## Table of contents

- [Component selector](#component-selector)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Value binding (ngModel / reactive forms)](#value-binding)
- [Types](#types)
  - [DateRangeResult](#daterangeresult)
  - [DateRangePreset](#daterangepreset)
  - [SelectionMode](#selectionmode)
  - [PickerPosition](#pickerposition)
  - [DualCalendarIntl](#dualcalendarintl)
- [Injection tokens](#injection-tokens)
  - [DUAL_CALENDAR_INTL](#dual_calendar_intl)
- [Built-in presets](#built-in-presets)
- [CSS custom properties](#css-custom-properties)
- [Recipes](#recipes)
  - [Default value](#default-value)
  - [Reactive form with validation](#reactive-form-with-validation)
  - [Locked mode](#locked-mode)
  - [Custom presets](#custom-presets)
  - [French labels](#french-labels)
  - [Forced overlay position](#forced-overlay-position)
  - [With time picker](#with-time-picker)

---

## Component selector

```html
<ngx-dual-rangepicker />
```

Import:

```typescript
import { NgxDualRangepickerComponent } from 'ngx-dual-rangepicker';
```

---

## Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `selectionMode` | `SelectionMode` | `'date'` | Active granularity when the picker opens. Ignored if `lockedMode` is set. |
| `lockedMode` | `SelectionMode \| null` | `null` | Forces a specific granularity and hides the mode selector entirely. |
| `enableTimePicker` | `boolean` | `false` | Adds start/end time inputs to the panel. |
| `presets` | `DateRangePreset[]` | 9 built-in presets | Preset shortcuts shown in the sidebar. Pass `[]` to show none. |
| `showPresets` | `boolean` | `true` | Shows or hides the preset sidebar. |
| `showModeSelector` | `boolean` | `true` | Shows or hides the day/month/year toggle. Has no effect when `lockedMode` is set. |
| `min` | `Date \| null` | `null` | Minimum selectable date. Dates before this value are disabled. |
| `max` | `Date \| null` | `null` | Maximum selectable date. Dates after this value are disabled. |
| `dateFormat` | `string` | `'mediumDate'` | Angular `DatePipe` format string used in the trigger field display. |
| `placeholder` | `string` | `'Select a date range'` | Placeholder text shown in the trigger field when no range is selected. |
| `disabled` | `boolean` | `false` | Disables the trigger field and prevents the overlay from opening. |
| `required` | `boolean` | `false` | Marks the field as required (used with Angular forms). |
| `layout` | `'auto' \| 'horizontal' \| 'vertical'` | `'auto'` | Panel layout. `'auto'` switches to vertical below 768 px. |
| `position` | `PickerPosition` | `'auto'` | Overlay placement relative to the trigger field. |

---

## Outputs

| Output | Type | Description |
|---|---|---|
| `rangeChanged` | `EventEmitter<DateRangeResult>` | Emitted when the user clicks **Apply**. |
| `opened` | `EventEmitter<void>` | Emitted when the overlay opens. |
| `closed` | `EventEmitter<void>` | Emitted when the overlay closes (Apply, Cancel, Escape, or backdrop click). |

> **Note:** `rangeChanged` is emitted in addition to the form control `valueChanges`. If you are using `ngModel` or `formControl`, listening to `rangeChanged` is optional — the form value is updated automatically.

---

## Value binding

The component implements `ControlValueAccessor`. The value type is `DateRangeResult | null`.

### Template-driven form

```typescript
import { FormsModule } from '@angular/forms';
import { DateRangeResult } from 'ngx-dual-rangepicker';

range: DateRangeResult | null = null;
```

```html
<ngx-dual-rangepicker [(ngModel)]="range" />
```

### Reactive form

```typescript
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateRangeResult } from 'ngx-dual-rangepicker';

rangeControl = new FormControl<DateRangeResult | null>(null);
```

```html
<ngx-dual-rangepicker [formControl]="rangeControl" />
```

### Setting a default value

Pass a `DateRangeResult` object as the initial value:

```typescript
range: DateRangeResult = {
  start: new Date('2024-01-01'),
  end:   new Date('2024-01-31'),
};
```

```html
<ngx-dual-rangepicker [(ngModel)]="range" />
```

With reactive forms:

```typescript
rangeControl = new FormControl<DateRangeResult | null>({
  start: new Date('2024-01-01'),
  end:   new Date('2024-01-31'),
});
```

### Reading the value

```typescript
// From ngModel binding — read directly
console.log(this.range?.start, this.range?.end);

// From reactive form
this.rangeControl.valueChanges.subscribe(v => console.log(v));

// From output event
onRange(result: DateRangeResult) {
  console.log(result.start, result.end);
  if (result.startTime) console.log(result.startTime.hours, result.startTime.minutes);
}
```

### Clearing the value programmatically

```typescript
// ngModel
this.range = null;

// Reactive form
this.rangeControl.setValue(null);
```

---

## Types

### DateRangeResult

Value type exchanged with Angular forms and emitted by `rangeChanged`.

```typescript
interface DateRangeResult {
  start: Date;
  end: Date;

  // Present only when enableTimePicker = true
  startTime?: { hours: number; minutes: number };
  endTime?:   { hours: number; minutes: number };

  // Label of the selected preset, if any
  preset?: string;
}
```

> **Important:** `start` and `end` are plain `Date` objects (midnight local time unless the time picker is enabled). `startTime` / `endTime` are separate objects — the time is **not** merged into the `Date`.

### DateRangePreset

```typescript
interface DateRangePreset {
  label: string;
  range: () => DateRange<Date>; // called each time the preset is selected
}
```

The `range` function is evaluated lazily — every time the user clicks the preset. This ensures relative ranges like "Last 7 days" are always computed from today, not from the time the preset was defined.

### SelectionMode

```typescript
type SelectionMode = 'date' | 'month' | 'year';
```

| Value | Behaviour |
|---|---|
| `'date'` | Day-level selection, full calendar grid |
| `'month'` | Month-level selection, month grid |
| `'year'` | Year-level selection, year grid |

### PickerPosition

```typescript
type PickerPosition = 'auto' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
```

| Value | Behaviour |
|---|---|
| `'auto'` | Tries all four positions in order and uses the first one that fits in the viewport |
| `'bottom-start'` | Below the trigger, left-aligned |
| `'bottom-end'` | Below the trigger, right-aligned |
| `'top-start'` | Above the trigger, left-aligned |
| `'top-end'` | Above the trigger, right-aligned |

When a forced position does not fit, the overlay is pushed to stay within the viewport (8 px margin).

### DualCalendarIntl

All UI labels. Override via the `DUAL_CALENDAR_INTL` injection token.

```typescript
interface DualCalendarIntl {
  applyLabel:      string; // Default: 'Apply'
  cancelLabel:     string; // Default: 'Cancel'
  daysLabel:       string; // Default: 'Days'
  monthsLabel:     string; // Default: 'Months'
  yearsLabel:      string; // Default: 'Years'
  timeLabel:       string; // Default: 'Time'
  startTimeLabel:  string; // Default: 'Start'
  endTimeLabel:    string; // Default: 'End'
}
```

---

## Injection tokens

### DUAL_CALENDAR_INTL

```typescript
import { DUAL_CALENDAR_INTL } from 'ngx-dual-rangepicker';
```

Provide a partial or full `DualCalendarIntl` object to override labels:

```typescript
providers: [
  {
    provide: DUAL_CALENDAR_INTL,
    useValue: {
      applyLabel:     'Valider',
      cancelLabel:    'Annuler',
      daysLabel:      'Jours',
      monthsLabel:    'Mois',
      yearsLabel:     'Années',
      timeLabel:      'Heure',
      startTimeLabel: 'Début',
      endTimeLabel:   'Fin',
    },
  },
]
```

---

## Built-in presets

The `DEFAULT_PRESETS` export contains 9 presets, all computing dates relative to today:

| Label | Range |
|---|---|
| Today | Today → Today |
| Yesterday | Yesterday → Yesterday |
| Last 7 days | 6 days ago → Today |
| Last 30 days | 29 days ago → Today |
| This month | 1st of current month → last day of current month |
| Last month | 1st of previous month → last day of previous month |
| This quarter | 1st day of current quarter → last day of current quarter |
| This year | Jan 1 → Dec 31 of current year |
| Last year | Jan 1 → Dec 31 of previous year |

To extend the built-in list:

```typescript
import { DEFAULT_PRESETS, DateRangePreset } from 'ngx-dual-rangepicker';
import { DateRange } from '@angular/material/datepicker';

const myPresets: DateRangePreset[] = [
  ...DEFAULT_PRESETS,
  {
    label: 'Last 90 days',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 89);
      return new DateRange(start, end);
    },
  },
];
```

---

## CSS custom properties

The component exposes CSS custom properties for layout customisation. Apply them on the host element or any ancestor.

| Property | Default | Description |
|---|---|---|
| `--drp-panel-border-radius` | `12px` | Corner radius of the overlay panel |
| `--drp-panel-padding` | `16px` | Inner padding of the main area |
| `--drp-preset-width` | `168px` | Width of the preset sidebar |
| `--drp-calendar-gap` | `16px` | Gap between the two calendar panels |

Example:

```css
ngx-dual-rangepicker {
  --drp-preset-width: 200px;
  --drp-panel-border-radius: 8px;
}
```

The component follows the Angular Material M3 colour system — it automatically adapts to your theme's primary palette and to light/dark mode.

---

## Recipes

### Default value

```typescript
// Simple object literal — no DateRange<Date> needed
range: DateRangeResult = {
  start: new Date('2024-01-01'),
  end:   new Date('2024-12-31'),
};
```

```html
<ngx-dual-rangepicker [(ngModel)]="range" />
```

---

### Reactive form with validation

```typescript
import { FormControl, Validators } from '@angular/forms';
import { DateRangeResult } from 'ngx-dual-rangepicker';

rangeControl = new FormControl<DateRangeResult | null>(null, Validators.required);
```

```html
<ngx-dual-rangepicker [formControl]="rangeControl" [required]="true" />
<mat-error *ngIf="rangeControl.invalid">A date range is required.</mat-error>
```

---

### Locked mode

Force month-level selection and hide the mode selector:

```html
<ngx-dual-rangepicker [lockedMode]="'month'" />
```

---

### Custom presets

Replace the default presets entirely:

```typescript
import { DateRangePreset } from 'ngx-dual-rangepicker';
import { DateRange } from '@angular/material/datepicker';

presets: DateRangePreset[] = [
  {
    label: 'Last 7 days',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return new DateRange(start, end);
    },
  },
  {
    label: 'Last 30 days',
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 29);
      return new DateRange(start, end);
    },
  },
];
```

```html
<ngx-dual-rangepicker [presets]="presets" />
```

Hide presets entirely:

```html
<ngx-dual-rangepicker [showPresets]="false" />
```

---

### French labels

```typescript
import { DUAL_CALENDAR_INTL } from 'ngx-dual-rangepicker';

// app.config.ts
providers: [
  {
    provide: DUAL_CALENDAR_INTL,
    useValue: {
      applyLabel:     'Appliquer',
      cancelLabel:    'Annuler',
      daysLabel:      'Jours',
      monthsLabel:    'Mois',
      yearsLabel:     'Années',
      timeLabel:      'Heure',
      startTimeLabel: 'Début',
      endTimeLabel:   'Fin',
    },
  },
]
```

---

### Forced overlay position

Place the panel above the field, right-aligned (useful when the field is at the bottom of the page):

```html
<ngx-dual-rangepicker position="top-end" />
```

---

### With time picker

```typescript
result: DateRangeResult | null = null;

onRange(r: DateRangeResult) {
  // r.startTime?.hours, r.startTime?.minutes
  // r.endTime?.hours,   r.endTime?.minutes
  this.result = r;
}
```

```html
<ngx-dual-rangepicker
  [enableTimePicker]="true"
  (rangeChanged)="onRange($event)"
/>
```

> `startTime` and `endTime` are only present in the result when `enableTimePicker` is `true`. They are **not** merged into the `start`/`end` Date objects — handle them separately.
