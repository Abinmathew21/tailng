import { Component } from '@angular/core';
import { TngCodeBlockComponent, TngStepperComponent } from '@tailng-ui/components';
import { TngStepper as TngStepperPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-stepper-overview-page',
  imports: [TngCodeBlockComponent, TngStepperPrimitive, TngStepperComponent],
  templateUrl: './stepper-overview-page.component.html',
  styleUrl: './stepper-overview-page.component.css',
})
export class StepperOverviewPageComponent {
  protected readonly primitiveImportCode = "import { TngStepper } from '@tailng-ui/primitives';";

  protected readonly componentImportCode =
    "import { TngStepperComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<ol tngStepper aria-label="Checkout progress">',
    '  <li data-state="current">',
    '    <span>1</span>',
    '    Shipping details',
    '  </li>',
    '  <li data-state="upcoming">',
    '    <span>2</span>',
    '    Payment method',
    '  </li>',
    '</ol>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-stepper ariaLabel="Release pipeline">',
    '  <ol>',
    '    <li data-state="completed"><span>✓</span> Draft</li>',
    '    <li data-state="current"><span>2</span> Review</li>',
    '    <li data-state="upcoming"><span>3</span> Publish</li>',
    '  </ol>',
    '</tng-stepper>',
    '',
  ].join('\n');
}

