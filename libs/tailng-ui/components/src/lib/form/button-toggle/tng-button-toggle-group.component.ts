import {
  Component,
  booleanAttribute,
  input,
  output,
} from '@angular/core';
import {
  TngButtonToggleChangeEvent,
  TngButtonToggleFocusChangeEvent,
  TngButtonToggleGroup as TngButtonToggleGroupPrimitive,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';

type TngButtonToggleDirection = 'auto' | 'ltr' | 'rtl';
type TngButtonToggleOrientation = 'horizontal' | 'vertical';
type TngButtonToggleType = 'multiple' | 'single';
type TngButtonToggleActivationMode = 'auto' | 'manual';

function normalizeOptionalButtonToggleValue(
  value: unknown,
): TngButtonToggleValue | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return String(value);
}

function normalizeOptionalButtonToggleValues(
  value: unknown,
): readonly TngButtonToggleValue[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeOptionalButtonToggleValue(item))
      .filter((item): item is TngButtonToggleValue => item !== null && item !== undefined);
  }

  const normalized = normalizeOptionalButtonToggleValue(value);
  if (normalized === null || normalized === undefined) {
    return [];
  }

  return [normalized];
}

@Component({
  selector: 'tng-button-toggle-group',
  imports: [TngButtonToggleGroupPrimitive],
  templateUrl: './tng-button-toggle-group.component.html',
  styleUrl: './tng-button-toggle-group.component.css',
})
export class TngButtonToggleGroupComponent {
  public readonly ariaLabel = input<string>('Button Toggle Group');

  public readonly type = input<TngButtonToggleType>('single');
  public readonly activation = input<TngButtonToggleActivationMode>('auto');
  public readonly orientation = input<TngButtonToggleOrientation>('horizontal');
  public readonly dir = input<TngButtonToggleDirection>('auto');
  public readonly allowEmpty = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly loop = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  public readonly valueInput = input<TngButtonToggleValue | null | undefined, unknown>(undefined, {
    alias: 'tngButtonToggleValue',
    transform: normalizeOptionalButtonToggleValue,
  });
  public readonly valuesInput = input<readonly TngButtonToggleValue[] | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleValues',
      transform: normalizeOptionalButtonToggleValues,
    },
  );
  public readonly defaultValueInput = input<TngButtonToggleValue | null | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleDefaultValue',
      transform: normalizeOptionalButtonToggleValue,
    },
  );
  public readonly defaultValuesInput = input<readonly TngButtonToggleValue[] | undefined, unknown>(
    undefined,
    {
      alias: 'tngButtonToggleDefaultValues',
      transform: normalizeOptionalButtonToggleValues,
    },
  );

  public readonly valueFallbackInput = input<TngButtonToggleValue | null | undefined, unknown>(
    undefined,
    {
      alias: 'value',
      transform: normalizeOptionalButtonToggleValue,
    },
  );
  public readonly valuesFallbackInput = input<readonly TngButtonToggleValue[] | undefined, unknown>(
    undefined,
    {
      alias: 'values',
      transform: normalizeOptionalButtonToggleValues,
    },
  );
  public readonly defaultValueFallbackInput = input<TngButtonToggleValue | null | undefined, unknown>(
    undefined,
    {
      alias: 'defaultValue',
      transform: normalizeOptionalButtonToggleValue,
    },
  );
  public readonly defaultValuesFallbackInput = input<
    readonly TngButtonToggleValue[] | undefined,
    unknown
  >(undefined, {
    alias: 'defaultValues',
    transform: normalizeOptionalButtonToggleValues,
  });

  public readonly valueChange = output<TngButtonToggleValue | null>();
  public readonly valuesChange = output<readonly TngButtonToggleValue[]>();
  public readonly toggleChange = output<TngButtonToggleChangeEvent>();
  public readonly focusChange = output<TngButtonToggleFocusChangeEvent>();

  protected resolvedValue(): TngButtonToggleValue | null | undefined {
    const explicit = this.valueInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.valueFallbackInput();
  }

  protected resolvedValues(): readonly TngButtonToggleValue[] | undefined {
    const explicit = this.valuesInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.valuesFallbackInput();
  }

  protected resolvedDefaultValue(): TngButtonToggleValue | null | undefined {
    const explicit = this.defaultValueInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.defaultValueFallbackInput();
  }

  protected resolvedDefaultValues(): readonly TngButtonToggleValue[] | undefined {
    const explicit = this.defaultValuesInput();
    if (explicit !== undefined) {
      return explicit;
    }

    return this.defaultValuesFallbackInput();
  }
}
