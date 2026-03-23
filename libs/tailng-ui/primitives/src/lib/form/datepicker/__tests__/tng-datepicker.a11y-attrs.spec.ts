import { afterEach, describe, expect, it } from 'vitest';
import { cleanupDom, createController, d, dateKey } from './tng-datepicker.test-helpers';

afterEach(() => {
  cleanupDom();
});

describe('tng-datepicker accessibility block K', () => {
  it('K1/K8 exposes host/trigger/overlay attributes with labels and describedby pass-through', () => {
    const controller = createController({
      ariaDescribedBy: 'helper-id',
      ariaLabel: 'Choose a date',
      ariaLabelledBy: 'heading-id',
    });

    expect(controller.getOutputs().getHostAttributes()).toMatchObject({
      'aria-describedby': 'helper-id',
      'aria-label': 'Choose a date',
      'aria-labelledby': 'heading-id',
      role: 'group',
    });
    expect(controller.getOutputs().getTriggerAttributes()).toMatchObject({
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
    });
    expect(controller.getOutputs().getOverlayAttributes()).toMatchObject({
      role: 'dialog',
    });
  });

  it('K2/K4 uses roving tabindex on the day grid by default', () => {
    const controller = createController({
      today: d('2024-04-18'),
    });

    const cells = controller.getOutputs().cells;
    const activeCells = cells.filter((cell) => cell.tabindex === 0);
    expect(controller.getOutputs().getGridAttributes().role).toBe('grid');
    expect(activeCells).toHaveLength(1);
    expect(dateKey(activeCells[0]?.date as Date)).toBe('2024-04-18');
  });

  it('K3 emits aria-activedescendant when active-descendant focus strategy is enabled', () => {
    const controller = createController({
      focusStrategy: 'active-descendant',
      today: d('2024-04-18'),
    });

    const gridAttrs = controller.getOutputs().getGridAttributes();
    expect(gridAttrs['aria-activedescendant']).toContain('2024-04-18');
  });

  it('K5-K7 expose selected/current/disabled/range markers on cell attributes', () => {
    const controller = createController({
      disableDate: (date) => dateKey(date) === '2024-04-19',
      selectionMode: 'range',
      today: d('2024-04-18'),
      value: {
        end: '2024-04-21',
        start: '2024-04-18',
      },
    });

    const startCell = controller.getOutputs().cells.find((cell) => dateKey(cell.date) === '2024-04-18');
    const disabledCell = controller.getOutputs().cells.find((cell) => dateKey(cell.date) === '2024-04-19');
    const endCell = controller.getOutputs().cells.find((cell) => dateKey(cell.date) === '2024-04-21');

    expect(controller.getOutputs().getCellAttributes(startCell as never)).toMatchObject({
      'aria-current': 'date',
      'aria-selected': 'true',
      'data-range-start': 'true',
    });
    expect(controller.getOutputs().getCellAttributes(disabledCell as never)).toMatchObject({
      'aria-disabled': 'true',
    });
    expect(controller.getOutputs().getCellAttributes(endCell as never)).toMatchObject({
      'data-range-end': 'true',
      'data-in-range': 'true',
    });
  });
});
