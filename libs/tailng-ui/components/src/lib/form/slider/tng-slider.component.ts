import {
  booleanAttribute,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
  TngSlider as TngSliderPrimitive,
} from '@tailng-ui/primitives';

import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';
import { createFormFieldAdapter } from '../form-field/tng-form-field-adapter';

export function readTngSliderEventValue(event: unknown): number | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return Number(target.value);
}

@Component({
  selector: 'tng-slider',
  imports: [TngSliderPrimitive],
  templateUrl: './tng-slider.component.html',
  styleUrl: './tng-slider.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (cmp: TngSliderComponent) => cmp.formFieldControl,
      deps: [forwardRef(() => TngSliderComponent)],
    },
  ],
})
export class TngSliderComponent {
  private readonly hostEl: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  public readonly valueChange = output<number>();

  /**
   * Form-field integration. The slider's focusable element is its inner
   * `<input type="range" tngSlider>` — label `for=` and aria-describedby are
   * routed there so screen readers announce the slider correctly.
   */
  public readonly formFieldControl: TngFormFieldControl = createFormFieldAdapter({
    hostElement: this.hostEl,
    focusableSelector: 'input[tngSlider]',
    controlKind: 'composite',
    isDisabled: () => this.disabled(),
    isFocused: () => false,
    isInvalid: () => this.invalid(),
    isRequired: () => this.required(),
  });

  public onInput(event: unknown): void {
    const nextValue = readTngSliderEventValue(event);
    if (nextValue === null) {
      return;
    }

    this.valueChange.emit(nextValue);
  }
}
