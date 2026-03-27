import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgxDualRangepickerComponent,
  DateRangeResult,
  DUAL_CALENDAR_INTL,
  DualCalendarIntl,
} from 'ngx-dual-rangepicker';
import { CodeSnippetComponent } from '../../shared/code-snippet';

@Component({
  selector: 'app-i18n-demo',
  standalone: true,
  imports: [FormsModule, NgxDualRangepickerComponent, CodeSnippetComponent],
  templateUrl: './i18n-demo.html',
  // Override the INTL token for the whole component subtree (including the overlay)
  providers: [
    {
      provide: DUAL_CALENDAR_INTL,
      useValue: {
        applyLabel: 'Appliquer',
        cancelLabel: 'Annuler',
        daysLabel: 'Jours',
        monthsLabel: 'Mois',
        yearsLabel: 'Années',
        timeLabel: 'Heure',
        startTimeLabel: 'Début',
        endTimeLabel: 'Fin',
      } satisfies DualCalendarIntl,
    },
  ],
})
export class I18nDemoComponent {
  result: DateRangeResult | null = null;

  readonly snippetToken = `import { DUAL_CALENDAR_INTL, DualCalendarIntl } from 'ngx-dual-rangepicker';

// In your AppConfig or component providers:
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
  } satisfies DualCalendarIntl,
}`;

  readonly snippetDateLocale = `import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

// In ApplicationConfig providers:
{ provide: LOCALE_ID,       useValue: 'fr-FR' },
{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },`;
}
