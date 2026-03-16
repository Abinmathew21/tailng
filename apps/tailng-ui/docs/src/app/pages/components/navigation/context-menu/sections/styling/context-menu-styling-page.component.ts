import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-context-menu-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './context-menu-styling-page.component.html',
  styleUrls: ['./context-menu-styling-page.component.css'],
})
export class ContextMenuStylingPageComponent {
  protected readonly stylingContractCode = [
    '[tngContextMenuTrigger] {',
    '  cursor: context-menu;',
    '}',
    '',
    '[tngMenu][tngContextMenu][data-state="open"] {',
    '  background: var(--tng-semantic-background-canvas);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.75rem;',
    '  display: grid;',
    '  gap: 0.22rem;',
    '  min-width: 14rem;',
    '  padding: 0.45rem;',
    '}',
    '',
    '[tngMenuItem] {',
    '  border-radius: 0.55rem;',
    '  min-height: 2rem;',
    '  padding: 0.42rem 0.65rem;',
    '}',
    '',
    '[tngMenuItem][data-active],',
    '[tngMenuItem][aria-expanded="true"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);',
    '}',
    '',
    '[tngMenuItem][aria-disabled="true"] {',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');
}
