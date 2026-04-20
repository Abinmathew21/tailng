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
    '.context-shell {',
    '  position: relative;',
    '}',
    '',
    '[data-slot="context-menu-trigger"] {',
    '  cursor: context-menu;',
    '}',
    '',
    '.context-shell [data-slot="menu"] {',
    '  left: 0;',
    '  position: absolute;',
    '  top: calc(100% + 0.42rem);',
    '}',
    '',
    '.context-shell [data-slot="menu"][data-state="open"] {',
    '  box-shadow: 0 14px 34px -22px color-mix(in srgb, var(--tng-semantic-foreground-primary) 38%, transparent);',
    '}',
    '',
    '.context-shell [data-slot="menu-item"] {',
    '  border-radius: 0.55rem;',
    '  min-height: 2rem;',
    '  padding: 0.42rem 0.65rem;',
    '}',
    '',
    '.context-shell [data-slot="menu-item"][data-active],',
    '.context-shell [data-slot="menu-item"][aria-expanded="true"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);',
    '}',
    '',
    '.context-shell [data-slot="menu-item"][aria-disabled="true"] {',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');
}
