import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import {
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
} from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker range selection cases', () => {
  it('clears old end and preview when selecting a new start date after completion', () => {
    const controller = createController({
      value: { end: '2024-04-24', start: '2024-04-20' },
    });
    controller.handleCellPointerEnter('2024-04-26');

    controller.selectDate('2024-04-28');

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-28');
    expect(range.end).toBeNull();
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });

  it('selects ranges across month, year, leap-day, and month-edge boundaries', () => {
    const controller = createController();

    controller.selectDate('2024-01-31');
    controller.selectDate('2024-02-02');
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-01-31');
    expect(dateKey(range.end as Date)).toBe('2024-02-02');

    controller.selectDate('2023-12-31');
    controller.selectDate('2024-01-01');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2023-12-31');
    expect(dateKey(range.end as Date)).toBe('2024-01-01');

    controller.selectDate('2024-02-28');
    controller.selectDate('2024-03-01');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-02-28');
    expect(dateKey(range.end as Date)).toBe('2024-03-01');
    expect(controller.getOutputs().cells.some((cell) => dateKey(cell.date) === '2024-02-29')).toBe(
      true,
    );

    controller.selectDate('2024-04-01');
    controller.selectDate('2024-04-30');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-01');
    expect(dateKey(range.end as Date)).toBe('2024-04-30');
  });

  it('supports reverse selection across month and year boundaries', () => {
    const controller = createController();

    controller.selectDate('2024-02-02');
    controller.selectDate('2024-01-31');
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-01-31');
    expect(dateKey(range.end as Date)).toBe('2024-02-02');

    controller.selectDate('2024-01-01');
    controller.selectDate('2023-12-31');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2023-12-31');
    expect(dateKey(range.end as Date)).toBe('2024-01-01');
  });

  it('preserves partial or completed ranges when disabled dates are clicked', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-23',
    });
    const events = collectEvents(controller);

    controller.selectDate('2024-04-23');
    expect(controller.getOutputs().value).toBeNull();

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-23');
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();

    controller.selectDate('2024-04-21');
    controller.selectDate('2024-04-23');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-21');

    const valueEvents = events.filter((event) => event.type === 'valueChange');
    expect(valueEvents).toHaveLength(2);
  });

  it('does not throw while selecting with popup closed and blocks selection while disabled', () => {
    const controller = createController();

    expect(() => controller.selectDate('2024-04-20')).not.toThrow();
    expect(controller.getOutputs().open).toBe(false);
    controller.setDisabled(true);
    controller.selectDate('2024-04-24');

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();
  });

  it('does not select dates outside min and max constraints', () => {
    const controller = createController({
      max: '2024-04-24',
      min: '2024-04-20',
    });

    controller.selectDate('2024-04-19');
    controller.selectDate('2024-04-25');
    expect(controller.getOutputs().value).toBeNull();

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-25');
    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();
  });
});
