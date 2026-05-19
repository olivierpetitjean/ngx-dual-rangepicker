export interface CalendarDayRangeConstraints {
  min: number | null;
  max: number | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function normalizeCalendarDayConstraint(value: number | null | undefined): number | null {
  if (typeof value !== 'number') return null;
  if (!Number.isSafeInteger(value)) return null;
  return value > 0 ? value : null;
}

export function calendarDaysInclusive(start: Date, end: Date): number {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.abs(Math.round((endUtc - startUtc) / MS_PER_DAY)) + 1;
}

export function isCalendarDayRangeValid(
  start: Date,
  end: Date,
  constraints: CalendarDayRangeConstraints,
): boolean {
  const days = calendarDaysInclusive(start, end);
  if (constraints.min !== null && days < constraints.min) return false;
  if (constraints.max !== null && days > constraints.max) return false;
  return true;
}
