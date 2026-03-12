import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-chips-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chips-styling-page.component.html',
  styleUrl: './chips-styling-page.component.css',
})
export class ChipsStylingPageComponent {
  protected readonly stateHooksCode = [
    '[data-slot="chips"] { /* root styles */ }',
    '[data-slot="chip"] { /* token shell */ }',
    '[data-slot="chip-remove"] { /* remove icon/button */ }',
    '',
    '[data-slot="chips"][data-disabled] { opacity: 0.56; }',
    '[data-slot="chip"][data-disabled] { opacity: 0.56; }',
    '[data-slot="chip-remove"][data-focused] { outline: 2px solid var(--brand); }',
    '',
  ].join('\n');

  protected readonly plainCssSnippet = [
    '.my-chip {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 0.5rem;',
    '  border-radius: 999px;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  padding: 0.35rem 0.75rem;',
    '}',
    '',
    '.my-chip-remove {',
    '  border: 0;',
    '  background: transparent;',
    '  cursor: pointer;',
    '}',
    '',
  ].join('\n');
}
