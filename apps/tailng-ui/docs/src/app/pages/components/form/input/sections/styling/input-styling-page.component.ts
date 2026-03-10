import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-styling-page.component.html',
  styleUrl: './input-styling-page.component.css',
})
export class InputStylingPageComponent {
  protected readonly stylingContractCode = [
    '.demo-group[data-slot="input-group"] {',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  background: var(--tng-semantic-background-surface);',
    '  border-radius: 0.6rem;',
    '  padding: 0 0.75rem;',
    '  min-height: 2.5rem;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  width: 100%;',
    '}',
    '',
    '.demo-group[data-focused] {',
    '  outline: 3px solid var(--tng-semantic-focus-ring);',
    '  outline-offset: 2px;',
    '}',
    '',
    '.demo-group[data-invalid] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '.demo-group[data-disabled] {',
    '  opacity: 0.6;',
    '  cursor: not-allowed;',
    '}',
    '',
    '.demo-group [data-slot="input"] {',
    '  border: 0;',
    '  outline: 0;',
    '  background: transparent;',
    '  width: 100%;',
    '}',
    '',
  ].join('\n');

  protected readonly scopedOverrideCode = [
    '.account-form {',
    '  --tng-semantic-accent-brand: #0f766e;',
    '  --tng-semantic-focus-ring: rgba(15, 118, 110, 0.35);',
    '  --tng-semantic-border-subtle: #99f6e4;',
    '}',
    '',
  ].join('\n');
}
