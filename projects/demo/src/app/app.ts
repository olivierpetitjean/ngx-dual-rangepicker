import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './shared/theme.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly theme = inject(ThemeService);

  readonly navItems: NavItem[] = [
    { path: '/basic',         label: 'Basic usage',        icon: 'calendar_month' },
    { path: '/reactive-form', label: 'Reactive forms',     icon: 'dynamic_form' },
    { path: '/presets',       label: 'Custom presets',     icon: 'date_range' },
    { path: '/month-year',    label: 'Month & Year',       icon: 'calendar_view_month' },
    { path: '/time',          label: 'Time picker',        icon: 'schedule' },
    { path: '/config',        label: 'API & Configuration',icon: 'tune' },
    { path: '/theming',       label: 'Theming',            icon: 'palette' },
    { path: '/i18n',          label: 'Internationalisation',icon: 'translate' },
    { path: '/playground',    label: 'Playground',         icon: 'play_circle' },
  ];
}
