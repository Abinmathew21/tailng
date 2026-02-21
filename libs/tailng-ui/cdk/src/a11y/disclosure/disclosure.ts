import {
  type TngDisclosureController,
  type TngDisclosureOptions,
  type TngDisclosureState,
} from './disclosure.types';

class DisclosureController implements TngDisclosureController {
  private disabled: boolean;
  private openState: boolean;

  public constructor(options: TngDisclosureOptions) {
    this.disabled = options.disabled ?? false;
    this.openState = this.disabled ? false : (options.defaultOpen ?? false);
  }

  public close(): boolean {
    this.openState = false;
    return this.openState;
  }

  public getState(): TngDisclosureState {
    return Object.freeze({
      disabled: this.disabled,
      open: this.openState,
    });
  }

  public isOpen(): boolean {
    return this.openState;
  }

  public open(): boolean {
    if (this.disabled) {
      return this.openState;
    }

    this.openState = true;
    return this.openState;
  }

  public setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    if (this.disabled) {
      this.close();
    }
  }

  public toggle(): boolean {
    if (this.disabled) {
      return this.openState;
    }

    if (this.openState) {
      return this.close();
    }

    return this.open();
  }
}

export function createDisclosureController(
  options: TngDisclosureOptions = {},
): TngDisclosureController {
  return new DisclosureController(options);
}
