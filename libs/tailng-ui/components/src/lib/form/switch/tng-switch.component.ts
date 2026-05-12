import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { TngSwitch as TngSwitchPrimitive } from '@tailng-ui/primitives';

import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';
import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';

type TngSwitchKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

export function toggleTngSwitchState(checked: boolean): boolean {
  return !checked;
}

export function resolveTngSwitchArrowKey(key: string): boolean | null {
  if (key === 'ArrowLeft') {
    return false;
  }

  if (key === 'ArrowRight') {
    return true;
  }

  return null;
}

@Component({
  selector: 'tng-switch',
  imports: [TngSwitchPrimitive],
  templateUrl: './tng-switch.component.html',
  styleUrl: './tng-switch.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngSwitchComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngSwitchComponent)],
    },
  ],
})
export class TngSwitchComponent {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly ariaLabel = input<string | null>(null);
  public readonly checked = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly name = input<string | null>(null);
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly value = input<string>('on');

  public readonly checkedChange = output<boolean>();

  /**
   * Form-field integration. Exposed via `TNG_FORM_FIELD_CONTROL` so wrapping
   * the switch in `<tng-form-field>` automatically routes label and ARIA
   * wiring to the inner `<button tngSwitch>` (the actual focusable element).
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'button[tngSwitch]',
    controlKind: 'inline',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public onKeydown(event: TngSwitchKeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const nextValue = resolveTngSwitchArrowKey(event.key);
    if (nextValue === null || nextValue === this.checked()) {
      return;
    }

    event.preventDefault();
    this.checkedChange.emit(nextValue);
  }

  public onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.checkedChange.emit(toggleTngSwitchState(this.checked()));
  }
}
