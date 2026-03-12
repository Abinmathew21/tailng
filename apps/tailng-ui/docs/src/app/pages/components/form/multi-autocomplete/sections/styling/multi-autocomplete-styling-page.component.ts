import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-multi-autocomplete-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multi-autocomplete-styling-page.component.html',
  styleUrl: './multi-autocomplete-styling-page.component.css',
})
export class MultiAutocompleteStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.country-tags[data-slot="multi-autocomplete"] {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.4rem;',
    '  border-radius: 0.75rem;',
    '}',
    '',
    '.country-tags [data-slot="multi-autocomplete-chip"] {',
    '  border-radius: 999px;',
    '  font-weight: 600;',
    '}',
    '',
    '.country-tags [data-slot="multi-autocomplete-option"][data-active],',
    '.country-tags [data-slot="multi-autocomplete-option"][data-selected] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, transparent);',
    '}',
    '',
  ].join('\n');
}
