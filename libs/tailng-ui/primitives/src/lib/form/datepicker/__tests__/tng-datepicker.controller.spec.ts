import { afterEach, describe, expect, it } from 'vitest';
import type {
  TngCalendarView,
  TngDateValue,
  TngDatepickerConfig,
  TngDatepickerController,
} from '../tng-datepicker';
import * as primitivesIndex from '../../../../index';
import {
  cleanupDom,
  collectEvents,
  createCalendarSystemAdapter,
  createSlashInputAdapter,
  createOverlayMonthYearAdapter,
  createController,
  d,
  dateKey,
  keyboardEvent,
} from './tng-datepicker.test-helpers';

function asRange(value: TngDateValue<Date>): Readonly<{ end: Date | null; start: Date | null }> {
  return value as Readonly<{ end: Date | null; start: Date | null }>;
}

function asMultiple(value: TngDateValue<Date>): readonly Date[] {
  return value as readonly Date[];
}

type DatepickerPanelController = TngDatepickerController<Date> &
  Readonly<{
    showDaysPanel: () => void;
    showMonthsPanel: () => void;
    showYearsPanel: () => void;
  }>;

afterEach(() => {
  cleanupDom();
});

describe('tng-datepicker controller blocks A/B/C/E/F/L/M/N/O', () => {
  it('A1-A4 exports the controller/types, supports ownerDocument=null, and produces deterministic initial state', () => {
    const typedFactory: (config?: TngDatepickerConfig<Date>) => TngDatepickerController<Date> =
      primitivesIndex.createDatepickerController;
    expect(typeof typedFactory).toBe('function');
    expect(primitivesIndex.createDatepickerController).toBeTypeOf('function');

    const controller = createController({
      ownerDocument: null,
      today: d('2024-04-18'),
    });

    const outputs = controller.getOutputs();
    expect(outputs.open).toBe(false);
    expect(outputs.view).toBe<TngCalendarView>('day');
    expect(dateKey(outputs.activeDate)).toBe('2024-04-18');
    expect(dateKey(outputs.visibleMonth)).toBe('2024-04-01');
    expect(outputs.weekdayLabels.length).toBe(7);
  });

  it('B1/B4 normalize incoming single values from ISO strings and Date instances', () => {
    const controller = createController();
    controller.setValue('2024-05-03');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-05-03');

    controller.setValue(new Date(2024, 4, 4, 3, 30));
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-05-04');
  });

  it('B2/C3/C4/C5 normalize range values with ordering fixup and same-day support', () => {
    const controller = createController({
      selectionMode: 'range',
    });

    controller.setValue({
      end: '2024-05-10',
      start: '2024-05-14',
    });

    let range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-10');
    expect(dateKey(range.end as Date)).toBe('2024-05-14');

    controller.selectDate('2024-05-18');
    controller.selectDate('2024-05-18');
    range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-05-18');
    expect(dateKey(range.end as Date)).toBe('2024-05-18');
  });

  it('B3/C7/C8/C9 preserve unique sorted multi values, support shift-range toggles, and respect maxSelections', () => {
    const controller = createController({
      enableMultipleRangeSelection: true,
      maxSelections: 4,
      selectionMode: 'multiple',
    });

    controller.setValue(['2024-05-05', '2024-05-03', '2024-05-05']);
    expect(asMultiple(controller.getOutputs().value).map(dateKey)).toEqual([
      '2024-05-03',
      '2024-05-05',
    ]);

    controller.selectDate('2024-05-07');
    controller.selectDate('2024-05-09', { shiftKey: true });
    expect(asMultiple(controller.getOutputs().value).map(dateKey)).toEqual([
      '2024-05-03',
      '2024-05-05',
      '2024-05-07',
      '2024-05-08',
    ]);
    expect(controller.getOutputs().validationError).toBe('max-selections');
  });

  it('B5 rejects invalid inputs and surfaces validationError without committing selection', () => {
    const controller = createController();
    controller.setValue('not-a-date');
    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().validationError).toBe('invalid-value');
  });

  it('B6/B7 round-trips formatting/parsing and keeps partial text edits uncommitted until parse success', () => {
    const controller = createController();
    const parsed = controller.parseInputText('08-12-2024');
    expect(parsed).not.toBeNull();
    expect(controller.formatDate(parsed as Date, 'input')).toBe('08-12-2024');

    controller.setInputText('08-12');
    expect(controller.getOutputs().value).toBeNull();
    expect(controller.getOutputs().inputText).toBe('08-12');

    controller.setInputText('08-12-2024');
    expect(controller.commitInputText()).toBe(true);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-08-12');
  });

  it('B9 allows a custom adapter to control the input text format and parsing contract', () => {
    const controller = createController({
      adapter: createSlashInputAdapter(),
      value: '2024-08-12',
    });

    expect(controller.getOutputs().inputText).toBe('2024/08/12');

    controller.setInputText('2024/09/14');
    expect(controller.commitInputText()).toBe(true);
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-09-14');
    expect(controller.getOutputs().inputText).toBe('2024/09/14');
  });

  it('B8/O1 keeps date-only values stable around DST boundaries', () => {
    const controller = createController();
    controller.setValue(new Date(2024, 2, 10, 1, 45));
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-03-10');
  });

  it('C1/C2/C10 supports single-select click behavior, allowDeselect, and clear()', () => {
    const controller = createController({
      allowDeselect: true,
    });

    controller.handleCellClick('2024-04-20');
    expect(dateKey(controller.getOutputs().value as Date)).toBe('2024-04-20');
    controller.handleCellClick('2024-04-20');
    expect(controller.getOutputs().value).toBeNull();

    controller.handleCellClick('2024-04-24');
    controller.clear();
    expect(controller.getOutputs().value).toBeNull();
    expect(dateKey(controller.getOutputs().activeDate)).toBe('2024-04-18');
  });

  it('C6 extends range selection via keyboard when enabled', () => {
    const controller = createController({
      enableRangeSelection: true,
      selectionMode: 'range',
      value: {
        end: null,
        start: '2024-04-18',
      },
    });

    controller.handleGridKeyDown(keyboardEvent('ArrowRight', { shiftKey: true }));
    const range = asRange(controller.getOutputs().value);
    expect(dateKey(range.start as Date)).toBe('2024-04-18');
    expect(dateKey(range.end as Date)).toBe('2024-04-19');
  });

  it('E1-E9 navigate months/years, switch views, auto-commit month/year picks, and preserve view across open/close', () => {
    const controller = createController({
      autoCommitView: true,
      closeOnSelect: false,
      initialView: 'day',
      preserveViewOnOpenClose: true,
    });

    controller.goToNextMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-05-01');
    controller.goToPrevMonth();
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-04-01');
    controller.setVisibleMonth(2025, 6);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2025-07-01');
    controller.setVisibleYear(2026);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2026-07-01');
    controller.setView('month');
    expect(controller.getOutputs().view).toBe('month');
    controller.selectMonth(10);
    expect(controller.getOutputs().view).toBe('day');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2026-11-01');
    controller.setView('year');
    controller.open();
    controller.close();
    controller.open();
    expect(controller.getOutputs().view).toBe('year');
  });

  it('F1-F5 supports composite month/day/year coordination and applies month/year constraints', () => {
    const controller = createController({
      max: '2024-09-20',
      min: '2024-06-10',
    });

    controller.setFocusedSection('month');
    expect(controller.getOutputs().focusedSection).toBe('month');
    controller.selectMonth(6);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-07-01');
    controller.setFocusedSection('year');
    controller.selectYear(2025);
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2024-07-01');

    const monthOptions = controller.getOutputs().monthOptions;
    expect(monthOptions[0]?.disabled).toBe(true);
    expect(monthOptions[6]?.disabled).toBe(false);

    const yearOptions = controller.getOutputs().yearOptions;
    expect(yearOptions.find((item) => item.year === 2024)?.disabled).toBe(false);
    expect(yearOptions.find((item) => item.year === 2026)?.disabled).toBe(true);
  });

  it('F6 exposes explicit panel APIs for implementation-driven view control', () => {
    const controller = createController() as DatepickerPanelController;

    controller.showYearsPanel();
    expect(controller.getOutputs().view).toBe('year');

    controller.showMonthsPanel();
    expect(controller.getOutputs().view).toBe('month');

    controller.showDaysPanel();
    expect(controller.getOutputs().view).toBe('day');
  });

  it('F7 lets implementation pages orchestrate year to month to day flow when autoCommitView=false', () => {
    const controller = createController({
      autoCommitView: false,
      value: '2024-04-22',
    }) as DatepickerPanelController;

    controller.showYearsPanel();
    expect(controller.getOutputs().view).toBe('year');

    controller.selectYear(2026);
    expect(controller.getOutputs().view).toBe('year');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2026-04-01');

    controller.showMonthsPanel();
    expect(controller.getOutputs().view).toBe('month');

    controller.selectMonth(8);
    expect(controller.getOutputs().view).toBe('month');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2026-09-01');

    controller.showDaysPanel();
    expect(controller.getOutputs().view).toBe('day');
    expect(dateKey(controller.getOutputs().visibleMonth)).toBe('2026-09-01');
  });

  it('L1-L7 emits value/active/view/month/year changes without duplicates and setState batches in stable order', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.selectDate('2024-04-18');
    controller.selectDate('2024-04-18');
    controller.setView('month');
    controller.goToNextMonth();
    controller.setState({
      activeDate: '2025-06-12',
      value: '2025-06-12',
      view: 'day',
      visibleMonth: '2025-06-01',
    });

    const types = events.map((event) => event.type);
    expect(types.filter((type) => type === 'valueChange')).toHaveLength(2);
    expect(types).toContain('activeChange');
    expect(types).toContain('viewChange');
    expect(types).toContain('monthChange');
    expect(types).toContain('yearChange');
    expect(types.slice(-5)).toEqual(['viewChange', 'monthChange', 'yearChange', 'activeChange', 'valueChange']);
  });

  it('M1-M3 localize weekday order, month labels, and numerals; M4 supports custom calendar adapters', () => {
    const localized = createController({
      locale: 'ar-EG',
      today: d('2024-01-10'),
      weekStartsOn: undefined,
    });
    const firstWeekday = localized.getOutputs().weekdayLabels[0];
    expect(typeof firstWeekday).toBe('string');
    expect(localized.getOutputs().monthOptions[3]?.label).toBe(
      localized.formatDate(d('2024-04-01'), 'month-short'),
    );
    expect(localized.getOutputs().cells.some((cell) => /[٠-٩]/.test(cell.label))).toBe(true);

    const customAdapter = createController({
      adapter: createCalendarSystemAdapter(),
      today: d('2024-01-10'),
    });
    expect(customAdapter.getOutputs().yearOptions[0]?.label).toMatch(/25/);
  });

  it('M3a falls back to the ambient document locale when no locale config is provided', () => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = 'fr-FR';

    try {
      const controller = primitivesIndex.createDatepickerController<Date>({
        closeOnSelect: false,
        ownerDocument: document,
        showOutsideDays: true,
        today: d('2024-04-18'),
      });

      const expectedMonth = controller.formatDate(d('2024-04-01'), 'month-short');
      const expectedHeader = controller.formatDate(d('2024-04-01'), 'month-year');

      expect(controller.getOutputs().monthOptions[3]?.label).toBe(expectedMonth);
      expect(controller.getOutputs().labelMonthYear).toBe(expectedHeader);
    } finally {
      document.documentElement.lang = previousLang;
    }
  });

  it('M5 uses the attached adapter to control the overlay month-year label format', () => {
    const controller = createController({
      adapter: createOverlayMonthYearAdapter(),
      value: '2024-04-22',
    });

    expect(controller.getOutputs().labelMonthYear).toBe('04/2024');

    controller.goToNextMonth();
    expect(controller.getOutputs().labelMonthYear).toBe('05/2024');
  });

  it('M6 updates the overlay month-year label when the adapter is replaced at runtime', () => {
    const controller = createController({
      value: '2024-04-22',
    });

    expect(controller.getOutputs().labelMonthYear).toBe('April 2024');

    controller.setConfig({
      adapter: createOverlayMonthYearAdapter(),
    });

    expect(controller.getOutputs().labelMonthYear).toBe('04/2024');
  });

  it('N1/N2/N3 reuse derived output allocations, keep year options paged, and generate deterministic unique ids', () => {
    const controllerA = createController({
      yearPageSize: 18,
    });
    const controllerB = createController({
      today: d('2024-04-19'),
    });

    const outputsA1 = controllerA.getOutputs();
    const outputsA2 = controllerA.getOutputs();
    expect(outputsA1).toBe(outputsA2);
    expect(outputsA1.cells).toBe(outputsA2.cells);
    expect(outputsA1.yearOptions).toHaveLength(18);
    expect(outputsA1.cells[0]?.id).not.toBe(outputsA1.cells[1]?.id);
    expect(outputsA1.cells[0]?.id).not.toBe(controllerB.getOutputs().cells[0]?.id);
  });

  it('N4/O2/O3/O4/O5 handles destroy, leap-day clamping, min=max, all-disabled calendars, and out-of-range programmatic values', () => {
    const leapController = createController({
      today: d('2024-03-31'),
    });
    leapController.setActiveDate('2024-03-31');
    leapController.handleGridKeyDown(keyboardEvent('PageUp'));
    expect(dateKey(leapController.getOutputs().activeDate)).toBe('2024-02-29');

    const singleDayController = createController({
      max: '2024-05-05',
      min: '2024-05-05',
      today: d('2024-05-05'),
    });
    expect(singleDayController.getOutputs().monthOptions[4]?.disabled).toBe(false);

    const disabledController = createController({
      disableDate: () => true,
    });
    const initialActive = dateKey(disabledController.getOutputs().activeDate);
    disabledController.handleGridKeyDown(keyboardEvent('ArrowRight'));
    expect(dateKey(disabledController.getOutputs().activeDate)).toBe(initialActive);
    disabledController.selectDate('2024-04-22');
    expect(disabledController.getOutputs().value).toBeNull();

    const rangeController = createController({
      max: '2024-04-20',
      min: '2024-04-10',
    });
    rangeController.setValue('2024-05-04');
    expect(rangeController.getOutputs().value).toBeNull();
    expect(rangeController.getOutputs().validationError).toBe('out-of-range');

    const beforeDestroy = rangeController.getOutputs().visibleMonth;
    rangeController.destroy();
    rangeController.open();
    rangeController.goToNextMonth();
    expect(rangeController.getOutputs().visibleMonth).toBe(beforeDestroy);
  });
});
