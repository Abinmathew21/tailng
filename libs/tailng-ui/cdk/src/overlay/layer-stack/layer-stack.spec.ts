import { expect, it, vi } from 'vitest';
import { createOverlayLayerStack } from './layer-stack';

it('orders layers by priority and registration order', () => {
  const stack = createOverlayLayerStack();

  stack.register({ id: 'priority-1a', onDismiss: () => undefined, priority: 1 });
  stack.register({ id: 'priority-0', onDismiss: () => undefined, priority: 0 });
  stack.register({ id: 'priority-1b', onDismiss: () => undefined, priority: 1 });

  expect(stack.getLayerIds()).toEqual(['priority-0', 'priority-1a', 'priority-1b']);
  expect(stack.getTopLayer()?.id).toBe('priority-1b');
});

it('dismisses top layer and dismiss by id', () => {
  const stack = createOverlayLayerStack();
  const firstDismiss = vi.fn();
  const secondDismiss = vi.fn();

  stack.register({ id: 'first', onDismiss: firstDismiss });
  stack.register({ id: 'second', onDismiss: secondDismiss });

  stack.dismissTop('escape-key');
  expect(secondDismiss).toHaveBeenCalledWith('escape-key');
  expect(firstDismiss).not.toHaveBeenCalled();

  stack.dismissById('first', 'programmatic');
  expect(firstDismiss).toHaveBeenCalledWith('programmatic');
});

it('resolves dismiss targets from top layer policies', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    dismissOnEscape: false,
    dismissOnOutsidePointer: false,
    id: 'top',
    onDismiss: () => undefined,
  });

  expect(stack.resolveEscapeDismissTarget()).toBeNull();
  expect(stack.resolveOutsidePointerDismissTarget(null, [])).toBeNull();
});

it('supports top modal lookup', () => {
  const stack = createOverlayLayerStack();

  stack.register({ id: 'base', modal: false, onDismiss: () => undefined });
  stack.register({ id: 'modal', modal: true, onDismiss: () => undefined });
  stack.register({ id: 'tooltip', modal: false, onDismiss: () => undefined });

  expect(stack.getTopModalLayer()?.id).toBe('modal');
});

it('guards nested layers by checking top layer containment', () => {
  const stack = createOverlayLayerStack();

  stack.register({
    id: 'parent',
    onDismiss: () => undefined,
  });
  stack.register({
    containsTarget: (target) => target === 'inside-child',
    id: 'child',
    onDismiss: () => undefined,
  });

  expect(stack.resolveOutsidePointerDismissTarget('inside-child', ['inside-child'])).toBeNull();
  expect(stack.resolveOutsidePointerDismissTarget('outside', ['outside'])?.id).toBe('child');
});

it('ignores unknown unregister and handles replace by id', () => {
  const stack = createOverlayLayerStack();
  const firstDismiss = vi.fn();
  const secondDismiss = vi.fn();

  stack.register({ id: 'layer', onDismiss: firstDismiss, priority: 0 });
  stack.register({ id: 'layer', onDismiss: secondDismiss, priority: 2 });
  stack.unregister('missing');

  expect(stack.getLayerIds()).toEqual(['layer']);
  stack.dismissTop('programmatic');
  expect(firstDismiss).not.toHaveBeenCalled();
  expect(secondDismiss).toHaveBeenCalledWith('programmatic');
});
