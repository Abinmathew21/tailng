import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-card-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './card-styling-page.component.html',
  styleUrl: './card-styling-page.component.css',
})
export class CardStylingPageComponent {
  protected readonly cssContractCode = [
    '[data-slot="card"] {',
    '  display: grid;',
    '  gap: 0.85rem;',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 1rem;',
    '}',
    '',
    '[data-slot="card"][data-variant="outline"] {',
    '  background: var(--tng-semantic-background-canvas);',
    '}',
    '',
    '[data-slot="card"][data-tone="primary"] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 40%, var(--tng-semantic-border-strong));',
    '}',
    '',
    '[data-slot="card"][data-interactive]:hover {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '[data-slot="card-actions"][data-align="start"] {',
    '  justify-content: flex-start;',
    '}',
    '',
    '[data-slot="card-link"][aria-disabled="true"] {',
    '  opacity: 0.65;',
    '  pointer-events: none;',
    '}',
    '',
  ].join('\n');
}
