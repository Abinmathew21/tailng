import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-listbox-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './listbox-styling-page.component.html',
  styleUrl: './listbox-styling-page.component.css',
})
export class ListboxStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.project-listbox {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.8rem;',
    '  display: grid;',
    '  gap: 0.45rem;',
    '  outline: none;',
    '  padding: 0.7rem;',
    '}',
    '',
    '.project-listbox:focus {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '.project-listbox [data-selected] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);',
    '}',
    '',
    '.project-listbox [data-active] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '.project-listbox [data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.56;',
    '}',
    '',
  ].join('\n');
}
