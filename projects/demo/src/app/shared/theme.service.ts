import { effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Palette = 'azure' | 'rose' | 'violet' | 'cyan' | 'green' | 'orange';

export const PALETTES: { id: Palette; label: string; color: string }[] = [
  { id: 'azure',  label: 'Azure',  color: '#0070f3' },
  { id: 'rose',   label: 'Rose',   color: '#e11d48' },
  { id: 'violet', label: 'Violet', color: '#7c3aed' },
  { id: 'cyan',   label: 'Cyan',   color: '#0891b2' },
  { id: 'green',  label: 'Green',  color: '#16a34a' },
  { id: 'orange', label: 'Orange', color: '#ea580c' },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);

  readonly darkMode = signal(false);
  readonly palette = signal<Palette>('azure');

  constructor() {
    effect(() => {
      const html = this.doc.documentElement;

      // dark / light
      html.classList.toggle('dark', this.darkMode());

      // palette — remove all theme-* classes then add the current one
      PALETTES.forEach(p => html.classList.remove(`theme-${p.id}`));
      if (this.palette() !== 'azure') {
        html.classList.add(`theme-${this.palette()}`);
      }
    });
  }

  toggleDarkMode(): void {
    this.darkMode.update(v => !v);
  }

  setPalette(p: Palette): void {
    this.palette.set(p);
  }
}
