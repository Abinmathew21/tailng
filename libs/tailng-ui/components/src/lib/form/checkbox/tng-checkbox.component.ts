import {
  booleanAttribute,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';

export type TngCheckboxChange = Readonly<{
  checked: boolean;
  indeterminate: boolean;
}>;

export type TngCheckboxModelValue = 'mixed' | boolean;

export function coerceTngCheckboxModelValue(value: unknown): TngCheckboxChange {
  if (value === 'mixed') {
    return { checked: false, indeterminate: true };
  }

  if (value === true) {
    return { checked: true, indeterminate: false };
  }

  return { checked: false, indeterminate: false };
}

export function readTngCheckboxChange(event: unknown): TngCheckboxChange | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return {
    checked: target.checked,
    indeterminate: target.indeterminate,
  };
}

const noControlChange = (_value: TngCheckboxModelValue): void => undefined;
const noControlTouch = (): void => undefined;

@Component({
  selector: 'tng-checkbox',
  imports: [TngCheckboxPrimitive],
  templateUrl: './tng-checkbox.component.html',
  styleUrl: './tng-checkbox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngCheckboxComponent),
      multi: true,
    },
  ],
})
export class TngCheckboxComponent implements ControlValueAccessor {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();
  public readonly indeterminateChange = output<boolean>();

  private readonly internalChecked = signal(false);
  private readonly internalIndeterminate = signal(false);
  private readonly cvaModeEnabled = signal(false);
  private readonly cvaDisabled = signal(false);

  private onControlChange: (value: TngCheckboxModelValue) => void = noControlChange;
  private onControlTouched: () => void = noControlTouch;

  protected readonly resolvedChecked = computed<boolean>(() => {
    if (this.cvaModeEnabled()) {
      return this.internalChecked();
    }

    return this.checked();
  });

  protected readonly resolvedDisabled = computed<boolean>(() => {
    if (this.cvaModeEnabled()) {
      return this.cvaDisabled();
    }

    return this.disabled();
  });

  protected readonly resolvedIndeterminate = computed<boolean>(() => {
    if (this.cvaModeEnabled()) {
      return this.internalIndeterminate();
    }

    return this.indeterminate();
  });

  public constructor() {
    effect(
      () => {
        if (this.cvaModeEnabled()) {
          return;
        }

        this.internalChecked.set(this.checked());
        this.internalIndeterminate.set(this.indeterminate());
      },
      { allowSignalWrites: true },
    );
  }

  public onBlur(): void {
    this.onControlTouched();
  }

  public onChange(event: unknown): void {
    const change = readTngCheckboxChange(event);
    if (change === null) {
      return;
    }

    if (this.readonly() || this.resolvedDisabled()) {
      return;
    }

    this.internalChecked.set(change.checked);
    this.internalIndeterminate.set(change.indeterminate);

    this.checkedChange.emit(change.checked);
    this.indeterminateChange.emit(change.indeterminate);
    this.onControlChange(change.indeterminate ? 'mixed' : change.checked);
  }

  public registerOnChange(fn: (value: TngCheckboxModelValue) => void): void {
    this.cvaModeEnabled.set(true);
    this.onControlChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.cvaModeEnabled.set(true);
    this.onControlTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.cvaModeEnabled.set(true);
    this.cvaDisabled.set(isDisabled);
  }

  public writeValue(value: unknown): void {
    this.cvaModeEnabled.set(true);
    const normalized = coerceTngCheckboxModelValue(value);
    this.internalChecked.set(normalized.checked);
    this.internalIndeterminate.set(normalized.indeterminate);
  }
}
