import type { TngOverlayLayerStack } from '../layer-stack/layer-stack.types';

export type TngOverlayKeyboardEvent = Readonly<{
  defaultPrevented?: boolean;
  key: string;
  preventDefault?: () => void;
}>;

export type TngOverlayPointerEvent = Readonly<{
  composedPath?: () => readonly unknown[];
  defaultPrevented?: boolean;
  preventDefault?: () => void;
  target: unknown;
}>;

export type TngOverlayInteractionDocument = Readonly<{
  addKeydownListener: (listener: (event: TngOverlayKeyboardEvent) => void) => void;
  addPointerDownListener: (listener: (event: TngOverlayPointerEvent) => void) => void;
  addFocusInListener: (listener: (event: TngOverlayFocusEvent) => void) => void;

  removeKeydownListener: (listener: (event: TngOverlayKeyboardEvent) => void) => void;
  removePointerDownListener: (listener: (event: TngOverlayPointerEvent) => void) => void;
  removeFocusInListener: (listener: (event: TngOverlayFocusEvent) => void) => void;
}>;

export type TngOverlayInteractionDomDocument = Readonly<{
  addEventListener: (
    type: 'keydown' | 'pointerdown' | 'focusin',
    listener: (event: unknown) => void,
    options?: boolean | AddEventListenerOptions,
  ) => void;
  removeEventListener: (
    type: 'keydown' | 'pointerdown' | 'focusin',
    listener: (event: unknown) => void,
    options?: boolean | EventListenerOptions,
  ) => void;
}>;

export type TngOverlayInteractionOptions = Readonly<{
  documentRef?: TngOverlayInteractionDocument | null;
  layerStack: TngOverlayLayerStack;
}>;

export type TngOverlayInteractionController = Readonly<{
  handleKeydown: (event: TngOverlayKeyboardEvent) => void;
  handlePointerDown: (event: TngOverlayPointerEvent) => void;
  isStarted: () => boolean;
  start: () => void;
  stop: () => void;
}>;

// outside-interaction.types.ts
export type TngOverlayFocusEvent = Readonly<{
  composedPath?: () => readonly unknown[];
  defaultPrevented?: boolean;
  preventDefault?: () => void;
  target: unknown;
}>;