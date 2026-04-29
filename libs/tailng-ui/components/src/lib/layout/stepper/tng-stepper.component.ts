import { Component, HostBinding, input } from '@angular/core';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-stepper',
  host: {
    class: 'tng-stepper',
  },
  hostDirectives: [
    {
      directive: TngStepperPrimitive,
      inputs: ['value', 'defaultValue', 'orientation', 'linear', 'loopFocus'],
      outputs: ['valueChange', 'stepChange'],
    },
  ],
  templateUrl: './tng-stepper.component.html',
  styleUrl: './tng-stepper.component.css',
})
export class TngStepperComponent {
  public readonly ariaLabel = input<string | null>('Stepper');
  public readonly ariaLabelledby = input<string | null>(null);

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string | null {
    return this.ariaLabelledby() === null ? this.ariaLabel() : null;
  }

  @HostBinding('attr.aria-labelledby')
  protected get hostAriaLabelledby(): string | null {
    return this.ariaLabelledby();
  }
}
