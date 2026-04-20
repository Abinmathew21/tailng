import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-accordion-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './accordion-styling-page.component.html',
  styleUrls: ['./accordion-styling-page.component.css'],
})
export class HeadlessAccordionStylingPageComponent {
  protected readonly cssStarterCode = [
    '[data-slot="accordion"] {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 1rem;',
    '  overflow: hidden;',
    '}',
    '',
    '[data-slot="accordion-trigger"] {',
    '  width: 100%;',
    '  text-align: left;',
    '}',
    '',
    '[data-slot="accordion-trigger"][data-state="open"] {',
    '  color: var(--tng-semantic-foreground-primary);',
    '}',
    '',
    '[data-slot="accordion-panel"][data-mounted="false"] {',
    '  display: none;',
    '}',
    '',
    '[data-slot="accordion-item"][data-disabled="true"] {',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');
}
