import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngStepper } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-playground-page',
  imports: [RouterLink, TngStepperPrimitive, TngStepper],
  templateUrl: './stepper-playground-page.component.html',
  styleUrl: './stepper-playground-page.component.css',
})
export class StepperPlaygroundPageComponent {}
