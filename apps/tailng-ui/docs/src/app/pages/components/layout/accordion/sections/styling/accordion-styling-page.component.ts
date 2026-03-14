import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-accordion-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './accordion-styling-page.component.html',
  styleUrl: './accordion-styling-page.component.css',
})
export class AccordionStylingPageComponent {
  protected readonly cssContractCode = [
    '[data-slot="accordion"] {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '}',
    '',
    '[data-slot="accordion-trigger"][data-state="open"] {',
    '  color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '[data-slot="accordion-item"][data-disabled="true"] {',
    '  opacity: 0.6;',
    '}',
    '',
    '[data-slot="accordion-panel"][data-state="closed"] {',
    '  display: none;',
    '}',
    '',
  ].join('\n');
}
