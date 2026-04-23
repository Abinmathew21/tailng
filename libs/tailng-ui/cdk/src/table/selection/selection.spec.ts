import { describe, expect, it } from 'vitest';
import { createTngRowSelectionController } from './selection';

describe('createTngRowSelectionController', () => {
  it('single mode keeps only one selected id', () => {
    const controller = createTngRowSelectionController<string>({
      mode: 'single',
    });

    controller.select('alpha');
    controller.select('beta');

    expect(controller.getState().selectedIds).toEqual(['beta']);
  });

  it('multiple mode toggles ids on and off', () => {
    const controller = createTngRowSelectionController<string>({
      mode: 'multiple',
    });

    controller.toggle('alpha');
    controller.toggle('beta');
    controller.toggle('alpha');

    expect(controller.getState().selectedIds).toEqual(['beta']);
  });

  it('selectAll selects all ids in multiple mode', () => {
    const controller = createTngRowSelectionController<string>({
      mode: 'multiple',
    });

    controller.selectAll(['alpha', 'beta', 'gamma']);

    expect(controller.getState().selectedIds).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('skips disabled ids when selecting or toggling', () => {
    const controller = createTngRowSelectionController<string>({
      disabledIds: ['beta'],
      mode: 'multiple',
    });

    controller.select('beta');
    controller.toggle('beta');
    controller.selectAll(['alpha', 'beta', 'gamma']);

    expect(controller.getState()).toEqual({
      anchorId: 'gamma',
      mode: 'multiple',
      selectedIds: ['alpha', 'gamma'],
    });
    expect(controller.isDisabled('beta')).toBe(true);
  });

  it('replace clears previous selections before selecting the next row', () => {
    const controller = createTngRowSelectionController<string>({
      initialSelectedIds: ['alpha', 'beta'],
      mode: 'multiple',
    });

    expect(controller.replace('gamma')).toEqual({
      anchorId: 'gamma',
      mode: 'multiple',
      selectedIds: ['gamma'],
    });
  });

  it('supports range selection using ordered ids', () => {
    const controller = createTngRowSelectionController<string>({
      initialSelectedIds: ['beta'],
      initialAnchorId: 'beta',
      mode: 'multiple',
    });

    expect(controller.selectRange('beta', 'delta', ['alpha', 'beta', 'gamma', 'delta'])).toEqual({
      anchorId: 'beta',
      mode: 'multiple',
      selectedIds: ['beta', 'gamma', 'delta'],
    });
  });

  it('preserves selection by id across reordered collections', () => {
    const controller = createTngRowSelectionController<string>({
      initialSelectedIds: ['beta'],
      mode: 'multiple',
    });

    const reorderedIds = ['gamma', 'beta', 'alpha'];
    expect(reorderedIds.filter((id) => controller.isSelected(id))).toEqual(['beta']);
  });
});
