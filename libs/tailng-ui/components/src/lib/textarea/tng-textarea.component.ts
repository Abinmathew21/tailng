import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  coerceTngTextareaNullableBoolean,
  normalizeTngTextareaRows,
  TngTextarea as TngTextareaPrimitive,
} from '@tailng-ui/primitives';

type NullableBooleanInput = boolean | null | string | undefined;

export function readTngTextareaEventValue(event: unknown): string | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement)) {
    return null;
  }

  return target.value;
}

@Component({
  selector: 'tng-textarea',
  imports: [TngTextareaPrimitive],
  templateUrl: './tng-textarea.component.html',
  styleUrl: './tng-textarea.component.css',
})
export class TngTextarea {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
  });
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngTextareaNullableBoolean,
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
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number =>
      normalizeTngTextareaRows(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<string | null>(null);

  public readonly valueChange = output<string>();

  public onInput(event: unknown): void {
    const value = readTngTextareaEventValue(event);
    if (value === null) {
      return;
    }

    this.valueChange.emit(value);
  }
}
