import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-tooltip-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tooltip-styling-page.component.html',
  styleUrl: './tooltip-styling-page.component.css',
})
export class TooltipStylingPageComponent {
  protected readonly stylingContractCode = [
    '[data-slot="tooltip-trigger"] {',
    '  border-radius: 0.7rem;',
    '  min-height: 2.1rem;',
    '  padding-inline: 0.9rem;',
    '}',
    '',
    '[data-slot="tooltip-trigger"][data-state="open"] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '[data-slot="tooltip-content"] {',
    '  position: absolute;',
    '  z-index: 70;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.7rem;',
    '  padding: 0.45rem 0.62rem;',
    '  pointer-events: none;',
    '}',
    '',
    '[data-slot="tooltip-content"][data-side="top"] {',
    '  bottom: calc(100% + 0.5rem);',
    '  left: 50%;',
    '  transform: translateX(-50%);',
    '}',
    '',
    '[data-slot="tooltip-content"][hidden] {',
    '  display: none !important;',
    '}',
  ].join('\n');
}
