import { afterEach, describe, expect, it } from 'vitest';
import { appendFocusable, cleanupDom, collectEvents, createController, d, dateKey, keyboardEvent } from './tng-datepicker.test-helpers';
import type { TngDatepickerController } from '../tng-datepicker';

afterEach(() => {
  cleanupDom();
});

function createYearBoundaryController(): TngDatepickerController<Date> {
  const controller = createController({
    today: d('2024-04-18'),
    value: '2024-04-22',
    yearPageSize: 24,
  });

  controller.setView('year');
  controller.setFocusedSection('year');
  return controller;
}

function getActiveYear(controller: TngDatepickerController<Date>): number | undefined {
  return controller.getOutputs().yearOptions.find((option) => option.active)?.year;
}

function getVisibleYearRange(controller: TngDatepickerController<Date>): readonly [number, number] {
  const years = controller.getOutputs().yearOptions.map((option) => option.year);
  return [years[0] ?? NaN, years[years.length - 1] ?? NaN] as const;
}

function createMonthBoundaryController(activeDate: Date): TngDatepickerController<Date> {
  const controller = createController({
    today: d('2024-04-18'),
    value: dateKey(activeDate),
  });

  controller.setView('month');
  controller.setFocusedSection('month');
  controller.setActiveDate(activeDate);
  return controller;
}

function getActiveMonthLabel(controller: TngDatepickerController<Date>): string | undefined {
  return controller.getOutputs().monthOptions.find((option) => option.active)?.label;
}

describe('tng-datepicker keyboard and focus blocks G/H/I', () => {
  it('G1-G6 move day-grid focus with arrows, Home/End, and PageUp/PageDown', () => {
    const controller = createController({
      today: d('2024-04-18'),
    });

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-19');
    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-18');
    controller.handleGridKeyDown(keyboardEvent('ArrowDown'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-25');
    controller.handleGridKeyDown(keyboardEvent('ArrowUp'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-18');
    controller.handleGridKeyDown(keyboardEvent('Home'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-14');
    controller.handleGridKeyDown(keyboardEvent('End'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-20');
    controller.handleGridKeyDown(keyboardEvent('PageDown'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-20');
    controller.handleGridKeyDown(keyboardEvent('PageUp', { ctrlKey: true }));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2023-05-20');
  });

  it('G8-G11 select from keyboard, allow Tab to exit, and support numeric typeahead', () => {
    const controller = createController({
      today: d('2024-04-18'),
    });

    const enterEvent = keyboardEvent('Enter');
    controller.handleGridKeyDown(enterEvent);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-18');
    expect(enterEvent.preventDefault).toHaveBeenCalled();

    controller.handleGridKeyDown(keyboardEvent('5'));
    expect(controller.getOutputs().activeDate.getDate()).toBeGreaterThan(0);

    const tabEvent = keyboardEvent('Tab');
    controller.handleGridKeyDown(tabEvent);
    expect(tabEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('G12 moves day-grid focus to the previous and next date with ArrowLeft and ArrowRight', () => {
    const controller = createController({
      today: d('2024-04-18'),
      value: '2024-04-18',
    });

    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-17');
    expect(controller.getOutputs().visibleMonth.getMonth()).toBe(3);

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-18');
    expect(controller.getOutputs().visibleMonth.getMonth()).toBe(3);
  });

  it('G13 moves to the previous month from the first enabled day when ArrowLeft is pressed', () => {
    const controller = createController({
      disableDate: (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      },
      today: d('2024-06-03'),
      value: '2024-06-03',
      visibleMonth: '2024-06-01',
    });

    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-31');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');
  });

  it('G14 moves to the next month from the last enabled day when ArrowRight is pressed', () => {
    const controller = createController({
      disableDate: (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
      },
      today: d('2024-05-31'),
      value: '2024-05-31',
      visibleMonth: '2024-05-01',
    });

    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));

    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-06-03');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-06-01');
  });

  it('H1-H5 navigate month/year pickers, commit selections with Enter, and escape back to day or close popup', () => {
    const controller = createController({
      today: d('2024-04-18'),
    });
    const events = collectEvents(controller);

    controller.setView('month');
    controller.setFocusedSection('month');
    controller.handleMonthGridKeyDown(keyboardEvent('ArrowRight'));
    const activeMonth = controller.getOutputs().monthOptions.find((option) => option.active);
    expect(activeMonth?.focusVisible).toBe(true);
    expect(activeMonth && controller.getOutputs().getMonthAttributes(activeMonth)['data-focus-visible']).toBe('true');
    controller.handleMonthGridKeyDown(keyboardEvent('Enter'));
    expect(controller.getOutputs().view).toBe('day');

    controller.setView('year');
    controller.setFocusedSection('year');
    const beforeYear = controller.getOutputs().visibleMonth.getFullYear();
    controller.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    const activeYear = controller.getOutputs().yearOptions.find((option) => option.active);
    expect(activeYear?.focusVisible).toBe(true);
    expect(activeYear && controller.getOutputs().getYearAttributes(activeYear)['data-focus-visible']).toBe('true');
    controller.handleYearGridKeyDown(keyboardEvent('Enter'));
    expect(controller.getOutputs().visibleMonth.getFullYear()).not.toBe(beforeYear);

    controller.setView('month');
    controller.handleMonthGridKeyDown(keyboardEvent('Escape'));
    expect(controller.getOutputs().view).toBe('day');

    controller.open();
    controller.handleGridKeyDown(keyboardEvent('Escape'));
    expect(controller.getOutputs().open).toBe(false);

    const activeChangeCount = events.filter((event) => event.type === 'activeChange').length;
    expect(activeChangeCount).toBeGreaterThanOrEqual(2);
  });

  it('H6 keeps month/year focus-visible styling aligned when the active date is not the first of the month', () => {
    const controller = createController({
      today: d('2024-04-18'),
      value: '2024-04-22',
    });

    controller.setView('month');
    controller.setFocusedSection('month');

    let activeMonth = controller.getOutputs().monthOptions.find((option) => option.active);
    expect(activeMonth?.label).toBe('Apr');
    expect(activeMonth?.focusVisible).toBe(true);
    expect(activeMonth && controller.getOutputs().getMonthAttributes(activeMonth)['data-focus-visible']).toBe('true');

    controller.setView('year');
    controller.setFocusedSection('year');

    let activeYear = controller.getOutputs().yearOptions.find((option) => option.active);
    expect(activeYear?.label).toBe('2024');
    expect(activeYear?.focusVisible).toBe(true);
    expect(activeYear && controller.getOutputs().getYearAttributes(activeYear)['data-focus-visible']).toBe('true');

    controller.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    activeYear = controller.getOutputs().yearOptions.find((option) => option.active);
    expect(activeYear?.focusVisible).toBe(true);
    expect(activeYear && controller.getOutputs().getYearAttributes(activeYear)['data-focus-visible']).toBe('true');
  });

  it('H7 keeps the year grid stable while Arrow navigation moves focus within the current page', () => {
    const controller = createController({
      today: d('2006-04-18'),
      value: '2006-04-22',
      yearPageSize: 12,
    });

    controller.setView('year');
    controller.setFocusedSection('year');

    const beforeOptions = controller.getOutputs().yearOptions.map((option) => option.year);
    const beforeVisibleYear = controller.getOutputs().visibleMonth.getFullYear();
    const beforeActiveYear = controller.getOutputs().yearOptions.find((option) => option.active)?.year;

    expect(beforeActiveYear).toBe(2006);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowRight'));

    const afterOptions = controller.getOutputs().yearOptions.map((option) => option.year);
    const activeYear = controller.getOutputs().yearOptions.find((option) => option.active)?.year;

    expect(afterOptions).toEqual(beforeOptions);
    expect(controller.getOutputs().visibleMonth.getFullYear()).toBe(beforeVisibleYear);
    expect(activeYear).toBe(2007);
  });

  it('H8 continues year-grid navigation from the last visible year 2035 for ArrowUp/Down/Left/Right', () => {
    const upController = createYearBoundaryController();
    upController.setActiveDate(d('2035-04-01'));
    expect(getVisibleYearRange(upController)).toEqual([2012, 2035]);
    upController.handleYearGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveYear(upController)).toBe(2031);
    expect(getVisibleYearRange(upController)).toEqual([2012, 2035]);

    const downController = createYearBoundaryController();
    downController.setActiveDate(d('2035-04-01'));
    downController.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveYear(downController)).toBe(2039);
    expect(getVisibleYearRange(downController)).toEqual([2036, 2059]);

    const leftController = createYearBoundaryController();
    leftController.setActiveDate(d('2035-04-01'));
    leftController.handleYearGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveYear(leftController)).toBe(2034);
    expect(getVisibleYearRange(leftController)).toEqual([2012, 2035]);

    const rightController = createYearBoundaryController();
    rightController.setActiveDate(d('2035-04-01'));
    rightController.handleYearGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveYear(rightController)).toBe(2036);
    expect(getVisibleYearRange(rightController)).toEqual([2036, 2059]);
  });

  it('H9 continues year-grid navigation from the first visible year 2012 for ArrowUp/Down/Left/Right', () => {
    const upController = createYearBoundaryController();
    upController.setActiveDate(d('2012-04-01'));
    expect(getVisibleYearRange(upController)).toEqual([2012, 2035]);
    upController.handleYearGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveYear(upController)).toBe(2008);
    expect(getVisibleYearRange(upController)).toEqual([1988, 2011]);

    const downController = createYearBoundaryController();
    downController.setActiveDate(d('2012-04-01'));
    downController.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveYear(downController)).toBe(2016);
    expect(getVisibleYearRange(downController)).toEqual([2012, 2035]);

    const leftController = createYearBoundaryController();
    leftController.setActiveDate(d('2012-04-01'));
    leftController.handleYearGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveYear(leftController)).toBe(2011);
    expect(getVisibleYearRange(leftController)).toEqual([1988, 2011]);

    const rightController = createYearBoundaryController();
    rightController.setActiveDate(d('2012-04-01'));
    rightController.handleYearGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveYear(rightController)).toBe(2013);
    expect(getVisibleYearRange(rightController)).toEqual([2012, 2035]);
  });

  it('H9a skips disabled years when minDate and maxDate bound the year panel', () => {
    const controller = createController({
      maxDate: '2026-03-31',
      minDate: '2024-04-01',
      today: d('2025-03-23'),
      value: '2025-03-23',
      visibleMonth: '2025-03-01',
      yearPageSize: 24,
    });

    controller.open();
    controller.showYearsPanel();
    controller.setFocusedSection('year');

    const yearOptions = controller.getOutputs().yearOptions;
    expect(yearOptions.some((option) => option.year < 2024 && option.disabled)).toBe(true);
    expect(yearOptions.find((option) => option.year === 2024)?.disabled).toBe(false);
    expect(yearOptions.find((option) => option.year === 2025)?.disabled).toBe(false);
    expect(yearOptions.find((option) => option.year === 2026)?.disabled).toBe(false);
    expect(yearOptions.some((option) => option.year > 2026 && option.disabled)).toBe(true);
    expect(getActiveYear(controller)).toBe(2025);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveYear(controller)).toBe(2024);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveYear(controller)).toBe(2024);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveYear(controller)).toBe(2025);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveYear(controller)).toBe(2026);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleYearGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveYear(controller)).toBe(2026);
    expect(controller.getOutputs().yearOptions.find((option) => option.active)?.disabled).toBe(false);
  });

  it('H10 continues month-grid navigation from December across year boundaries', () => {
    const upController = createMonthBoundaryController(d('2024-12-01'));
    upController.handleMonthGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveMonthLabel(upController)).toBe('Aug');
    expect(upController.getOutputs().visibleMonth.getFullYear()).toBe(2024);

    const downController = createMonthBoundaryController(d('2024-12-01'));
    downController.handleMonthGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveMonthLabel(downController)).toBe('Apr');
    expect(downController.getOutputs().visibleMonth.getFullYear()).toBe(2025);

    const leftController = createMonthBoundaryController(d('2024-12-01'));
    leftController.handleMonthGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveMonthLabel(leftController)).toBe('Nov');
    expect(leftController.getOutputs().visibleMonth.getFullYear()).toBe(2024);

    const rightController = createMonthBoundaryController(d('2024-12-01'));
    rightController.handleMonthGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveMonthLabel(rightController)).toBe('Jan');
    expect(rightController.getOutputs().visibleMonth.getFullYear()).toBe(2025);
  });

  it('H11 continues month-grid navigation from January across year boundaries', () => {
    const upController = createMonthBoundaryController(d('2024-01-01'));
    upController.handleMonthGridKeyDown(keyboardEvent('ArrowUp'));
    expect(getActiveMonthLabel(upController)).toBe('Sep');
    expect(upController.getOutputs().visibleMonth.getFullYear()).toBe(2023);

    const downController = createMonthBoundaryController(d('2024-01-01'));
    downController.handleMonthGridKeyDown(keyboardEvent('ArrowDown'));
    expect(getActiveMonthLabel(downController)).toBe('May');
    expect(downController.getOutputs().visibleMonth.getFullYear()).toBe(2024);

    const leftController = createMonthBoundaryController(d('2024-01-01'));
    leftController.handleMonthGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveMonthLabel(leftController)).toBe('Dec');
    expect(leftController.getOutputs().visibleMonth.getFullYear()).toBe(2023);

    const rightController = createMonthBoundaryController(d('2024-01-01'));
    rightController.handleMonthGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveMonthLabel(rightController)).toBe('Feb');
    expect(rightController.getOutputs().visibleMonth.getFullYear()).toBe(2024);
  });

  it('H11a stops month-grid right navigation at March when maxDate disables April 2026 and later months', () => {
    const controller = createController({
      maxDate: '2026-03-31',
      minDate: '2024-04-01',
      today: d('2026-02-23'),
      value: '2026-02-23',
      visibleMonth: '2026-02-01',
    });

    controller.open();
    controller.showMonthsPanel();
    controller.setFocusedSection('month');

    const monthOptions = controller.getOutputs().monthOptions;
    expect(monthOptions.find((option) => option.label === 'Mar')?.disabled).toBe(false);
    expect(monthOptions.find((option) => option.label === 'Apr')?.disabled).toBe(true);
    expect(getActiveMonthLabel(controller)).toBe('Feb');

    controller.handleMonthGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveMonthLabel(controller)).toBe('Mar');
    expect(controller.getOutputs().monthOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleMonthGridKeyDown(keyboardEvent('ArrowRight'));
    expect(getActiveMonthLabel(controller)).toBe('Mar');
    expect(controller.getOutputs().monthOptions.find((option) => option.active)?.disabled).toBe(false);
  });

  it('H11b stops month-grid left navigation at April when minDate disables March 2024 and earlier months', () => {
    const controller = createController({
      maxDate: '2026-03-31',
      minDate: '2024-04-01',
      today: d('2024-05-23'),
      value: '2024-05-23',
      visibleMonth: '2024-05-01',
    });

    controller.open();
    controller.showMonthsPanel();
    controller.setFocusedSection('month');

    const monthOptions = controller.getOutputs().monthOptions;
    expect(monthOptions.find((option) => option.label === 'Apr')?.disabled).toBe(false);
    expect(monthOptions.find((option) => option.label === 'Mar')?.disabled).toBe(true);
    expect(getActiveMonthLabel(controller)).toBe('May');

    controller.handleMonthGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveMonthLabel(controller)).toBe('Apr');
    expect(controller.getOutputs().monthOptions.find((option) => option.active)?.disabled).toBe(false);

    controller.handleMonthGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(getActiveMonthLabel(controller)).toBe('Apr');
    expect(controller.getOutputs().monthOptions.find((option) => option.active)?.disabled).toBe(false);
  });

  it('I1-I4 focus selected date/today/first enabled on open and restores focus safely on close', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-18',
      value: '2024-04-22',
    });

    const trigger = appendFocusable('button');
    trigger.focus();
    controller.registerTrigger(trigger);
    controller.open();
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-22');
    controller.close();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
    controller.open();
    expect(() => controller.close()).not.toThrow();
  });

  it('I2/I5/I6 keeps focus valid across month changes and updates horizontal semantics for RTL at runtime', () => {
    const controller = createController({
      today: d('2024-04-30'),
    });

    controller.handleGridKeyDown(keyboardEvent('PageDown'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-30');

    controller.setConfig({
      direction: 'rtl',
    });
    controller.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-29');
    controller.handleGridKeyDown(keyboardEvent('ArrowLeft'));
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-05-30');
  });
});
