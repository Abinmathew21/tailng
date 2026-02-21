import {
  type TngOverlayInteractionController,
  type TngOverlayInteractionDocument,
  type TngOverlayInteractionDomDocument,
  type TngOverlayInteractionOptions,
  type TngOverlayKeyboardEvent,
  type TngOverlayPointerEvent,
} from './outside-interaction.types';

function isDefaultPrevented(event: Readonly<{ defaultPrevented?: boolean }>): boolean {
  return event.defaultPrevented === true;
}

function toEventPath(event: TngOverlayPointerEvent): readonly unknown[] {
  const path = event.composedPath?.();
  if (path !== undefined && path.length > 0) {
    return path;
  }

  return [event.target];
}

class OverlayInteractionController implements TngOverlayInteractionController {
  private readonly documentRef: TngOverlayInteractionDocument | null;
  private readonly keydownListener = (event: TngOverlayKeyboardEvent): void => {
    this.handleKeydown(event);
  };
  private readonly pointerDownListener = (event: TngOverlayPointerEvent): void => {
    this.handlePointerDown(event);
  };
  private started = false;

  public constructor(private readonly options: TngOverlayInteractionOptions) {
    this.documentRef = options.documentRef ?? null;
  }

  public handleKeydown(event: TngOverlayKeyboardEvent): void {
    if (event.key !== 'Escape' || isDefaultPrevented(event)) {
      return;
    }

    const dismissLayer = this.options.layerStack.resolveEscapeDismissTarget();
    if (dismissLayer === null) {
      return;
    }

    dismissLayer.onDismiss('escape-key');
    event.preventDefault?.();
  }

  public handlePointerDown(event: TngOverlayPointerEvent): void {
    if (isDefaultPrevented(event)) {
      return;
    }

    const dismissLayer = this.options.layerStack.resolveOutsidePointerDismissTarget(
      event.target,
      toEventPath(event),
    );
    if (dismissLayer === null) {
      return;
    }

    dismissLayer.onDismiss('outside-pointer');
    event.preventDefault?.();
  }

  public isStarted(): boolean {
    return this.started;
  }

  public start(): void {
    if (this.started || this.documentRef === null) {
      return;
    }

    this.started = true;
    this.documentRef.addKeydownListener(this.keydownListener);
    this.documentRef.addPointerDownListener(this.pointerDownListener);
  }

  public stop(): void {
    if (!this.started || this.documentRef === null) {
      return;
    }

    this.started = false;
    this.documentRef.removeKeydownListener(this.keydownListener);
    this.documentRef.removePointerDownListener(this.pointerDownListener);
  }
}

class OverlayDomInteractionDocument implements TngOverlayInteractionDocument {
  private readonly keydownListenerMap = new Map<
    (event: TngOverlayKeyboardEvent) => void,
    (event: unknown) => void
  >();
  private readonly pointerDownListenerMap = new Map<
    (event: TngOverlayPointerEvent) => void,
    (event: unknown) => void
  >();

  public constructor(private readonly documentRef: TngOverlayInteractionDomDocument) {}

  public addKeydownListener(listener: (event: TngOverlayKeyboardEvent) => void): void {
    const domListener = (event: unknown): void => {
      listener(event as TngOverlayKeyboardEvent);
    };
    this.keydownListenerMap.set(listener, domListener);
    this.documentRef.addEventListener('keydown', domListener);
  }

  public addPointerDownListener(listener: (event: TngOverlayPointerEvent) => void): void {
    const domListener = (event: unknown): void => {
      listener(event as TngOverlayPointerEvent);
    };
    this.pointerDownListenerMap.set(listener, domListener);
    this.documentRef.addEventListener('pointerdown', domListener);
  }

  public removeKeydownListener(listener: (event: TngOverlayKeyboardEvent) => void): void {
    const domListener = this.keydownListenerMap.get(listener);
    if (domListener === undefined) {
      return;
    }

    this.keydownListenerMap.delete(listener);
    this.documentRef.removeEventListener('keydown', domListener);
  }

  public removePointerDownListener(listener: (event: TngOverlayPointerEvent) => void): void {
    const domListener = this.pointerDownListenerMap.get(listener);
    if (domListener === undefined) {
      return;
    }

    this.pointerDownListenerMap.delete(listener);
    this.documentRef.removeEventListener('pointerdown', domListener);
  }
}

export function createOverlayInteractionController(
  options: TngOverlayInteractionOptions,
): TngOverlayInteractionController {
  return new OverlayInteractionController(options);
}

export function createOverlayInteractionDocument(
  documentRef: TngOverlayInteractionDomDocument,
): TngOverlayInteractionDocument {
  return new OverlayDomInteractionDocument(documentRef);
}
