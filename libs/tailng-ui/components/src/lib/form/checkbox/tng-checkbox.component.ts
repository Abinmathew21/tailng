import {
  booleanAttribute,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
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

@Component({
  selector: 'tng-checkbox',
  imports: [TngCheckboxPrimitive],
  templateUrl: './tng-checkbox.component.html',
  styleUrl: './tng-checkbox.component.css',
})
export class TngCheckboxComponent implements FormCheckboxControl {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = model<boolean>(false);
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = model<boolean>(false);
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly inputValue = input<string>('on', { alias: 'value' });

  public readonly touchedChange = output<void>();

  private readonly formDisabled = signal(false);

  protected readonly resolvedChecked = computed<boolean>(() => {
    return this.checked();
  });

  protected readonly resolvedDisabled = computed<boolean>(() => {
    return this.formDisabled() || this.disabled();
  });

  protected readonly resolvedIndeterminate = computed<boolean>(() => {
    return this.indeterminate();
  });

  public onBlur(): void {
    this.touchedChange.emit();
  }

  public onChange(event: unknown): void {
    const change = readTngCheckboxChange(event);
    if (change === null) {
      return;
    }

    if (this.readonly() || this.resolvedDisabled()) {
      return;
    }

    const nextChecked = this.resolvedIndeterminate() ? true : change.checked;
    this.checked.set(nextChecked);
    this.indeterminate.set(false);
  }

  public setFormDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
