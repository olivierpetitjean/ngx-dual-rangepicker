import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'basic', pathMatch: 'full' },
  {
    path: 'basic',
    loadComponent: () => import('./demos/basic/basic-demo').then(m => m.BasicDemoComponent),
  },
  {
    path: 'reactive-form',
    loadComponent: () =>
      import('./demos/reactive-form/reactive-form-demo').then(m => m.ReactiveFormDemoComponent),
  },
  {
    path: 'presets',
    loadComponent: () => import('./demos/presets/presets-demo').then(m => m.PresetsDemoComponent),
  },
  {
    path: 'month-year',
    loadComponent: () =>
      import('./demos/month-year/month-year-demo').then(m => m.MonthYearDemoComponent),
  },
  {
    path: 'time',
    loadComponent: () => import('./demos/time/time-demo').then(m => m.TimeDemoComponent),
  },
  {
    path: 'config',
    loadComponent: () => import('./demos/config/config-demo').then(m => m.ConfigDemoComponent),
  },
  {
    path: 'theming',
    loadComponent: () => import('./demos/theming/theming-demo').then(m => m.ThemingDemoComponent),
  },
  {
    path: 'i18n',
    loadComponent: () => import('./demos/i18n/i18n-demo').then(m => m.I18nDemoComponent),
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./demos/playground/playground-demo').then(m => m.PlaygroundDemoComponent),
  },
];
