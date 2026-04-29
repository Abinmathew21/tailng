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
    '<section',
    '  tngStepper',
    '  ariaLabel="Checkout progress"',
    '  defaultValue="shipping"',
    '  linear',
    '  (valueChange)="currentStep = $event"',
    '>',
    '  <ol>',
    '    <li tngStepperItem value="cart" label="Cart" completed>',
    '      <button tngStepperTrigger><span tngStepperLabel>Cart</span></button>',
    '    </li>',
    '    <li tngStepperItem value="shipping" label="Shipping">',
    '      <button tngStepperTrigger>',
    '        <span tngStepperLabel>Shipping</span>',
    '        <span tngStepperDescription>Address and delivery</span>',
    '      </button>',
    '      <section tngStepperPanel>Shipping form</section>',
    '    </li>',
    '  </ol>',
    '</section>',
  ].join('\n');
}
