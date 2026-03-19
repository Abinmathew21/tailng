import {
  booleanAttribute,
  Component,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import {
  coerceTngToggleNullableBoolean,
  TngToggle as TngTogglePrimitive,
  TngToggleGroup as TngToggleGroupPrimitive,
} from '@tailng-ui/primitives';

export function toggleTngToggleState(pressed: boolean): boolean {
  return !pressed;
}

export function resolveTngToggleAriaLabel(
  pressed: boolean,
  pressedLabel: string,
  unpressedLabel: string,
): string {
  return pressed ? pressedLabel : unpressedLabel;
}

type NullableBooleanInput = '' | 'false' | 'true' | boolean | null | undefined;

function normalizeStringValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

const noControlChange = (_value: boolean): void => undefined;
const noControlTouch = (): void => undefined;

function injectParentToggleGroup(): TngToggleGroupPrimitive | null {
  return inject(TngToggleGroupPrimitive, {
    optional: true,
    skipSelf: true,
  });
}

@Component({
  standalone: true,
  selector: 'tng-toggle',
  imports: [TngTogglePrimitive],
  templateUrl: './tng-toggle.component.html',
  styleUrl: './tng-toggle.component.css',
  viewProviders: [
    {
      provide: TngToggleGroupPrimitive,
      useFactory: injectParentToggleGroup,
    },
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TngToggleComponent),
      multi: true,
    },
  ],
})
export class TngToggleComponent implements ControlValueAccessor, OnInit {
  private readonly group = inject(TngToggleGroupPrimitive, {
    optional: true,
    skipSelf: true,
  });
  private readonly internalPressed = signal(false);
  private readonly cvaModeEnabled = signal(false);
  private readonly cvaPressed = signal(false);
  private readonly cvaDisabled = signal(false);

  private onControlChange: (value: boolean) => void = noControlChange;
  private onControlTouched: () => void = noControlTouch;

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly value = input<string | null>(null);

  public readonly pressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngToggleNullableBoolean,
  });
  public readonly defaultPressed = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pressedLabel = input<string>('Enabled');
  public readonly unpressedLabel = input<string>('Disabled');

  public readonly pressedChange = output<boolean>();

  protected readonly resolvedDisabled = computed<boolean>(() => {
    const groupDisabled = this.group?.isGroupDisabled() === true && this.groupManagesState();
    if (this.cvaModeEnabled()) {
      return this.cvaDisabled() || groupDisabled;
    }

    return this.disabled() || groupDisabled;
  });

  protected readonly resolvedPressed = computed<boolean>(() => {
    const groupItemValue = this.groupItemValue();
    if (groupItemValue !== null && this.group !== null) {
      return this.group.isItemSelected(groupItemValue);
    }

    if (this.cvaModeEnabled()) {
      return this.cvaPressed();
    }

    const controlledPressed = this.pressed();
    if (controlledPressed !== null) {
      return controlledPressed;
    }

    return this.internalPressed();
  });

  public constructor() {
    this.internalPressed.set(false);
  }

  public ngOnInit(): void {
    this.internalPressed.set(this.defaultPressed());
  }

  public onBlur(): void {
    this.onControlTouched();
  }

  public onPrimitivePressedChange(nextPressed: boolean): void {
    if (this.resolvedDisabled()) {
      return;
    }

    if (this.cvaModeEnabled()) {
      this.cvaPressed.set(nextPressed);
      this.onControlChange(nextPressed);
    } else if (this.pressed() === null && !this.groupManagesState()) {
      this.internalPressed.set(nextPressed);
    }

    this.pressedChange.emit(nextPressed);
  }

  public getAriaLabel(): string | null {
    const explicitAriaLabel = normalizeStringValue(this.ariaLabel());
    if (explicitAriaLabel !== null) {
      return explicitAriaLabel;
    }

    const labelledby = normalizeStringValue(this.ariaLabelledby());
    if (labelledby !== null) {
      return null;
    }

    return resolveTngToggleAriaLabel(
      this.resolvedPressed(),
      this.pressedLabel(),
      this.unpressedLabel(),
    );
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.cvaModeEnabled.set(true);
    this.onControlChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.cvaModeEnabled.set(true);
    this.onControlTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.cvaModeEnabled.set(true);
    this.cvaDisabled.set(isDisabled);
  }

  public writeValue(value: unknown): void {
    this.cvaModeEnabled.set(true);
    this.cvaPressed.set(value === true);
  }

  private groupItemValue(): string | null {
    return normalizeStringValue(this.value());
  }

  private groupManagesState(): boolean {
    return this.group !== null && this.groupItemValue() !== null;
  }
}
