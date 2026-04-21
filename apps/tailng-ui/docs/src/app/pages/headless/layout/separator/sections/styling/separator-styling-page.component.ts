import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-separator-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './separator-styling-page.component.html',
  styleUrl: './separator-styling-page.component.css',
})
export class HeadlessSeparatorStylingPageComponent {
  protected readonly cssStarterCode = [
    '[data-slot="separator"] {',
    '  background: var(--tng-semantic-border-strong);',
    '  display: block;',
    '}',
    '',
    '[data-slot="separator"][data-orientation="horizontal"] {',
    '  block-size: 1px;',
    '  inline-size: 100%;',
    '}',
    '',
    '[data-slot="separator"][data-orientation="vertical"] {',
    '  inline-size: 1px;',
    '  min-block-size: 1rem;',
    '}',
    '',
    '.toolbar [data-slot="separator"] {',
    '  margin-inline: 0.5rem;',
    '}',
    '',
  ].join('\n');
}
