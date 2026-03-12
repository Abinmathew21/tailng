import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-selectbox-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './selectbox-styling-page.component.html',
  styleUrl: './selectbox-styling-page.component.css',
})
export class SelectboxStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.project-select {',
    '  --tng-select-radius: 0.78rem;',
    '  --tng-select-trigger-py: 0.56rem;',
    '  --tng-select-trigger-px: 0.84rem;',
    '}',
    '',
    '.project-select [data-slot="select-trigger"] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-border-subtle) 72%, #0f172a);',
    '}',
    '',
    '.project-select [data-slot="select-option"][data-selected] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);',
    '}',
    '',
    '.project-select [data-slot="select-option"][data-active] {',
    '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 45%, transparent);',
    '}',
    '',
  ].join('\n');
}
