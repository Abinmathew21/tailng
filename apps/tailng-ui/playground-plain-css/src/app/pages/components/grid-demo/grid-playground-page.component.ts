import { Component, signal } from '@angular/core';
import {
  TngGridCellComponent,
  TngGridComponent,
  TngGridRowComponent,
} from '@tailng-ui/components';
import {
  TngGrid as TngGridPrimitive,
  TngGridCell as TngGridCellPrimitive,
  type TngGridCellValue,
  TngGridRow as TngGridRowPrimitive,
} from '@tailng-ui/primitives';

type GridCard = Readonly<{
  col: number;
  disabled?: boolean;
  label: string;
  meta: string;
  row: number;
}>;

@Component({
  selector: 'app-grid-playground-page',
  imports: [
    TngGridPrimitive,
    TngGridRowPrimitive,
    TngGridCellPrimitive,
    TngGridComponent,
    TngGridRowComponent,
    TngGridCellComponent,
  ],
  templateUrl: './grid-playground-page.component.html',
  styleUrl: './grid-playground-page.component.css',
})
export class GridPlaygroundPageComponent {
  protected readonly primitiveCards: readonly GridCard[] = [
    { row: 0, col: 0, label: 'Mon', meta: 'Headers' },
    { row: 0, col: 1, label: 'Tue', meta: 'Headers' },
    { row: 0, col: 2, label: 'Wed', meta: 'Headers' },
    { row: 1, col: 0, label: 'Deploy', meta: '08:30 UTC' },
    { row: 1, col: 1, label: 'QA', meta: 'Blocked', disabled: true },
    { row: 1, col: 2, label: 'Docs', meta: 'Ready' },
    { row: 2, col: 0, label: 'Audit', meta: '12:00 UTC' },
    { row: 2, col: 1, label: 'Review', meta: '13:30 UTC' },
    { row: 2, col: 2, label: 'Release', meta: '16:00 UTC' },
  ];

  protected readonly componentCards: readonly GridCard[] = [
    { row: 0, col: 0, label: 'North', meta: 'Region' },
    { row: 0, col: 1, label: 'Central', meta: 'Region' },
    { row: 0, col: 2, label: 'South', meta: 'Region' },
    { row: 1, col: 0, label: 'Capacity', meta: '74%' },
    { row: 1, col: 1, label: 'Incidents', meta: '2 open' },
    { row: 1, col: 2, label: 'Approvals', meta: '5 pending' },
    { row: 2, col: 0, label: 'Backlog', meta: '18 items' },
    { row: 2, col: 1, label: 'Freeze', meta: 'Tonight', disabled: true },
    { row: 2, col: 2, label: 'Ship', meta: 'Green' },
  ];

  protected readonly primitiveSelection = signal<TngGridCellValue | null>(null);
  protected readonly componentSelection = signal<TngGridCellValue | null>(null);

  protected onPrimitiveSelectionChange(value: TngGridCellValue | null): void {
    this.primitiveSelection.set(value);
  }

  protected onComponentSelectionChange(value: TngGridCellValue | null): void {
    this.componentSelection.set(value);
  }

  protected describeSelection(
    cards: readonly GridCard[],
    value: TngGridCellValue | null,
  ): string {
    if (value === null) {
      return 'No cell selected yet';
    }

    const match = cards.find((card) => card.row === value.row && card.col === value.col);
    if (match === undefined) {
      return `Row ${value.row + 1}, column ${value.col + 1}`;
    }

    return `${match.label} · ${match.meta}`;
  }
}
