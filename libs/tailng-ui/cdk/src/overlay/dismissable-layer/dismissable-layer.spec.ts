import { describe, expect, it, vi } from 'vitest';
import { createDismissableLayerController } from './dismissable-layer';

describe('createDismissableLayerController', () => {
  it('dismisses highest priority layer first', () => {
    const controller = createDismissableLayerController();
    const lowPriorityDismiss = vi.fn();
    const highPriorityDismiss = vi.fn();

    controller.register({ id: 'low', onDismiss: lowPriorityDismiss, priority: 1 });
    controller.register({ id: 'high', onDismiss: highPriorityDismiss, priority: 2 });
    controller.dismissTop('escape');

    expect(highPriorityDismiss).toHaveBeenCalledWith('escape');
    expect(lowPriorityDismiss).not.toHaveBeenCalled();
  });

  it('removes layer by id', () => {
    const controller = createDismissableLayerController();

    controller.register({ id: 'layer-1', onDismiss: () => undefined });
    controller.unregister('layer-1');

    expect(controller.getLayerIds()).toEqual([]);
  });
});
