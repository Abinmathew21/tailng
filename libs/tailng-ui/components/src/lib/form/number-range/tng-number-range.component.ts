import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostBinding,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  isRangeValid,
  normalizeRangeValue,
  parseNumberInput,
  toInputValue,
  type TngNumberRangeChangeEvent,
  type TngNumberRangeSlots,
  type TngNumberRangeSource,
  type TngNumberRangeValue,
} from '@tailng-ui/primitives';

const noOp = (): void => undefined;
const noOpChange = (_v: TngNumberRangeValue): void => undefined;

function normalizeNumberInput(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeStep(
  value: number | string | null | undefined,
): number | string | null {
  if (value === null || value === undefined) return null;
  if (value === 'any') return 'any';
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

@Component({
  selector: 'tng-number-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tng-number-range.component.html',
  styleUrl: './tng-number-range.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngNumberRangeComponent),
      multi: true,
    },
  ],
})
export class TngNumberRangeComponent implements ControlValueAccessor, OnInit {
  // ── Controlled value ──────────────────────────────────────────────────────
  public readonly value = input<TngNumberRangeValue | null>(null);
  public readonly defaultValue = input<TngNumberRangeValue | null>(null);

  // ── Native number constraints ─────────────────────────────────────────────
  public readonly min = input<number | null, number | string | null | undefined>(null, {
    transform: normalizeNumberInput,
  });
  public readonly max = input<number | null, number | string | null | undefined>(null, {
    transform: normalizeNumberInput,
  });
  public readonly step = input<number | string | null, number | string | null | undefined>(null, {
    transform: normalizeStep,
  });

  // ── State ─────────────────────────────────────────────────────────────────
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  // ── Placeholder ───────────────────────────────────────────────────────────
  public readonly minPlaceholder = input<string>('');
  public readonly maxPlaceholder = input<string>('');

  // ── Accessibility ─────────────────────────────────────────────────────────
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly minAriaLabel = input<string>('Minimum');
  public readonly maxAriaLabel = input<string>('Maximum');

  // ── Separator ─────────────────────────────────────────────────────────────
  public readonly separator = input<string>('—');

  // ── Slot / class customization ────────────────────────────────────────────
  public readonly slot = input<Partial<Record<TngNumberRangeSlots, string>>>({});

  // ── Outputs ───────────────────────────────────────────────────────────────
  public readonly valueChange = output<TngNumberRangeValue>();
  public readonly rangeChange = output<TngNumberRangeChangeEvent>();

  // ── Template refs ─────────────────────────────────────────────────────────
  @ViewChild('minInput') private readonly minInputRef?: ElementRef<HTMLInputElement>;

  // ── Internal state ────────────────────────────────────────────────────────
  private readonly internalValue = signal<TngNumberRangeValue>(
    normalizeRangeValue(null),
  );
  private readonly cvaModeEnabled = signal(false);
  private readonly cvaDisabled = signal(false);

  private onCvaChange: (value: TngNumberRangeValue) => void = noOpChange;
  private onCvaTouched: () => void = noOp;

  // ── Derived values ────────────────────────────────────────────────────────

  /**
   * The authoritative current value:
   * - In CVA mode the internal signal owns the value (written by writeValue / handlers).
   * - In controlled mode [value] drives the display; the internal signal tracks changes.
   * - Uncontrolled: internal signal only.
   */
  protected readonly currentValue = computed<TngNumberRangeValue>(() => {
    if (this.cvaModeEnabled()) {
      return this.internalValue();
    }

    const controlled = this.value();
    if (controlled !== null) {
      return normalizeRangeValue(controlled);
    }

    return this.internalValue();
  });

  protected readonly minInputValue = computed(() =>
    toInputValue(this.currentValue().min),
  );

  protected readonly maxInputValue = computed(() =>
    toInputValue(this.currentValue().max),
  );

  protected readonly isValid = computed<boolean>(() => {
    if (this.invalid()) return false;
    return isRangeValid(this.currentValue(), this.min(), this.max());
  });

  // ── HostBindings ──────────────────────────────────────────────────────────
  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.effectiveDisabled ? '' : null;
  }

  @HostBinding('attr.data-readonly')
  protected get dataReadonlyAttr(): '' | null {
    return this.readonly() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalidAttr(): '' | null {
    return !this.isValid() ? '' : null;
  }

  // ── Slot helpers ──────────────────────────────────────────────────────────
  protected slotClass(name: TngNumberRangeSlots): string | null {
    return this.slot()[name] ?? null;
  }

  // ── Computed disabled ─────────────────────────────────────────────────────
  protected get effectiveDisabled(): boolean {
    return this.cvaDisabled() || this.disabled();
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  /** Clicking anywhere in the group (not on an input) focuses the min input. */
  public onGroupClick(event: MouseEvent): void {
    if (this.effectiveDisabled || this.readonly()) return;
    if (!(event.target instanceof HTMLInputElement)) {
      this.minInputRef?.nativeElement.focus();
    }
  }

  public onMinInput(event: Event): void {
    if (this.effectiveDisabled || this.readonly()) return;

    const raw = this.readInputValue(event);
    if (raw === null) return;

    const parsed = parseNumberInput(raw);
    this.commitChange({ ...this.currentValue(), min: parsed }, 'min');
  }

  public onMaxInput(event: Event): void {
    if (this.effectiveDisabled || this.readonly()) return;

    const raw = this.readInputValue(event);
    if (raw === null) return;

    const parsed = parseNumberInput(raw);
    this.commitChange({ ...this.currentValue(), max: parsed }, 'max');
  }

  public onTouched(): void {
    this.onCvaTouched();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  public ngOnInit(): void {
    const dv = this.defaultValue();
    if (dv !== null) {
      this.internalValue.set(normalizeRangeValue(dv));
    }
  }

  // ── CVA ───────────────────────────────────────────────────────────────────
  public writeValue(value: unknown): void {
    this.cvaModeEnabled.set(true);
    this.internalValue.set(normalizeRangeValue(value));
  }

  public registerOnChange(fn: (value: TngNumberRangeValue) => void): void {
    this.cvaModeEnabled.set(true);
    this.onCvaChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.cvaModeEnabled.set(true);
    this.onCvaTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.cvaModeEnabled.set(true);
    this.cvaDisabled.set(isDisabled);
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private readInputValue(event: Event): string | null {
    if (!(event.target instanceof HTMLInputElement)) return null;
    return event.target.value;
  }

  private commitChange(next: TngNumberRangeValue, source: TngNumberRangeSource): void {
    // Update internal state (uncontrolled + CVA mode)
    this.internalValue.set(next);

    const valid = isRangeValid(next, this.min(), this.max()) && !this.invalid();

    // Emit outputs
    this.valueChange.emit(next);
    this.rangeChange.emit({ value: next, source, valid });

    // CVA callback
    if (this.cvaModeEnabled()) {
      this.onCvaChange(next);
    }
  }
}
