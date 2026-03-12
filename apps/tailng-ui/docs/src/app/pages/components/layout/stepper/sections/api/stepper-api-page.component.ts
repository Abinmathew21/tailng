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
    '<ol tngStepper aria-label="Release flow">',
    '  <li data-state="completed"><span>✓</span> Draft</li>',
    '  <li data-state="current"><span>2</span> Review</li>',
    '  <li data-state="upcoming"><span>3</span> Publish</li>',
    '</ol>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-stepper ariaLabel="Checkout steps">',
    '  <ol>',
    '    <li data-state="current"><span>1</span> Shipping</li>',
    '    <li data-state="upcoming"><span>2</span> Payment</li>',
    '    <li data-state="upcoming"><span>3</span> Confirmation</li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');
}

