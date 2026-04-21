import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-stepper-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stepper-styling-page.component.html',
  styleUrls: ['./stepper-styling-page.component.css'],
})
export class HeadlessStepperStylingPageComponent {
  protected readonly cssStarterCode = [
    '[data-slot="stepper"] {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '[data-slot="stepper"] .step[data-state="current"] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '[data-slot="stepper"] .step[data-state="completed"] {',
    '  border-color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '[data-slot="stepper"] .step[data-state="error"] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
  ].join('\n');
}
