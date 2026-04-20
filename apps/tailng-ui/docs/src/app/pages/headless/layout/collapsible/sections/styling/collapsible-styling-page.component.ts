import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-collapsible-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './collapsible-styling-page.component.html',
  styleUrls: ['./collapsible-styling-page.component.css'],
})
export class HeadlessCollapsibleStylingPageComponent {
  protected readonly cssStarterCode = [
    '[data-slot="collapsible"] {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 1rem;',
    '  overflow: hidden;',
    '}',
    '',
    '[data-slot="collapsible-trigger"] {',
    '  width: 100%;',
    '  border: 0;',
    '  background: var(--tng-semantic-background-surface);',
    '  padding: 0.9rem 1rem;',
    '  text-align: left;',
    '}',
    '',
    '[data-slot="collapsible-content"] {',
    '  border-top: 1px solid var(--tng-semantic-border-subtle);',
    '  padding: 1rem;',
    '  background: var(--tng-semantic-background-muted);',
    '}',
    '',
    "[data-slot='collapsible-trigger'][data-state='open'] {",
    '  color: var(--tng-semantic-foreground-primary);',
    '}',
    '',
  ].join('\n');
}
