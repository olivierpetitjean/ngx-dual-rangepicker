import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Custom header for each mat-calendar in the dual picker.
 * Displays the current month/year and exposes prev/next navigation.
 * Navigation is coordinated externally by DualCalendarPanelComponent
 * via the shared leftMonth signal — this header only triggers the action.
 */
@Component({
  selector: 'ngx-dual-calendar-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dual-calendar-header.component.html',
  styleUrl: './dual-calendar-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DualCalendarHeaderComponent<D> implements OnDestroy {
  private readonly calendar = inject<MatCalendar<D>>(MatCalendar);
  private readonly dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyed = new Subject<void>();

  constructor() {
    this.calendar.stateChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  get periodLabel(): string {
    return this.dateAdapter
      .format(this.calendar.activeDate, { year: 'numeric', month: 'long' } as any)
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  previousClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      -1,
    );
    // Notify the panel to sync the sibling calendar
    this.calendar.activeDate = this.calendar.activeDate;
  }

  nextClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(
      this.calendar.activeDate,
      1,
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
