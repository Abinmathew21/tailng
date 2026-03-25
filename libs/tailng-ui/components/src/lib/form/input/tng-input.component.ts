import {
  Component,
  forwardRef,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  coerceTngInputNullableBoolean,
  TngInput,
  type TngInputType,
} from '@tailng-ui/primitives';
import {
  TngFormFieldComponent,
  type TngFormFieldAppearance,
  type TngFormFieldSize,
  type TngFormFieldTone,
} from '../form-field/tng-form-field.component';

type NullableBooleanInput = boolean | null | string | undefined;

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  return value;
}

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
  imports: [TngFormFieldComponent, TngInput],
  templateUrl: './tng-input.component.html',
  styleUrl: './tng-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngInputComponent),
      multi: true,
    },
  ],
})
export class TngInputComponent implements ControlValueAccessor {
  public readonly appearance = input<TngFormFieldAppearance>('outline');
  public readonly size = input<TngFormFieldSize>('md');
  public readonly tone = input<TngFormFieldTone>('neutral');
  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly ariaInvalid = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaRequired = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngInputNullableBoolean,
  });
  public readonly autocomplete = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly id = input<string | null>(null);
  public readonly name = input<string | null>(null);
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
  public readonly inputEvent = output<Event>({ alias: 'input' });
  public readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  private cvaValue: string | null = null;
  private cvaDisabled = false;
  private usingCva = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'input-component' as const;

  @HostBinding('attr.data-appearance')
  protected get dataAppearance(): TngFormFieldAppearance {
    return this.appearance();
  }

  @HostBinding('attr.data-size')
  protected get dataSize(): TngFormFieldSize {
    return this.size();
  }

  @HostBinding('attr.data-tone')
  protected get dataTone(): TngFormFieldTone {
    return this.tone();
  }

  @HostBinding('attr.data-full-width')
  protected get dataFullWidth(): '' | null {
    return this.fullWidth() ? '' : null;
  }

  protected get effectiveValue(): string {
    const value = this.usingCva ? this.cvaValue : this.value();
    return value ?? '';
  }

  protected get effectiveDisabled(): boolean {
    return this.cvaDisabled || this.disabled();
  }

  public writeValue(value: unknown): void {
    this.usingCva = true;
    this.cvaValue = typeof value === 'string' ? value : value == null ? null : String(value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled = isDisabled;
  }

  public onInput(event: unknown): void {
    const value = readTngInputEventValue(event);
    if (value === null) {
      return;
    }

    if (this.usingCva) {
      this.cvaValue = value;
    }

    this.onChange(value);
    this.valueChange.emit(value);
    if (event instanceof Event) {
      this.inputEvent.emit(event);
    }
  }

  public onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurEvent.emit(event);
  }

  protected normalizeAttrValue(value: string | null | undefined): string | null {
    return normalizeStringValue(value);
  }
}
