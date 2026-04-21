import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-stepper-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stepper-api-page.component.html',
  styleUrls: ['./stepper-api-page.component.css'],
})
export class HeadlessStepperApiPageComponent {
  protected readonly usageCode = [
    '<ol tngStepper aria-label="Checkout progress">',
    '  <li aria-current="step" data-state="current">Shipping</li>',
    '  <li data-state="upcoming">Payment</li>',
    '  <li data-state="upcoming">Confirmation</li>',
    '</ol>',
    '',
  ].join('\n');
}
