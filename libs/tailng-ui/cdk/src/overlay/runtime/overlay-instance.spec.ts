import { expect, it, vi } from 'vitest';
import { createOverlayInstance } from './overlay-instance';
import { createOverlayRuntime } from './overlay-runtime';
import type { TngOverlayRect } from '../positioning/positioning.types';

function rect(partial: Partial<TngOverlayRect>): TngOverlayRect {
  return {
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    ...partial,
  };
}

it('registers layer on open and unregisters on close', () => {
  const runtime = createOverlayRuntime();

  const instance = createOverlayInstance({
    id: 'select',
    runtime,
    anchor: { getRect: () => rect({ left: 100, top: 100, width: 100, height: 40 }) },
    floating: {
      getRect: () => rect({ width: 120, height: 200 }),
      applyPosition: () => undefined,
      containsTarget: () => false,
    },
    getViewportRect: () => rect({ left: 0, top: 0, width: 800, height: 600 }),
  });

  expect(runtime.getLayerIds()).toEqual([]);

  instance.open();
  expect(runtime.getLayerIds()).toEqual(['select']);

  instance.close();
  expect(runtime.getLayerIds()).toEqual([]);
});

it('closes when runtime dispatches Escape (top layer)', () => {
  const runtime = createOverlayRuntime();
  const onOpenChange = vi.fn();

  const instance = createOverlayInstance({
    id: 'select',
    runtime,
    anchor: { getRect: () => rect({ left: 100, top: 100, width: 100, height: 40 }) },
    floating: {
      getRect: () => rect({ width: 120, height: 200 }),
      applyPosition: () => undefined,
      containsTarget: () => false,
    },
    getViewportRect: () => rect({ left: 0, top: 0, width: 800, height: 600 }),
    onOpenChange,
  });

  instance.open();
  expect(instance.isOpen()).toBe(true);

  runtime.dispatchKeydown({ key: 'Escape' });

  expect(instance.isOpen()).toBe(false);
  expect(onOpenChange).toHaveBeenCalledWith(false, 'escape-key');
});

it('does not close on outside-pointer when target is contained', () => {
  const runtime = createOverlayRuntime();
  const panel = { id: 'panel' };

  const instance = createOverlayInstance({
    id: 'select',
    runtime,
    anchor: { getRect: () => rect({ left: 0, top: 0, width: 10, height: 10 }) },
    floating: {
      getRect: () => rect({ width: 100, height: 100 }),
      applyPosition: () => undefined,
      containsTarget: (target, path) => target === panel || path.includes(panel),
    },
    getViewportRect: () => rect({ left: 0, top: 0, width: 800, height: 600 }),
  });

  instance.open();
  runtime.dispatchPointerDown({
    target: panel,
    composedPath: () => [panel],
  });

  expect(instance.isOpen()).toBe(true);
  expect(runtime.getLayerIds()).toEqual(['select']);
});

it('applies computed position on open and updatePosition', () => {
  const runtime = createOverlayRuntime();
  const applyPosition = vi.fn();

  const instance = createOverlayInstance({
    id: 'select',
    runtime,
    anchor: { getRect: () => rect({ left: 100, top: 100, width: 100, height: 40 }) },
    floating: {
      getRect: () => rect({ width: 120, height: 200 }),
      applyPosition,
      containsTarget: () => false,
    },
    getViewportRect: () => rect({ left: 0, top: 0, width: 800, height: 600 }),
  });

  instance.open();
  expect(applyPosition).toHaveBeenCalledTimes(1);

  instance.updatePosition();
  expect(applyPosition).toHaveBeenCalledTimes(2);
});