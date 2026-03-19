import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  coerceTngInputNullableBoolean,
  normalizeTngTextareaResize,
  normalizeTngTextareaRows,
  TngInput,
  type TngTextareaResize,
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
  standalone: true,
  selector: 'tng-textarea',
  imports: [TngInput],
  templateUrl: './tng-textarea.component.html',
  styleUrl: './tng-textarea.component.css',
})
export class TngTextareaComponent {
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
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number =>
      normalizeTngTextareaRows(typeof value === 'number' ? value : Number(value)),
  });
  public readonly resize = input<TngTextareaResize, TngTextareaResize | string>('vertical', {
    transform: normalizeTngTextareaResize,
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
