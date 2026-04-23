import { describe, expect, it } from 'vitest';
import { createTngRowExpansionController } from './expansion';

describe('createTngRowExpansionController', () => {
  it('toggles expansion for the targeted row only', () => {
    const controller = createTngRowExpansionController<string>();

    controller.toggle('alpha');
    expect(controller.getState().expandedIds).toEqual(['alpha']);

    controller.toggle('beta');
    expect(controller.getState().expandedIds).toEqual(['alpha', 'beta']);

    controller.toggle('alpha');
    expect(controller.getState().expandedIds).toEqual(['beta']);
  });

  it('single mode keeps only one expanded row', () => {
    const controller = createTngRowExpansionController<string>({
      mode: 'single',
    });

    controller.expand('alpha');
    controller.expand('beta');

    expect(controller.getState().expandedIds).toEqual(['beta']);
    expect(controller.isExpanded('alpha')).toBe(false);
  });

  it('preserves expanded ids across reordered row arrays because state is keyed by id', () => {
    const controller = createTngRowExpansionController<string>({
      initialExpandedIds: ['beta'],
    });

    const reorderedIds = ['gamma', 'beta', 'alpha'];

    expect(reorderedIds.filter((id) => controller.isExpanded(id))).toEqual(['beta']);
  });
});
