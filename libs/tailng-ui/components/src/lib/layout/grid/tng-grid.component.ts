import { Component } from '@angular/core';
import {
  TngGrid as TngGridPrimitive,
  TngGridCell as TngGridCellPrimitive,
  TngGridRow as TngGridRowPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-grid',
  hostDirectives: [
    {
      directive: TngGridPrimitive,
      inputs: [
        'ariaLabel',
        'ariaColcount',
        'ariaRowcount',
        'dir',
        'focusCol',
        'focusRow',
        'selectionMode',
        'value',
        'defaultValue',
        'wrap',
      ],
      outputs: ['focusRowChange', 'focusColChange', 'focusChange', 'valueChange', 'cellActivate'],
    },
  ],
  templateUrl: './tng-grid.component.html',
  styleUrl: './tng-grid.component.css',
  exportAs: 'tngGridComponent',
})
export class TngGridComponent {}

@Component({
  selector: 'tng-grid-row',
  hostDirectives: [TngGridRowPrimitive],
  template: '<ng-content />',
  styles: `
    :host {
      display: grid;
      gap: var(--tng-grid-gap, 0.75rem);
      grid-auto-columns: minmax(0, 1fr);
      grid-auto-flow: column;
    }
  `,
  exportAs: 'tngGridRowComponent',
})
export class TngGridRowComponent {}

@Component({
  selector: 'tng-grid-cell',
  hostDirectives: [
    {
      directive: TngGridCellPrimitive,
      inputs: ['rowIndex', 'colIndex', 'rowSpan', 'colSpan', 'disabled', 'selected', 'cellRole'],
    },
  ],
  template: '<ng-content />',
  styles: `
    :host {
      align-items: center;
      background: var(--tng-semantic-background-surface);
      border: 1px solid var(--tng-semantic-border-subtle);
      border-radius: 0.75rem;
      color: var(--tng-semantic-foreground-primary);
      cursor: pointer;
      display: flex;
      gap: 0.35rem;
      justify-content: flex-start;
      min-height: 3rem;
      outline: none;
      padding: 0.75rem 0.9rem;
      transition:
        border-color 160ms ease,
        box-shadow 160ms ease,
        transform 160ms ease;
    }

    :host([data-selected]) {
      background: color-mix(in srgb, var(--tng-semantic-background-surface) 78%, var(--tng-semantic-color-primary) 22%);
      border-color: color-mix(in srgb, var(--tng-semantic-border-subtle) 45%, var(--tng-semantic-color-primary) 55%);
    }

    :host([data-focus-visible]) {
      border-color: color-mix(in srgb, var(--tng-semantic-border-subtle) 30%, var(--tng-semantic-color-primary) 70%);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--tng-semantic-color-primary) 22%, transparent);
    }

    :host([data-activated]) {
      transform: translateY(-1px);
    }

    :host([data-disabled]) {
      cursor: not-allowed;
      opacity: 0.55;
    }

    :host([role='columnheader']),
    :host([role='rowheader']) {
      background: color-mix(in srgb, var(--tng-semantic-background-surface) 82%, var(--tng-semantic-background-base) 18%);
      font-weight: 600;
    }
  `,
  exportAs: 'tngGridCellComponent',
})
export class TngGridCellComponent {}
