import { Component } from '@angular/core';
import { TngStepper } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-playground-page',
  imports: [TngStepperPrimitive, TngStepper],
  templateUrl: './stepper-playground-page.component.html',
  styleUrl: './stepper-playground-page.component.css',
})
export class StepperPlaygroundPageComponent {}
