import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-stepper-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './stepper-api-page.component.html',
  styleUrl: './stepper-api-page.component.css',
})
export class StepperApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<ol tngStepper aria-label="Release flow" defaultValue="review">',
    '  <li tngStepperItem value="draft" label="Draft" completed>',
    '    <button tngStepperTrigger><span tngStepperLabel>Draft</span></button>',
    '  </li>',
    '  <li tngStepperItem value="review" label="Review">',
    '    <button tngStepperTrigger><span tngStepperLabel>Review</span></button>',
    '  </li>',
    '  <li tngStepperItem value="publish" label="Publish" optional>',
    '    <button tngStepperTrigger><span tngStepperLabel>Publish</span></button>',
    '  </li>',
    '</ol>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-stepper ariaLabel="Checkout steps" defaultValue="shipping" linear>',
    '  <ol>',
    '    <li tngStepperItem value="cart" label="Cart" completed>',
    '      <button tngStepperTrigger><span tngStepperLabel>Cart</span></button>',
    '    </li>',
    '    <li tngStepperItem value="shipping" label="Shipping">',
    '      <button tngStepperTrigger><span tngStepperLabel>Shipping</span></button>',
    '    </li>',
    '    <li tngStepperItem value="payment" label="Payment">',
    '      <button tngStepperTrigger><span tngStepperLabel>Payment</span></button>',
    '    </li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');
}
