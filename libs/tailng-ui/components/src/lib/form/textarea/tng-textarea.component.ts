import { booleanAttribute, Component, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import {
  coerceTngInputNullableBoolean,
  normalizeTngTextareaResize,
  normalizeTngTextareaRows,
  TngInput,
  type TngTextareaResize,
} from '@tailng-ui/primitives';

type NullableBooleanInput = boolean | null | string | undefined;

function normalizeAttr(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

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
  imports: [TngInput],
  templateUrl: './tng-textarea.component.html',
  styleUrl: './tng-textarea.component.css',
})
export class TngTextareaComponent implements FormValueControl<string | null> {
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly id = input<string | null>(null);
  public readonly inputName = input<string | null>(null, { alias: 'name' });
  public readonly placeholder = input<string | null>(null);
  public readonly readonly = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly rows = input<number, number | string>(3, {
    transform: (value: number | string): number =>
      normalizeTngTextareaRows(typeof value === 'number' ? value : Number(value)),
  });
  public readonly resize = input<TngTextareaResize, string>('vertical', {
    transform: normalizeTngTextareaResize,
  });
  public readonly value = model<string | null>(null);

  public onInput(event: unknown): void {
    const value = readTngTextareaEventValue(event);
    if (value === null) {
      return;
    }

    this.value.set(value);
  }

  protected normalizeAttrValue(value: string | null | undefined): string | null {
    return normalizeAttr(value);
  }
}
