import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-stepper-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stepper-styling-page.component.html',
  styleUrl: './stepper-styling-page.component.css',
})
export class StepperStylingPageComponent {
  protected readonly cssContractCode = [
    'tng-stepper.tng-stepper,',
    '[tngStepper][data-slot="stepper"] {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '[data-slot="stepper-item"][data-state="current"] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);',
    '}',
    '',
    '[data-slot="stepper-item"][data-state="completed"] {',
    '  border-color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '[data-slot="stepper-item"][data-state="error"] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '[data-slot="stepper-trigger"]:focus-visible {',
    '  outline: 2px solid var(--tng-semantic-accent-brand);',
    '  outline-offset: 2px;',
    '}',
    '',
  ].join('\n');
}
