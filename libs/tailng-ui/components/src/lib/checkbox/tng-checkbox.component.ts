import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngCheckbox as TngCheckboxPrimitive } from '@tailng-ui/primitives';

export type TngCheckboxChange = Readonly<{
  checked: boolean;
  indeterminate: boolean;
}>;

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
export class TngCheckbox {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();
  public readonly indeterminateChange = output<boolean>();

  public onChange(event: unknown): void {
    const change = readTngCheckboxChange(event);
    if (change === null) {
      return;
    }

    this.checkedChange.emit(change.checked);
    this.indeterminateChange.emit(change.indeterminate);
  }
}
