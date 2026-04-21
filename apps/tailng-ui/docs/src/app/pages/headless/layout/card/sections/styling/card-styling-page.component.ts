import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-card-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './card-styling-page.component.html',
  styleUrl: './card-styling-page.component.css',
})
export class HeadlessCardStylingPageComponent {
  protected readonly cssStarterCode = [
    '[data-slot="card"] {',
    '  display: grid;',
    '  gap: 1rem;',
    '  border-radius: 1rem;',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  background: var(--tng-semantic-background-surface);',
    '  padding: 1rem;',
    '}',
    '',
    '[data-slot="card-media"] {',
    '  overflow: hidden;',
    '  border-radius: 0.75rem;',
    '}',
    '',
    '[data-slot="card-footer"] {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.75rem;',
    '  justify-content: space-between;',
    '}',
    '',
    '[data-slot="card-actions"] {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.5rem;',
    '}',
    '',
  ].join('\n');
}
