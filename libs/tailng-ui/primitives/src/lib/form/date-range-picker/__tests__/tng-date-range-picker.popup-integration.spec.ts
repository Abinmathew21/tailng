import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import { cleanupDom, createController, dateKey } from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker popup integration', () => {
  it('keeps the popup open after start selection and closes after completing the range', () => {
    const controller = createController({
      closeOnSelect: true,
      defaultOpen: true,
    });

    controller.selectDate('2024-04-20');
    expect(controller.getOutputs().open).toBe(true);

    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().open).toBe(false);
    expect(controller.getState().lastCloseReason).toBe('select');
  });

  it('preserves selected range while closing and reopening', () => {
    const controller = createController({
      defaultOpen: true,
    });

    controller.selectDate('2024-04-20');
    controller.selectDate('2024-04-24');
    controller.close();
    controller.open();

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
    expect(controller.getOutputs().open).toBe(true);
  });

  it('closes other open date range pickers when configured', () => {
    const first = createController({
      closeOthersOnOpen: true,
    });
    const second = createController({
      closeOthersOnOpen: true,
    });

    first.open();
    second.open();

    expect(first.getOutputs().open).toBe(false);
    expect(second.getOutputs().open).toBe(true);
  });
});
