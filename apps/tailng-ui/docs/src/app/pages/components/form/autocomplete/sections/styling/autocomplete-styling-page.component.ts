import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-autocomplete-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './autocomplete-styling-page.component.html',
  styleUrl: './autocomplete-styling-page.component.css',
})
export class AutocompleteStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.country-search[data-slot="autocomplete"] {',
    '  display: grid;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.country-search [data-slot="autocomplete-trigger"] {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.7rem;',
    '  min-height: 2.5rem;',
    '  padding: 0 0.75rem;',
    '}',
    '',
    '.country-search [data-slot="autocomplete-option"][data-active],',
    '.country-search [data-slot="autocomplete-option"][aria-selected="true"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, transparent);',
    '}',
    '',
  ].join('\n');
}
