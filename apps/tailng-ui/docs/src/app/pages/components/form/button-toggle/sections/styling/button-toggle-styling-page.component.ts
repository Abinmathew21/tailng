import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-button-toggle-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './button-toggle-styling-page.component.html',
  styleUrl: './button-toggle-styling-page.component.css',
})
export class ButtonToggleStylingPageComponent {
  protected readonly stylingCode = [
    '.toolbar [data-slot="button-toggle-group"] {',
    '  display: inline-flex;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.toolbar [data-slot="button-toggle"][data-selected="true"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '.toolbar [data-slot="button-toggle"][data-disabled="true"] {',
    '  opacity: 0.6;',
    '  pointer-events: none;',
    '}',
    '',
  ].join('\n');
}
