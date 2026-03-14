import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-collapsible-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './collapsible-styling-page.component.html',
  styleUrl: './collapsible-styling-page.component.css',
})
export class CollapsibleStylingPageComponent {
  protected readonly cssContractCode = [
    '[data-slot="collapsible"] {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '[data-slot="collapsible"] [data-state="current"] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);',
    '}',
    '',
    '[data-slot="collapsible"] [data-state="completed"] {',
    '  border-color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '[data-slot="collapsible"] [data-state="error"] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
  ].join('\n');
}

