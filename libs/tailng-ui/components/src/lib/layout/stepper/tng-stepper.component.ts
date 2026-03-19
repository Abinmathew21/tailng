import { Component, input } from '@angular/core';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-stepper',
  imports: [TngStepperPrimitive],
  templateUrl: './tng-stepper.component.html',
  styleUrl: './tng-stepper.component.css',
})
export class TngStepperComponent {
  public readonly ariaLabel = input<string>('Stepper');
}
