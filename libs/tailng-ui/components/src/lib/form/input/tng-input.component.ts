import {
  Component,
  forwardRef,
  HostBinding,
  ViewChild,
  input,
  output,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { ElementRef } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  coerceTngInputNullableBoolean,
  TngInput,
  TngSuffix,
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

function normalizeNumberAttr(value: number | string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function readFiniteNumber(value: number | string | null | undefined): number | null {
  if (value === undefined || value === null || value === '') return null;
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatNumberValue(value: number): string {
  return Number.parseFloat(value.toPrecision(12)).toString();
}

function stringifyControlValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  return null;
}

@Component({
  selector: 'tng-input',
  standalone: true,
  imports: [TngFormFieldComponent, TngInput, TngSuffix],
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
  public readonly max = input<number | string | null>(null);
  public readonly min = input<number | string | null>(null);
  public readonly step = input<number | string | null>(null);
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
  @ViewChild('inputControl')
  private readonly inputControl: ElementRef<HTMLInputElement> | undefined;

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

  @HostBinding('attr.data-type')
  protected get dataType(): TngInputType {
    return this.type();
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

  protected get isNumberInput(): boolean {
    return this.type() === 'number';
  }

  // ---- CVA ----
  public writeValue(value: unknown): void {
    this.usingCva = true;
    this.cvaValue = stringifyControlValue(value);
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

    this.commitValue(next, event);
  }

  public stepNumber(delta: -1 | 1): void {
    if (!this.isNumberInput || this.effectiveDisabled || this.readonly()) return;

    const inputElement = this.inputControl?.nativeElement;
    if (inputElement === undefined) return;

    inputElement.focus();

    try {
      if (delta > 0) {
        inputElement.stepUp();
      } else {
        inputElement.stepDown();
      }
    } catch {
      inputElement.value = this.nextSteppedValue(inputElement.value, delta);
    }

    this.commitValue(inputElement.value, null);
  }

  private commitValue(next: string, event: unknown): void {
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

  private nextSteppedValue(currentValue: string, delta: -1 | 1): string {
    const min = readFiniteNumber(this.min());
    const max = readFiniteNumber(this.max());
    const step = readFiniteNumber(this.step()) ?? 1;
    const current = readFiniteNumber(currentValue) ?? min ?? 0;
    const nextStep = step > 0 ? step : 1;
    let next = current + delta * nextStep;

    if (min !== null) next = Math.max(min, next);
    if (max !== null) next = Math.min(max, next);

    return formatNumberValue(next);
  }

  public onBlur(event: unknown): void {
    this.onTouched();
    if (event instanceof FocusEvent) {
      this.blurEvent.emit(event);
    }
  }

  protected normalizeAttrValue(value: string | null | undefined): string | null {
    return normalizeAttr(value);
  }

  protected normalizeNumberAttrValue(value: number | string | null | undefined): string | null {
    return normalizeNumberAttr(value);
  }
}
