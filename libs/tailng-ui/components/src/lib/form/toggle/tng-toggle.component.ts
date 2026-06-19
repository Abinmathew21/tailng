import type {
  OnInit} from '@angular/core';
import {
  booleanAttribute,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import {
  coerceTngToggleNullableBoolean,
  TngToggle as TngTogglePrimitive,
  TngToggleGroup as TngToggleGroupPrimitive,
} from '@tailng-ui/primitives';

import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';

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

function injectParentToggleGroup(): TngToggleGroupPrimitive | null {
  return inject(TngToggleGroupPrimitive, {
    optional: true,
    skipSelf: true,
  });
}

@Component({
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
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngToggleComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngToggleComponent)],
    },
  ],
})
export class TngToggleComponent implements FormCheckboxControl, OnInit {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly group = inject(TngToggleGroupPrimitive, {
    optional: true,
    skipSelf: true,
  });
  private readonly formDisabled = signal(false);

  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaDescribedBy = input<string | null>(null);
  public readonly toggleValue = input<string | null>(null, { alias: 'value' });

  public readonly checked = model<boolean>(false);
  public readonly pressed = input<boolean | null, NullableBooleanInput>(null, {
    transform: coerceTngToggleNullableBoolean,
  });
  public readonly defaultPressed = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly pressedLabel = input<string>('Enabled');
  public readonly unpressedLabel = input<string>('Disabled');

  public readonly pressedChange = output<boolean>();
  public readonly touchedChange = output<void>();

  /**
   * Form-field integration. Toggle focuses on `<button tngToggle>`; label
   * `for=` and aria-describedby route there. When the toggle is inside a
   * `<tng-toggle-group>`, the group typically owns labelling and the toggle's
   * own form-field registration is rarely used.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'button[tngToggle]',
    controlKind: 'inline',
    isDisabled: () => this.resolvedDisabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  protected readonly resolvedDisabled = computed<boolean>(() => {
    const groupDisabled = this.group?.isGroupDisabled() === true && this.groupManagesState();

    return this.formDisabled() || this.disabled() || groupDisabled;
  });

  protected readonly resolvedPressed = computed<boolean>(() => {
    const groupItemValue = this.groupItemValue();
    if (groupItemValue !== null && this.group !== null) {
      return this.group.isItemSelected(groupItemValue);
    }

    const controlledPressed = this.pressed();
    if (controlledPressed !== null) {
      return controlledPressed;
    }

    return this.checked();
  });

  public ngOnInit(): void {
    if (this.pressed() === null && !this.groupManagesState()) {
      this.checked.set(this.defaultPressed());
    }
  }

  public onBlur(): void {
    this.touchedChange.emit();
  }

  public onPrimitivePressedChange(nextPressed: boolean): void {
    if (this.resolvedDisabled()) {
      return;
    }

    if (this.pressed() === null && !this.groupManagesState()) {
      this.checked.set(nextPressed);
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

  public setFormDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  private groupItemValue(): string | null {
    return normalizeStringValue(this.toggleValue());
  }

  private groupManagesState(): boolean {
    return this.group !== null && this.groupItemValue() !== null;
  }
}
