import { afterEach, describe, expect, it } from 'vitest';
import { cleanupDom, createController, d, dateKey, keyboardEvent } from './tng-datepicker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-datepicker constraints block D', () => {
  it('D1-D5 disable dates by min/max/custom predicate and skip them during keyboard navigation', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-19',
      max: '2024-04-22',
      min: '2024-04-18',
      today: d('2024-04-18'),
    });

    const cells = controller.getOutputs().cells;
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-17')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-23')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-19')?.disabled).toBe(true);

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');

    controller.handleCellClick('2024-04-19');
    expect(controller.getOutputs().value).toBeNull();
  });

  it('D6 rejects ranges that would include disabled dates', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-20',
      selectionMode: 'range',
    });

    controller.selectDate('2024-04-18');
    controller.selectDate('2024-04-22');
    const range = controller.getOutputs().value as Readonly<{ end: Date | null; start: Date | null }>;
    expect(dateKey(range.start as Date)).toBe('2024-04-18');
    expect(range.end).toBeNull();
  });

  it('D7-D8 prevent month/year navigation into fully unavailable ranges', () => {
    const controller = createController({
      max: '2024-04-30',
      min: '2024-04-01',
      today: d('2024-04-18'),
    });

    controller.goToPrevMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-04-01');
    controller.goToNextMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-04-01');
    controller.setVisibleYear(2025);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-04-01');
  });

  it('D9 revalidates selection and view when bounds change dynamically', () => {
    const controller = createController({
      value: '2024-04-20',
    });

    controller.setConfig({
      max: '2024-04-18',
    });

    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().validationError).toBe('out-of-range');
  });

  it('D10 disables all dates before minDate and after maxDate aliases', () => {
    const controller = createController({
      maxDate: '2024-04-22',
      minDate: '2024-04-18',
      today: d('2024-04-18'),
    });

    const cells = controller.getOutputs().cells;
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-17')?.disabled).toBe(true);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-18')?.disabled).toBe(false);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-22')?.disabled).toBe(false);
    expect(cells.find((cell) => dateKey(cell.date) === '2024-04-23')?.disabled).toBe(true);
  });

  it('D11 revalidates selection when minDate and maxDate are patched at runtime', () => {
    const controller = createController({
      value: '2024-04-20',
    });

    controller.setConfig({
      maxDate: '2024-04-18',
      minDate: '2024-04-10',
    });

    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().validationError).toBe('out-of-range');
  });
});
