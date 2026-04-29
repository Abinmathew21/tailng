import { Component, input } from '@angular/core';

@Component({
  selector: 'tng-stepper',
  templateUrl: './tng-stepper.component.html',
  styleUrl: './tng-stepper.component.css',
})
export class TngStepperComponent {
  public readonly ariaLabel = input<string>('Stepper');
}
