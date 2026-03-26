import {
  Component,
  forwardRef,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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

function normalizeAttr(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const v = value.trim();
  return v.length > 0 ? v : null;
}

function readInputValue(event: unknown): string | null {
  if (!(event instanceof Event)) return null;
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return null;
  return target.value;
}

@Component({
  selector: 'tng-input',
  standalone: true,
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
  // ---- Wrapper (form-field) appearance knobs ----
  public readonly appearance = input<TngFormFieldAppearance>('outline');
  public readonly size = input<TngFormFieldSize>('md');
  public readonly tone = input<TngFormFieldTone>('neutral');
  public readonly fullWidth = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  // ---- Input API passthrough ----
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

  /**
   * Controlled value input (only used when NOT using CVA).
   * If you bind [value], you should also listen to (valueChange) (or use signals).
   */
  public readonly value = input<string | null>(null);

  // ---- Outputs ----
  public readonly valueChange = output<string>();
  public readonly inputEvent = output<Event>({ alias: 'input' });
  public readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  // ---- CVA state ----
  private usingCva = false;
  private cvaValue: string | null = null;
  private cvaDisabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  // ---- Host attrs (optional, useful for styling/debug) ----
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

  // ---- Derived values for template ----
  protected get effectiveValue(): string {
    const v = this.usingCva ? this.cvaValue : this.value();
    return v ?? '';
  }

  protected get effectiveDisabled(): boolean {
    return this.cvaDisabled || this.disabled();
  }

  // ---- CVA ----
  public writeValue(value: unknown): void {
    this.usingCva = true;
    this.cvaValue =
      typeof value === 'string'
        ? value
        : value == null
          ? null
          : String(value);
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

  // ---- DOM handlers ----
  public onInput(event: unknown): void {
    const next = readInputValue(event);
    if (next === null) return;

    // If disabled, ignore (optional safety)
    if (this.effectiveDisabled) return;

    // Keep CVA in sync when used
    if (this.usingCva) {
      if (this.cvaValue === next) {
        // Still forward the raw event output if you want:
        if (event instanceof Event) this.inputEvent.emit(event);
        return;
      }
      this.cvaValue = next;
      this.onChange(next);
    }

    // For controlled-input usage, emit valueChange always
    this.valueChange.emit(next);

    if (event instanceof Event) {
      this.inputEvent.emit(event);
    }
  }

  public onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurEvent.emit(event);
  }

  protected normalizeAttrValue(value: string | null | undefined): string | null {
    return normalizeAttr(value);
  }
}