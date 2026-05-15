import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import {
  cleanupDom,
  collectEvents,
  createController,
  d,
  dateKey,
} from './tng-date-range-picker.test-helpers';

function asRange(value: unknown): TngDateRangeValue<Date> {
  return value as TngDateRangeValue<Date>;
}

afterEach(() => {
  cleanupDom();
});

describe('tng-date-range-picker initial and external state', () => {
  it('initializes from null, partial, and complete values without preview state', () => {
    const empty = createController({ value: null });
    expect(empty.getOutputs().open).toBe(false);
    expect(empty.getOutputs().startDate).toBeNull();
    expect(empty.getOutputs().endDate).toBeNull();
    expect(empty.getOutputs().previewEndDate).toBeNull();
    expect(dateKey(empty.getOutputs().activeDate)).toBe('2024-04-18');

    const partial = createController({ value: { end: null, start: '2024-05-10' } });
    expect(dateKey(partial.getOutputs().startDate as Date)).toBe('2024-05-10');
    expect(partial.getOutputs().endDate).toBeNull();
    expect(dateKey(partial.getOutputs().activeDate)).toBe('2024-05-10');
    expect(partial.getOutputs().previewEndDate).toBeNull();

    const complete = createController({
      value: { end: '2024-05-17', start: '2024-05-10' },
    });
    expect(dateKey(complete.getOutputs().startDate as Date)).toBe('2024-05-10');
    expect(dateKey(complete.getOutputs().endDate as Date)).toBe('2024-05-17');
    expect(dateKey(complete.getOutputs().activeDate)).toBe('2024-05-17');
    expect(complete.getOutputs().previewEndDate).toBeNull();
  });

  it('does not mutate the external range object or Date instances during initialization', () => {
    const start = d('2024-05-17');
    const end = d('2024-05-10');
    const value = { end, start };

    createController({ value });

    expect(value.start).toBe(start);
    expect(value.end).toBe(end);
    expect(dateKey(start)).toBe('2024-05-17');
    expect(dateKey(end)).toBe('2024-05-10');
  });

  it('updates internal range from external partial, complete, null, and reverse values', () => {
    const controller = createController({
      value: { end: '2024-04-24', start: '2024-04-20' },
    });

    controller.setValue({ end: null, start: '2024-05-10' });
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');
    expect(range.end).toBeNull();

    controller.setValue({ end: '2024-05-17', start: '2024-05-10' });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');
    expect(dateKey(range.end as Date)).toBe('2024-05-17');

    controller.setValue(null);
    expect(controller.getOutputs().value).toEqual({ end: null, start: null });
    expect(controller.getOutputs().startDate).toBeNull();
    expect(controller.getOutputs().endDate).toBeNull();

    controller.setValue({ end: '2024-06-01', start: null });
    range = asRange(controller.getOutputs().value);
    expect(range.start).toBeNull();
    expect(range.end).toBeNull();

    controller.setValue({ end: '2024-06-01', start: '2024-06-08' });
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-06-01');
    expect(dateKey(range.end as Date)).toBe('2024-06-08');
  });

  it('preserves popup state and current visible month when value changes in the same month', () => {
    const controller = createController({
      value: { end: null, start: '2024-05-10' },
    });
    controller.open();
    controller.setVisibleMonth('2024-05-01');

    controller.setValue({ end: '2024-05-17', start: '2024-05-10' });

    expect(controller.getOutputs().open).toBe(true);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');
  });

  it('clears stale preview and handles rapid external updates consistently', () => {
    const controller = createController({
      value: { end: null, start: '2024-04-20' },
    });
    controller.handleCellPointerEnter('2024-04-24');
    expect(controller.getOutputs().previewEndDate).toBeInstanceOf(Date);

    controller.setValue({ end: null, start: '2024-05-10' });
    controller.setValue({ end: '2024-05-17', start: '2024-05-10' });
    controller.setValue(null);

    expect(controller.getOutputs().value).toEqual({ end: null, start: null });
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });

  it('emits programmatic value changes from the controller setValue API once per change', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.setValue({ end: null, start: '2024-04-20' });
    controller.setValue({ end: '2024-04-24', start: '2024-04-20' });
    controller.setValue({ end: '2024-04-24', start: '2024-04-20' });

    const valueEvents = events.filter((event) => event.type === 'valueChange');
    expect(valueEvents).toHaveLength(2);
    expect(valueEvents.every((event) => event.type !== 'valueChange' || event.trigger === 'programmatic')).toBe(
      true,
    );
  });
});
