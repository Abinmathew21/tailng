import { Component } from '@angular/core';
import { TngCodeBlockComponent, TngStepperComponent } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-examples-page',
  imports: [TngCodeBlockComponent, TngStepperComponent, TngStepperPrimitive],
  templateUrl: './stepper-examples-page.component.html',
  styleUrl: './stepper-examples-page.component.css',
})
export class StepperExamplesPageComponent {
  protected readonly checkoutCode = [
    '<ol tngStepper aria-label="Checkout progress">',
    '  <li data-state="completed"><span>✓</span> Cart</li>',
    '  <li data-state="current"><span>2</span> Shipping</li>',
    '  <li data-state="upcoming"><span>3</span> Payment</li>',
    '</ol>',
    '',
  ].join('\n');

  protected readonly releaseCode = [
    '<tng-stepper ariaLabel="Release flow">',
    '  <ol>',
    '    <li data-state="completed"><span>✓</span> Draft</li>',
    '    <li data-state="completed"><span>✓</span> Review</li>',
    '    <li data-state="current"><span>3</span> Publish</li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');

  protected readonly errorCode = [
    '<tng-stepper ariaLabel="Onboarding">',
    '  <ol>',
    '    <li data-state="completed"><span>✓</span> Profile</li>',
    '    <li data-state="error"><span>2</span> Billing</li>',
    '    <li data-state="upcoming"><span>3</span> Team invite</li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');
}

