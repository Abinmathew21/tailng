import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-multiselect-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './multiselect-styling-page.component.html',
  styleUrl: './multiselect-styling-page.component.css',
})
export class MultiselectStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.project-multiselect {',
    '  --tng-select-radius: 0.78rem;',
    '  --tng-select-trigger-py: 0.56rem;',
    '  --tng-select-trigger-px: 0.84rem;',
    '}',
    '',
    '.project-multiselect [data-slot="select-trigger"] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-border-subtle) 72%, #0f172a);',
    '}',
    '',
    '.project-multiselect [data-slot="multi-select-option"][data-selected] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
    '}',
    '',
    '.project-multiselect [data-slot="multi-select-option"][data-active] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 45%, transparent);',
    '}',
    '',
  ].join('\n');
}
