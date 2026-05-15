import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanupDom,
  collectEvents,
  createController,
  dateKey,
} from './tng-date-range-picker.test-helpers';

afterEach(() => {
  cleanupDom();
});

function cell(controller: ReturnType<typeof createController>, key: string) {
  const match = controller.getOutputs().cells.find((candidate) => dateKey(candidate.date) === key);
  if (match === undefined) {
    throw new Error(`Missing cell ${key}`);
  }
  return match;
}

describe('tng-date-range-picker preview and cell state', () => {
  it('sets preview on hover and focus only while selecting an end date', () => {
    const controller = createController();

    controller.handleCellPointerEnter('2024-04-24');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.selectDate('2024-04-20');
    controller.handleCellPointerEnter('2024-04-24');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-24');

    controller.setActiveDate('2024-04-22', 'keyboard');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-22');

    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.handleCellPointerEnter('2024-04-26');
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });

  it('previews forward, reverse, and same-day ranges without emitting value changes', () => {
    const controller = createController();
    const events = collectEvents(controller);

    controller.selectDate('2024-04-20');
    controller.handleCellPointerEnter('2024-04-24');
    expect(cell(controller, '2024-04-20').previewRange).toBe(true);
    expect(cell(controller, '2024-04-22').previewRange).toBe(true);
    expect(cell(controller, '2024-04-24').previewRange).toBe(true);
    expect(
      controller.getOutputs().getCellAttributes(cell(controller, '2024-04-24'))[
        'data-preview-end'
      ],
    ).toBe('true');

    controller.handleCellPointerEnter('2024-04-18');
    expect(
      controller.getOutputs().getCellAttributes(cell(controller, '2024-04-24'))[
        'data-preview-end'
      ],
    ).toBeUndefined();
    expect(
      controller.getOutputs().getCellAttributes(cell(controller, '2024-04-18'))[
        'data-preview-end'
      ],
    ).toBe('true');
    expect(cell(controller, '2024-04-18').previewRange).toBe(true);
    expect(cell(controller, '2024-04-19').previewRange).toBe(true);
    expect(cell(controller, '2024-04-20').previewRange).toBe(true);

    controller.handleCellPointerEnter('2024-04-20');
    expect(controller.getOutputs().cells.filter((candidate) => candidate.previewRange)).toHaveLength(1);
    expect(
      controller.getOutputs().getCellAttributes(cell(controller, '2024-04-20'))[
        'data-preview-end'
      ],
    ).toBe('true');

    const valueEvents = events.filter((event) => event.type === 'valueChange');
    expect(valueEvents).toHaveLength(1);
    const previewEvents = events.filter((event) => event.type === 'previewChange');
    expect(previewEvents).toHaveLength(3);
    expect(dateKey(previewEvents[0].previewEndDate)).toBe('2024-04-24');
    expect(dateKey(previewEvents[1].previewEndDate)).toBe('2024-04-18');
    expect(dateKey(previewEvents[2].previewEndDate)).toBe('2024-04-20');
  });

  it('does not preview disabled or out-of-range dates and updates preview on each hover', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-23',
      max: '2024-04-24',
      min: '2024-04-18',
    });

    controller.selectDate('2024-04-20');
    controller.handleCellPointerEnter('2024-04-17');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.handleCellPointerEnter('2024-04-25');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.handleCellPointerEnter('2024-04-23');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.handleCellPointerEnter('2024-04-21');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-21');

    controller.handleCellPointerEnter('2024-04-22');
    expect(dateKey(controller.getOutputs().previewEndDate as Date)).toBe('2024-04-22');
  });

  it('clears preview when popup closes, range completes, or external value changes', () => {
    const controller = createController({
      value: { end: null, start: '2024-04-20' },
    });

    controller.open();
    controller.handleCellPointerEnter('2024-04-24');
    controller.close('programmatic');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.handleCellPointerEnter('2024-04-24');
    controller.selectDate('2024-04-24');
    expect(controller.getOutputs().previewEndDate).toBeNull();

    controller.selectDate('2024-04-26');
    controller.handleCellPointerEnter('2024-04-28');
    controller.setValue({ end: null, start: '2024-05-10' });
    expect(controller.getOutputs().previewEndDate).toBeNull();
  });

  it('marks selected range start, end, middle, same-day, today, disabled, and outside-month cells', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-26',
      value: { end: '2024-04-24', start: '2024-04-20' },
    });
    const outputs = controller.getOutputs();

    expect(outputs.getCellAttributes(cell(controller, '2024-04-20'))['data-range-start']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-04-24'))['data-range-end']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-04-22'))['data-in-range']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-04-20'))['data-in-range']).toBeUndefined();
    expect(outputs.getCellAttributes(cell(controller, '2024-04-24'))['data-in-range']).toBeUndefined();
    expect(outputs.getCellAttributes(cell(controller, '2024-04-18'))['data-today']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-04-26'))['data-disabled']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-03-31'))['data-outside-month']).toBe('true');
    expect(outputs.getCellAttributes(cell(controller, '2024-04-20')).role).toBe('gridcell');

    controller.setValue({ end: '2024-04-20', start: '2024-04-20' });
    const sameDayAttributes = controller.getOutputs().getCellAttributes(cell(controller, '2024-04-20'));
    expect(sameDayAttributes['data-range-start']).toBe('true');
    expect(sameDayAttributes['data-range-end']).toBe('true');
  });

  it('updates cell states when value, month, and preview changes are applied', () => {
    const controller = createController();

    controller.setValue({ end: '2024-04-24', start: '2024-04-20' });
    expect(cell(controller, '2024-04-22').inRange).toBe(true);

    controller.clear();
    expect(cell(controller, '2024-04-22').inRange).toBe(false);
    expect(cell(controller, '2024-04-20').rangeStart).toBe(false);
    expect(cell(controller, '2024-04-24').rangeEnd).toBe(false);

    controller.setValue({ end: null, start: '2024-05-10' });
    controller.setVisibleMonth('2024-05-01');
    controller.handleCellPointerEnter('2024-05-14');
    expect(cell(controller, '2024-05-12').previewRange).toBe(true);
  });
});
