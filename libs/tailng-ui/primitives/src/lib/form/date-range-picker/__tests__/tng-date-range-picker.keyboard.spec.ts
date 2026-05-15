import { afterEach, describe, expect, it } from 'vitest';
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

describe('tng-date-range-picker keyboard support', () => {
  it('opens from the trigger with Enter and closes the grid with Escape', () => {
    const controller = createController();
    const openEvent = keyboardEvent('Enter');
    controller.handleTriggerKeyDown(openEvent);

    expect(openEvent.preventDefault).toHaveBeenCalled();
    expect(controller.getOutputs().open).toBe(true);

    const closeEvent = keyboardEvent('Escape');
    controller.handleGridKeyDown(closeEvent);

    expect(closeEvent.preventDefault).toHaveBeenCalled();
    expect(controller.getOutputs().open).toBe(false);
  });

  it('selects start and end dates with Enter', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('Enter'));
    controller.setActiveDate('2024-04-24');
    controller.handleGridKeyDown(keyboardEvent('Enter'));

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
  });

  it('updates preview range while keyboard focus moves after selecting a start date', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('Enter'));
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-22');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-22');
  });

  it('supports reverse keyboard selection', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-24');
    controller.handleGridKeyDown(keyboardEvent('Enter'));
    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent(' '));

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-20');
    expect(dateKey(range.end as Date)).toBe('2024-04-24');
  });

  it('opens from the trigger with Space and lets Tab move naturally', () => {
    const controller = createController();
    const spaceEvent = keyboardEvent(' ');
    controller.handleTriggerKeyDown(spaceEvent);

    expect(spaceEvent.preventDefault).toHaveBeenCalled();
    expect(controller.getOutputs().open).toBe(true);

    const tabEvent = keyboardEvent('Tab');
    controller.handleGridKeyDown(tabEvent);
    expect(tabEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('starts a new range with keyboard when range is already complete', () => {
    const controller = createController({
      value: {
        end: '2024-04-24',
        start: '2024-04-20',
      },
    });

    controller.setActiveDate('2024-04-28');
    controller.handleGridKeyDown(keyboardEvent('Enter'));

    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-28');
    expect(range.end).toBeNull();
  });

  it('moves active focus by day, week, month, and year keyboard commands', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-19');

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');

    controller.handleGridKeyDown(keyboardEvent('ArrowUp'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-13');

    controller.handleGridKeyDown(keyboardEvent('ArrowDown'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');

    controller.handleGridKeyDown(keyboardEvent('PageUp'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-03-20');

    controller.handleGridKeyDown(keyboardEvent('PageDown'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');

    controller.handleGridKeyDown(keyboardEvent('PageUp', { shiftKey: true }));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2023-04-20');

    controller.handleGridKeyDown(keyboardEvent('PageDown', { shiftKey: true }));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');
  });

  it('uses RTL horizontal navigation when configured', () => {
    const controller = createController({
      direction: 'rtl',
    });

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-21');

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');
  });

  it('moves to week boundaries with Home and End', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-24');
    controller.handleGridKeyDown(keyboardEvent('Home'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-21');

    controller.handleGridKeyDown(keyboardEvent('End'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-27');
  });

  it('updates visible month and keeps preview across keyboard month navigation', () => {
    const controller = createController();

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('Enter'));
    controller.handleGridKeyDown(keyboardEvent('PageDown'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-20');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-05-20');
  });

  it('does not emit valueChange from focus movement alone and tolerates unknown keys', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    controller.handleGridKeyDown(keyboardEvent('Unidentified'));

    expect(events.filter((event) => event.type === 'valueChange')).toHaveLength(0);
  });

  it('skips disabled dates and clamps keyboard navigation to min and max', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-21',
      max: '2024-04-24',
      min: '2024-04-20',
    });

    controller.setActiveDate('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-22');

    controller.setActiveDate('2024-04-24');
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-24');
  });
});
