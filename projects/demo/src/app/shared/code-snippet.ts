import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="snippet">
      @if (label()) {
        <div class="snippet-label">{{ label() }}</div>
      }
      <div class="snippet-body">
        <button
          mat-icon-button
          class="snippet-copy-btn"
          [matTooltip]="copied() ? 'Copied!' : 'Copy'"
          (click)="copy()"
        >
          <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
        </button>
        <pre class="snippet-code">{{ code() }}</pre>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .snippet { margin-bottom: 12px; }

    .snippet-label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--mat-sys-on-surface-variant);
      padding: 0 4px 6px;
    }

    .snippet-body {
      position: relative;
      background: var(--mat-sys-surface-variant);
      border-radius: 8px;
      overflow: hidden;
    }

    .snippet-copy-btn {
      position: absolute !important;
      top: 6px;
      right: 6px;
      opacity: 0.6;
      transition: opacity 0.15s;
      &:hover { opacity: 1; }
    }

    .snippet-code {
      margin: 0;
      padding: 16px 52px 16px 16px;
      font-family: 'Roboto Mono', 'Fira Code', Consolas, monospace;
      font-size: 0.8125rem;
      line-height: 1.65;
      color: var(--mat-sys-on-surface-variant);
      overflow-x: auto;
      white-space: pre;
      tab-size: 2;
    }
  `],
})
export class CodeSnippetComponent {
  readonly code = input('');
  readonly label = input('');
  readonly copied = signal(false);

  copy(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
