import { expect, it, vi } from 'vitest';
import {
  createOverlayInteractionController,
  createOverlayInteractionDocument,
} from './outside-interaction';
import type {
  TngOverlayInteractionDomDocument,
  TngOverlayKeyboardEvent,
  TngOverlayPointerEvent,
} from './outside-interaction.types';
import { createOverlayLayerStack } from '../layer-stack/layer-stack';

type TngFakeDomListeners = Readonly<{
  keydown: Set<(event: unknown) => void>;
  pointerdown: Set<(event: unknown) => void>;
}>;

function createFakeDomDocument(): Readonly<{
  documentRef: TngOverlayInteractionDomDocument;
  listeners: TngFakeDomListeners;
}> {
  const listeners: {
    keydown: Set<(event: unknown) => void>;
    pointerdown: Set<(event: unknown) => void>;
  } = {
    keydown: new Set(),
    pointerdown: new Set(),
  };

  return {
    documentRef: {
      addEventListener: (type, listener): void => {
        listeners[type].add(listener);
      },
      removeEventListener: (type, listener): void => {
        listeners[type].delete(listener);
      },
    },
    listeners,
  };
}

it('dismisses top layer on escape', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({ id: 'layer', onDismiss });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayKeyboardEvent = { key: 'Escape' };
  controller.handleKeydown(event);

  expect(onDismiss).toHaveBeenCalledWith('escape-key');
});

it('dismisses top layer on outside pointer', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => false,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayPointerEvent = { target: 'outside' };
  controller.handlePointerDown(event);

  expect(onDismiss).toHaveBeenCalledWith('outside-pointer');
});

it('ignores inside pointer for top layer', () => {
  const stack = createOverlayLayerStack();
  const onDismiss = vi.fn();
  stack.register({
    containsTarget: () => true,
    id: 'layer',
    onDismiss,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  controller.handlePointerDown({ target: 'inside' });

  expect(onDismiss).not.toHaveBeenCalled();
});

it('start and stop attach listeners through document adapter', () => {
  const stack = createOverlayLayerStack();
  const fakeDocument = createFakeDomDocument();
  const interactionDocument = createOverlayInteractionDocument(fakeDocument.documentRef);
  const controller = createOverlayInteractionController({
    documentRef: interactionDocument,
    layerStack: stack,
  });

  controller.start();
  expect(controller.isStarted()).toBe(true);
  expect(fakeDocument.listeners.keydown.size).toBe(1);
  expect(fakeDocument.listeners.pointerdown.size).toBe(1);

  controller.stop();
  expect(controller.isStarted()).toBe(false);
  expect(fakeDocument.listeners.keydown.size).toBe(0);
  expect(fakeDocument.listeners.pointerdown.size).toBe(0);
});

it('uses composedPath when provided', () => {
  const stack = createOverlayLayerStack();
  const containsTarget = vi.fn(() => false);
  stack.register({
    containsTarget,
    id: 'layer',
    onDismiss: () => undefined,
  });

  const controller = createOverlayInteractionController({ layerStack: stack });
  const event: TngOverlayPointerEvent = {
    composedPath: () => ['a', 'b'],
    target: 'outside',
  };
  controller.handlePointerDown(event);

  expect(containsTarget).toHaveBeenCalledWith('outside', ['a', 'b']);
});
