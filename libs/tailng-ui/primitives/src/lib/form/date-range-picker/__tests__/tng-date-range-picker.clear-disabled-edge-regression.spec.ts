import { afterEach, describe, expect, it } from 'vitest';
import {
  createDatepickerController,
  defaultDatepickerDateAdapter,
} from '../../datepicker/tng-datepicker';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import {
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
  keyboardEvent,
} from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker clear, disabled, edge, and regression behavior', () => {
  it('clears start, end, preview, display value, and cell state without closing the popup', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });
    const events = collectEvents(controller);
    controller.open();
    controller.selectDate('2024-04-28');
    controller.handleCellPointerEnter('2024-04-30');

    controller.clear();

    expect(controller.getOutputs().startDate).toBeNull();
    expect(controller.getOutputs().endDate).toBeNull();
    expect(controller.getOutputs().previewEndDate).toBeNull();
    expect(controller.getOutputs().inputText).toBe('');
    expect(controller.getOutputs().open).toBe(true);
    expect(controller.getOutputs().cells.some((cell) => cell.rangeStart || cell.rangeEnd || cell.inRange)).toBe(
      false,
    );
    expect(asRange(events.filter((event) => event.type === 'valueChange').at(-1)?.value).start).toBeNull();
    expect(asRange(events.filter((event) => event.type === 'valueChange').at(-1)?.value).end).toBeNull();
  });

  it('does not throw when clear is called on an empty range', () => {
    const controller = createController();

    expect(() => controller.clear()).not.toThrow();
    expect(controller.getOutputs().value).toEqual({ end: null, start: null });
  });

  it('preserves value when disabled changes and allows programmatic value changes while disabled', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });

    controller.setDisabled(true);
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
    expect(controller.getOutputs().getHostAttributes()['data-disabled']).toBe('true');

    controller.selectDate('2024-04-28');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');

    controller.setValue({ end: '2024-05-17', start: '2024-05-10' });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');
    expect(dateKey(range.end as Date)).toBe('2024-05-17');
  });

  it('handles null, undefined, invalid, partial, reverse, same-day, and non-midnight values', () => {
    const controller = createController();

    controller.setValue(null);
    expect(controller.getOutputs().value).toEqual({ end: null, start: null });

    controller.setValue(undefined);
    expect(controller.getOutputs().value).toEqual({ end: null, start: null });

    controller.setValue(new Date(Number.NaN));
    expect(controller.getOutputs().value).toEqual({ end: null, start: null });
    expect(controller.getOutputs().validationError).toBe('invalid-value');

    controller.setValue({ end: '2024-04-24', start: null });
    let range = asRange(controller.getOutputs().value);
    expect(range.start).toBeNull();
    expect(range.end).toBeNull();

    controller.setValue({ end: '2024-04-20', start: '2024-04-24' });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');

    controller.setValue({
      end: new Date(2024, 3, 20, 23, 30),
      start: new Date(2024, 3, 20, 8, 30),
    });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-20');
  });

  it('handles months with 28, 29, 30, and 31 days plus old and future dates', () => {
    const controller = createController({
      max: '2099-12-31',
      min: '1900-01-01',
    });

    controller.selectDate('2023-02-28');
    controller.selectDate('2024-02-29');
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2023-02-28');
    expect(dateKey(range.end as Date)).toBe('2024-02-29');

    controller.selectDate('2024-04-30');
    controller.selectDate('2024-05-31');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-30');
    expect(dateKey(range.end as Date)).toBe('2024-05-31');

    controller.selectDate('1900-01-01');
    controller.selectDate('2099-12-31');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('1900-01-01');
    expect(dateKey(range.end as Date)).toBe('2099-12-31');
  });

  it('does not throw after destroy and stops emitting to unsubscribed listeners', () => {
    const controller = createController();
    const events = collectEvents(controller);
    const unsubscribe = controller.subscribe(() => {
      throw new Error('should not run after unsubscribe');
    });

    unsubscribe();
    controller.open();
    controller.destroy();

    expect(() => controller.close('programmatic')).not.toThrow();
    expect(() => controller.setValue({ end: null, start: '2024-04-20' })).not.toThrow();
    expect(() => controller.selectDate('2024-04-20')).not.toThrow();
    expect(events.filter((event) => event.type === 'valueChange')).toHaveLength(0);
  });

  it('uses date comparison rather than object reference equality', () => {
    const controller = createController({
      value: {
        end: new Date(2024, 3, 24),
        start: new Date(2024, 3, 20),
      },
    });

    const startCell = controller
      .getOutputs()
      .cells.find((cell) => dateKey(cell.date) === dateKey(new Date(2024, 3, 20)));
    expect(startCell?.rangeStart).toBe(true);
  });

  it('keeps existing datepicker public API, selection, keyboard, and ARIA behavior intact', () => {
    const controller = createDatepickerController<Date>({
      adapter: defaultDatepickerDateAdapter,
      locale: 'en-US',
      today: new Date(2024, 3, 18),
    });

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('Enter'));

    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-20');
    expect(controller.getOutputs().getTriggerAttributes()['aria-haspopup']).toBe('dialog');
    expect(controller.getOutputs().getCellAttributes(controller.getOutputs().activeDate)['aria-selected']).toBe(
      'true',
    );
  });
});
