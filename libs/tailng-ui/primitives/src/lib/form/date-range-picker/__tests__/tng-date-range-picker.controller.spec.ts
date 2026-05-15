import { afterEach, describe, expect, it } from 'vitest';
import type { TngDateRangeValue } from '../tng-date-range-picker';
import * as primitivesIndex from '../../../../index';
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

describe('tng-date-range-picker controller', () => {
  it('exports its dedicated controller and public range value type', () => {
    const typedValue: TngDateRangeValue = { end: null, start: null };

    expect(typedValue.start).toBeNull();
    expect(typedValue.end).toBeNull();
    expect(primitivesIndex.createDateRangePickerController).toBeTypeOf('function');
    expect(primitivesIndex.defaultDateRangePickerDateAdapter).toBeTypeOf('object');
  });

  it('initializes closed with empty range state', () => {
    const controller = createController();
    const state = controller.getState();

    expect(state.open).toBe(false);
    expect(state.startDate).toBeNull();
    expect(state.endDate).toBeNull();
    expect(state.previewEndDate).toBeNull();
    expect(dateKey(state.activeDate)).toBe('2024-04-18');
  });

  it('normalizes an initial partial and complete range', () => {
    const partial = createController({
      value: {
        end: null,
        start: '2024-05-10',
      },
    });

    expect(dateKey(partial.getOutputs().startDate as Date)).toBe('2024-05-10');
    expect(partial.getOutputs().endDate).toBeNull();

    const complete = createController({
      value: {
        end: '2024-05-10',
        start: '2024-05-14',
      },
    });

    expect(dateKey(complete.getOutputs().startDate as Date)).toBe('2024-05-10');
    expect(dateKey(complete.getOutputs().endDate as Date)).toBe('2024-05-14');
  });

  it('selects start, then end, and emits partial then complete range values', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.selectDate('2024-04-20');
    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(range.end).toBeNull();

    controller.selectDate('2024-04-24');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');

    const valueEvents = events.filter((event) => event.type === 'valueChange');
    expect(valueEvents).toHaveLength(2);
    expect(asRange(valueEvents[0]?.value).end).toBeNull();
    expect(dateKey(asRange(valueEvents[1]?.value).end as Date)).toBe('2024-04-24');
  });

  it('reorders reverse selection and supports same-day ranges', () => {
    const controller = createController();

    controller.selectDate('2024-04-24');
    controller.selectDate('2024-04-20');

    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');

    controller.selectDate('2024-04-26');
    controller.selectDate('2024-04-26');

    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-26');
    expect(dateKey(range.end as Date)).toBe('2024-04-26');
  });

  it('starts a new partial range after a completed range', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });

    controller.selectDate(d('2024-04-28'));

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-28');
    expect(range.end).toBeNull();
  });

  it('sets preview while selecting an end date and clears it after completion', () => {
    const controller = createController();

    controller.selectDate('2024-04-20');
    controller.handleCellPointerEnter('2024-04-24');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-24');

    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });
});
