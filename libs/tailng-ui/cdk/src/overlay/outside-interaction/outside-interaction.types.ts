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

export type TngOverlayFocusEvent = Readonly<{
  composedPath?: () => readonly unknown[];
  defaultPrevented?: boolean;
  preventDefault?: () => void;
  target: unknown;
}>;

export type TngOverlayKeydownListener = (event: TngOverlayKeyboardEvent) => void;
export type TngOverlayPointerDownListener = (event: TngOverlayPointerEvent) => void;
export type TngOverlayFocusInListener = (event: TngOverlayFocusEvent) => void;
export type TngOverlayInteractionDomEventType = 'keydown' | 'pointerdown' | 'focusin';

export type TngOverlayInteractionDomDocument = Readonly<{
  addEventListener: (
    type: TngOverlayInteractionDomEventType,
    listener: (event: unknown) => void,
    options?: boolean,
  ) => void;

  removeEventListener: (
    type: TngOverlayInteractionDomEventType,
    listener: (event: unknown) => void,
    options?: boolean,
  ) => void;
}>;
export type TngOverlayInteractionDocument = Readonly<{
  addKeydownListener: (listener: TngOverlayKeydownListener) => void;
  addPointerDownListener: (listener: TngOverlayPointerDownListener) => void;
  addFocusInListener: (listener: TngOverlayFocusInListener) => void;

  removeKeydownListener: (listener: TngOverlayKeydownListener) => void;
  removePointerDownListener: (listener: TngOverlayPointerDownListener) => void;
  removeFocusInListener: (listener: TngOverlayFocusInListener) => void;
}>;

export type TngOverlayInteractionOptions = Readonly<{
  documentRef?: TngOverlayInteractionDocument | null;
  layerStack: TngOverlayLayerStack;
}>;

export type TngOverlayInteractionController = Readonly<{
  handleKeydown: (event: TngOverlayKeyboardEvent) => void;
  handlePointerDown: (event: TngOverlayPointerEvent) => void;
  handleFocusIn: (event: TngOverlayFocusEvent) => void;
  isStarted: () => boolean;
  start: () => void;
  stop: () => void;
}>;