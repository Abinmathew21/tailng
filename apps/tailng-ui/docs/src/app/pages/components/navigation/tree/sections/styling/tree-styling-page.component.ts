import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tree-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tree-styling-page.component.html',
  styleUrl: './tree-styling-page.component.css',
})
export class TreeStylingPageComponent {
  protected readonly primitiveContractCode = [
    '/* Collapse children when parent is not expanded */',
    "[data-slot='tree-item'][data-expanded='false'] > [data-slot='tree-group'] {",
    '  display: none;',
    '}',
    '',
    '/* Selection highlight */',
    "[data-slot='tree-item'][data-selected='true'] {",
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);',
    '  color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '/* Focus ring */',
    "[data-slot='tree-item']:focus-visible {",
    '  box-shadow: 0 0 0 2px var(--tng-semantic-focus-ring);',
    '}',
    '',
    '/* Group indentation */',
    "[data-slot='tree-group'] {",
    '  margin-left: 1.25rem;',
    '  padding-left: 0.75rem;',
    '  border-left: 1px solid var(--tng-semantic-border-subtle);',
    '}',
    '',
  ].join('\n');

  protected readonly componentContractCode = [
    '.tng-tree-shell {',
    '  background: var(--tng-semantic-background-base);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '  padding: 0.75rem;',
    '}',
    '',
    '.tng-tree-item {',
    '  padding-inline-start: calc(0.5rem + (var(--tng-tree-level) * 1rem));',
    '}',
    '',
    '.tng-tree-item-active {',
    '  background: color-mix(in srgb, var(--tng-semantic-focus-ring) 15%, transparent);',
    '}',
    '',
    '.tng-tree-item-selected {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 18%, transparent);',
    '}',
    '',
    '.tng-tree-item-disabled {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');
}
