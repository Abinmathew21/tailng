import {
  type TngOverlayOpenCloseDelayController,
  type TngOverlayOpenCloseDelayControllerOptions,
} from './open-close-delay.types';

type TimeoutHandle = ReturnType<typeof setTimeout>;

export function normalizeOverlayOpenCloseDelay(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

class OverlayOpenCloseDelayController implements TngOverlayOpenCloseDelayController {
  private closeTimerId: TimeoutHandle | null = null;
  private destroyed = false;
  private openTimerId: TimeoutHandle | null = null;

  public constructor(private readonly options: TngOverlayOpenCloseDelayControllerOptions) {}

  public requestOpen(delayMs: number): void {
    if (this.destroyed) {
      return;
    }

    this.cancelClose();
    const delay = normalizeOverlayOpenCloseDelay(delayMs);
    if (delay === 0) {
      this.cancelOpen();
      this.options.onStateChange(true);
      return;
    }

    this.cancelOpen();
    this.openTimerId = setTimeout(() => {
      this.openTimerId = null;
      if (this.destroyed) {
        return;
      }
      this.options.onStateChange(true);
    }, delay);
  }

  public requestClose(delayMs: number): void {
    if (this.destroyed) {
      return;
    }

    this.cancelOpen();
    const delay = normalizeOverlayOpenCloseDelay(delayMs);
    if (delay === 0) {
      this.cancelClose();
      this.options.onStateChange(false);
      return;
    }

    this.cancelClose();
    this.closeTimerId = setTimeout(() => {
      this.closeTimerId = null;
      if (this.destroyed) {
        return;
      }
      this.options.onStateChange(false);
    }, delay);
  }

  public cancelOpen(): void {
    if (this.openTimerId === null) {
      return;
    }

    clearTimeout(this.openTimerId);
    this.openTimerId = null;
  }

  public cancelClose(): void {
    if (this.closeTimerId === null) {
      return;
    }

    clearTimeout(this.closeTimerId);
    this.closeTimerId = null;
  }

  public cancelAll(): void {
    this.cancelOpen();
    this.cancelClose();
  }

  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.cancelAll();
  }
}

export function createOverlayOpenCloseDelayController(
  options: TngOverlayOpenCloseDelayControllerOptions,
): TngOverlayOpenCloseDelayController {
  return new OverlayOpenCloseDelayController(options);
}
