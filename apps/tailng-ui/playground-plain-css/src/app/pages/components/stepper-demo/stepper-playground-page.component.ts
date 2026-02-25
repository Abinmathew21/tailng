import { Component } from '@angular/core';
import { TngStepperComponent } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-playground-page',
  imports: [TngStepperPrimitive, TngStepperComponent],
  templateUrl: './stepper-playground-page.component.html',
  styleUrl: './stepper-playground-page.component.css',
})
export class StepperPlaygroundPageComponent {}
