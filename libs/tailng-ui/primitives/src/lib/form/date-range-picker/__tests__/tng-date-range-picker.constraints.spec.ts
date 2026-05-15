import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import { cleanupDom, createController, dateKey } from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker constraints', () => {
  it('disables dates before min and after max while allowing the boundary dates', () => {
    const controller = createController({
      max: '2024-04-24',
      min: '2024-04-20',
    });

    const cells = controller.getOutputs().cells;
    const day19 = cells.find((cell) => dateKey(cell.date) === '2024-04-19');
    const day20 = cells.find((cell) => dateKey(cell.date) === '2024-04-20');
    const day24 = cells.find((cell) => dateKey(cell.date) === '2024-04-24');
    const day25 = cells.find((cell) => dateKey(cell.date) === '2024-04-25');

    expect(day19?.disabled).toBe(true);
    expect(day20?.disabled).toBe(false);
    expect(day24?.disabled).toBe(false);
    expect(day25?.disabled).toBe(true);
  });

  it('ignores disabled dates as start and end selections', () => {
    const controller = createController({
      disableDate: (date) => date.getDate() === 22,
    });

    controller.selectDate('2024-04-22');
    expect(controller.getOutputs().startDate).toBeNull();

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-22');

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();
  });

  it('allows a range to span disabled dates while still blocking disabled endpoints', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-22',
    });

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-24');

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-22');

    const partialRange = asRange(controller.getOutputs().value);
    expect(dateKey(partialRange.start as Date)).toBe('2024-04-20');
    expect(partialRange.end).toBeNull();
  });

  it('respects min and max for selection and preview', () => {
    const controller = createController({
      max: '2024-04-24',
      min: '2024-04-20',
    });

    controller.selectDate('2024-04-19');
    expect(controller.getOutputs().startDate).toBeNull();

    controller.selectDate('2024-04-20');
    controller.handleCellPointerEnter('2024-04-25');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.selectDate('2024-04-24');
    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
  });

  it('combines min, max, and custom disabled callbacks', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-22',
      max: '2024-04-24',
      min: '2024-04-20',
    });

    const cells = controller.getOutputs().cells;
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-19')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-20')?.disabled).toBe(false);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-22')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-24')?.disabled).toBe(false);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-25')?.disabled).toBe(true);
  });

  it('handles min and max across months, years, and same-day boundaries', () => {
    const controller = createController({
      max: '2025-01-02',
      min: '2023-12-31',
    });

    controller.selectDate('2023-12-31');
    controller.selectDate('2025-01-02');

    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2023-12-31');
    expect(dateKey(range.end as Date)).toBe('2025-01-02');

    const singleDay = createController({
      max: '2024-04-20',
      min: '2024-04-20',
      value: null,
    });
    singleDay.selectDate('2024-04-20');
    singleDay.selectDate('2024-04-20');

    range = asRange(singleDay.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-20');
  });

  it('handles invalid min greater than max by disabling constrained selections gracefully', () => {
    const controller = createController({
      max: '2024-04-20',
      min: '2024-04-24',
    });

    expect(() => controller.selectDate('2024-04-22')).not.toThrow();
    expect(controller.getOutputs().value).toBeNull();
  });

  it('updates disabled states when constraints or disabledDate callback changes', () => {
    const controller = createController({
      max: '2024-04-24',
      min: '2024-04-20',
    });

    expect(controller.getOutputs().cells.find((cell) => dateKey(cell.date) === '2024-04-19')?.disabled).toBe(
      true,
    );

    controller.setConfig({
      disableDate: (date) => dateKey(date) === '2024-04-22',
      max: '2024-04-26',
      min: '2024-04-18',
    });

    const cells = controller.getOutputs().cells;
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-19')?.disabled).toBe(false);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-22')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-25')?.disabled).toBe(false);
  });

  it('surfaces disabledDate callback errors consistently', () => {
    expect(() =>
      createController({
        disableDate: () => {
          throw new Error('disabled-date failed');
        },
      }),
    ).toThrow('disabled-date failed');
  });
});
