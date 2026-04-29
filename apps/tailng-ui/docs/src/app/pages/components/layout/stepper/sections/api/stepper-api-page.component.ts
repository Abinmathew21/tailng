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
    "protected readonly steps: readonly TngStepperStep[] = [",
    "  { value: 'cart', label: 'Cart', completed: true },",
    "  { value: 'shipping', label: 'Shipping' },",
    "  { value: 'payment', label: 'Payment' },",
    '];',
    '',
    '<tng-stepper ariaLabel="Checkout steps" defaultValue="shipping" [steps]="steps" />',
    '',
  ].join('\n');

  protected readonly componentItemsCode = [
    '<tng-stepper ariaLabel="Checkout steps" defaultValue="shipping" linear>',
    '  <tng-stepper-item value="cart" label="Cart" completed />',
    '  <tng-stepper-item value="shipping" label="Shipping" />',
    '  <tng-stepper-item value="payment" label="Payment" />',
    '</tng-stepper>',
    '',
  ].join('\n');
}
