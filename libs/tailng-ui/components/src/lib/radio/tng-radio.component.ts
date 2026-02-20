import { booleanAttribute, Component, input, output } from '@angular/core';
import { TngRadio as TngRadioPrimitive } from '@tailng-ui/primitives';

export function readTngRadioChecked(event: Event): boolean | null {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.checked;
}

@Component({
  selector: 'tng-radio',
  imports: [TngRadioPrimitive],
  templateUrl: './tng-radio.component.html',
  styleUrl: './tng-radio.component.css',
})
export class TngRadio {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();

  public onChange(event: Event): void {
    const checked = readTngRadioChecked(event);
    if (checked === null) {
      return;
    }

    this.checkedChange.emit(checked);
  }
}
