import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  coerceTngInputNullableBoolean,
  TngInput as TngInputPrimitive,
} from '@tailng-ui/primitives';
import type { TngInputType } from '@tailng-ui/primitives';

type NullableBooleanInput = boolean | null | string | undefined;

export function readTngInputEventValue(event: unknown): string | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return target.value;
}

@Component({
  selector: 'tng-input',
  imports: [TngInputPrimitive],
  templateUrl: './tng-input.component.html',
  styleUrl: './tng-input.component.css',
})
export class TngInput {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly placeholder = input<string | null>(null);
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly type = input<TngInputType>('text');
  public readonly value = input<string | null>(null);

  public readonly valueChange = output<string>();

  public onInput(event: unknown): void {
    const value = readTngInputEventValue(event);
    if (value === null) {
      return;
    }

    this.valueChange.emit(value);
  }
}
