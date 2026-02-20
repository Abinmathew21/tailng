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

  it('uses registration order as tie-breaker for equal priority', () => {
    const controller = createDismissableLayerController();
    const firstDismiss = vi.fn();
    const secondDismiss = vi.fn();

    controller.register({ id: 'first', onDismiss: firstDismiss, priority: 1 });
    controller.register({ id: 'second', onDismiss: secondDismiss, priority: 1 });
    controller.dismissTop('outside');

    expect(secondDismiss).toHaveBeenCalledWith('outside');
    expect(firstDismiss).not.toHaveBeenCalled();
  });

  it('exposes layers sorted by priority', () => {
    const controller = createDismissableLayerController();

    controller.register({ id: 'p2', onDismiss: () => undefined, priority: 2 });
    controller.register({ id: 'p0', onDismiss: () => undefined, priority: 0 });
    controller.register({ id: 'p1', onDismiss: () => undefined, priority: 1 });

    expect(controller.getLayerIds()).toEqual(['p0', 'p1', 'p2']);
  });

  it('removes layer by id', () => {
    const controller = createDismissableLayerController();

    controller.register({ id: 'layer-1', onDismiss: () => undefined });
    controller.unregister('layer-1');

    expect(controller.getLayerIds()).toEqual([]);
  });

  it('ignores unregister for unknown ids', () => {
    const controller = createDismissableLayerController();
    controller.register({ id: 'layer-1', onDismiss: () => undefined });

    controller.unregister('missing');
    expect(controller.getLayerIds()).toEqual(['layer-1']);
  });

  it('dismisses next top layer after unregistering current top', () => {
    const controller = createDismissableLayerController();
    const lowPriorityDismiss = vi.fn();
    const highPriorityDismiss = vi.fn();

    controller.register({ id: 'low', onDismiss: lowPriorityDismiss, priority: 1 });
    controller.register({ id: 'high', onDismiss: highPriorityDismiss, priority: 2 });
    controller.unregister('high');
    controller.dismissTop('escape');

    expect(highPriorityDismiss).not.toHaveBeenCalled();
    expect(lowPriorityDismiss).toHaveBeenCalledWith('escape');
  });

  it('is a no-op when dismissing with no layers', () => {
    const controller = createDismissableLayerController();

    expect(() => controller.dismissTop('outside')).not.toThrow();
  });
});
