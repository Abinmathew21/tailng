import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import {
  cleanupDom,
  createController,
  createSlashInputAdapter,
  dateKey,
} from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker input value', () => {
  it('formats empty, partial, and complete range values', () => {
    const controller = createController();
    expect(controller.getOutputs().inputText).toBe('');

    controller.selectDate('2024-04-20');
    expect(controller.getOutputs().inputText).toBe('04-20-2024');

    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().inputText).toBe('04-20-2024 – 04-24-2024');
  });

  it('commits manual input as a partial range start', () => {
    const controller = createController();

    controller.setInputText('05-10-2024');
    expect(controller.commitInputText()).toBe(true);

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');
    expect(range.end).toBeNull();
  });

  it('rejects invalid manual input without changing the range', () => {
    const controller = createController({
      value: {
        end: null,
        start: '2024-04-20',
      },
    });

    controller.setInputText('not-a-date');
    expect(controller.commitInputText()).toBe(false);

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();
    expect(controller.getOutputs().validationError).toBe('invalid-input');
  });

  it('clears display value when value becomes null and does not show stale end dates', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });
    expect(controller.getOutputs().inputText).toBe('04-20-2024 – 04-24-2024');

    controller.selectDate('2024-04-28');
    expect(controller.getOutputs().inputText).toBe('04-28-2024');

    controller.setValue(null);
    expect(controller.getOutputs().inputText).toBe('');
  });

  it('uses configured adapter formatting and displays normalized range order', () => {
    const controller = createController({
      adapter: createSlashInputAdapter(),
      value: {
        end: '2024/04/20',
        start: '2024/04/24',
      },
    });

    expect(controller.getOutputs().inputText).toBe('2024/04/20 – 2024/04/24');
  });

  it('sets disabled trigger attributes and blocks popup opening from a disabled trigger', () => {
    const controller = createController({
      disabled: true,
    });

    const trigger = controller.getOutputs().getTriggerAttributes();
    expect(trigger['aria-disabled']).toBe('true');
    expect(trigger['data-disabled']).toBe('true');
    expect(trigger.disabled).toBe('true');

    controller.open();
    expect(controller.getOutputs().open).toBe(false);
  });

  it('supports programmatic value updates while popup is open or closed', () => {
    const controller = createController();
    controller.open();

    controller.setValue({ end: null, start: '2024-05-10' });
    let range = asRange(controller.getOutputs().value);
    expect(controller.getOutputs().open).toBe(true);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');

    controller.close('programmatic');
    controller.setValue({ end: '2024-05-17', start: '2024-05-10' });
    range = asRange(controller.getOutputs().value);
    expect(controller.getOutputs().open).toBe(false);
    expect(dateKey(range.end as Date)).toBe('2024-05-17');
  });
});
