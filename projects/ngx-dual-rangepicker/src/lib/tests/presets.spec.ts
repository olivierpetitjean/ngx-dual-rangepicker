import { DateRange } from '@angular/material/datepicker';
import { DEFAULT_PRESETS } from '../date-range-picker.presets';

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

describe('DEFAULT_PRESETS', () => {
  it('should contain 9 presets', () => {
    expect(DEFAULT_PRESETS.length).toBe(9);
  });

  describe('Today', () => {
    it('should return today → today', () => {
      const today = startOfDay(new Date());
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Today')!.range();
      expect(range.start).toEqual(today);
      expect(range.end).toEqual(today);
    });
  });

  describe('Yesterday', () => {
    it('should return yesterday → yesterday', () => {
      const yesterday = startOfDay(new Date());
      yesterday.setDate(yesterday.getDate() - 1);
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Yesterday')!.range();
      expect(range.start).toEqual(yesterday);
      expect(range.end).toEqual(yesterday);
    });
  });

  describe('Last 7 days', () => {
    it('should span 7 days ending today', () => {
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Last 7 days')!.range();
      const today = startOfDay(new Date());
      const sixDaysAgo = startOfDay(new Date());
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
      expect(range.start).toEqual(sixDaysAgo);
      expect(range.end).toEqual(today);
    });
  });

  describe('Last 30 days', () => {
    it('should span 30 days ending today', () => {
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Last 30 days')!.range();
      const today = startOfDay(new Date());
      const twentyNineDaysAgo = startOfDay(new Date());
      twentyNineDaysAgo.setDate(twentyNineDaysAgo.getDate() - 29);
      expect(range.start).toEqual(twentyNineDaysAgo);
      expect(range.end).toEqual(today);
    });
  });

  describe('This month', () => {
    it('should cover the first to last day of the current month', () => {
      const now = new Date();
      const range = DEFAULT_PRESETS.find((p) => p.label === 'This month')!.range();
      const expectedStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const expectedEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      expect(range.start).toEqual(expectedStart);
      expect(range.end).toEqual(expectedEnd);
    });
  });

  describe('Last month', () => {
    it('should cover the first to last day of the previous month', () => {
      const now = new Date();
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Last month')!.range();
      const expectedStart = new Date(year, month, 1);
      const expectedEnd = new Date(year, month + 1, 0);
      expect(range.start).toEqual(expectedStart);
      expect(range.end).toEqual(expectedEnd);
    });
  });

  describe('This quarter', () => {
    it('should start on the first day of the current quarter', () => {
      const now = new Date();
      const quarterStartMonth = now.getMonth() - (now.getMonth() % 3);
      const range = DEFAULT_PRESETS.find((p) => p.label === 'This quarter')!.range();
      expect(range.start!.getMonth()).toBe(quarterStartMonth);
      expect(range.start!.getDate()).toBe(1);
    });

    it('should end on the last day of the current quarter', () => {
      const now = new Date();
      const quarterEndMonth = now.getMonth() - (now.getMonth() % 3) + 2;
      const range = DEFAULT_PRESETS.find((p) => p.label === 'This quarter')!.range();
      expect(range.end!.getMonth()).toBe(quarterEndMonth);
    });
  });

  describe('This year', () => {
    it('should cover Jan 1 to Dec 31 of the current year', () => {
      const year = new Date().getFullYear();
      const range = DEFAULT_PRESETS.find((p) => p.label === 'This year')!.range();
      expect(range.start).toEqual(new Date(year, 0, 1));
      expect(range.end).toEqual(new Date(year, 11, 31));
    });
  });

  describe('Last year', () => {
    it('should cover Jan 1 to Dec 31 of the previous year', () => {
      const year = new Date().getFullYear() - 1;
      const range = DEFAULT_PRESETS.find((p) => p.label === 'Last year')!.range();
      expect(range.start).toEqual(new Date(year, 0, 1));
      expect(range.end).toEqual(new Date(year, 11, 31));
    });
  });

  it('should recalculate dynamically on each call', () => {
    const preset = DEFAULT_PRESETS.find((p) => p.label === 'Today')!;
    const range1 = preset.range();
    const range2 = preset.range();
    // Different Date instances but equal values
    expect(range1.start).not.toBe(range2.start);
    expect(range1.start).toEqual(range2.start);
  });
});
