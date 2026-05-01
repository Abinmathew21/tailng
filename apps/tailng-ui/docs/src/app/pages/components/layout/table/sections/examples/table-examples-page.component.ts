import { Component } from '@angular/core';
import {
  TngTableCellTemplate,
  TngTableComponent,
  type TngTableColumn,
} from '@tailng-ui/components';
import type { TngTableSortChange } from '@tailng-ui/primitives';

type AccountRow = Readonly<{
  health: 'At risk' | 'Healthy' | 'Needs review';
  owner: string;
  plan: string;
  seats: number;
}>;

@Component({
  selector: 'app-table-examples-page',
  imports: [TngTableComponent, TngTableCellTemplate],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="sortable-account-table" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Sortable account table</h2>
          <p class="docs-overview-lead">
            Use sortable column metadata with controlled sort state when the parent owns ordering.
          </p>
          <tng-table
            ariaLabel="Accounts"
            [columns]="columns"
            [items]="rows"
            [sortActive]="sortActive"
            [sortDirection]="sortDirection"
            (sortChange)="onSortChange($event)"
          />
        </section>

        <section id="custom-cell-template" class="docs-section-anchor docs-overview-block">
          <h3>Custom cell template</h3>
          <tng-table
            ariaLabel="Account health"
            [columns]="columns"
            [items]="rows"
            density="compact"
          >
            <ng-template tngTableCellTemplate="health" let-value>
              <span
                class="inline-flex rounded-full border border-tng-border-subtle px-2 py-1 text-xs"
              >
                {{ value }}
              </span>
            </ng-template>
          </tng-table>
        </section>
      </div>
    </article>
  `,
})
export class TableExamplesPageComponent {
  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [
    { id: 'owner', label: 'Owner', sortable: true },
    { id: 'plan', label: 'Plan', sortable: true },
    { id: 'seats', label: 'Seats', align: 'end', sortable: true },
    { id: 'health', label: 'Health' },
  ];

  protected readonly rows: readonly AccountRow[] = [
    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },
    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },
    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },
  ];

  protected sortActive: string | null = 'owner';
  protected sortDirection: 'asc' | 'desc' | null = 'asc';

  protected onSortChange(change: TngTableSortChange): void {
    this.sortActive = change.activeColumnId;
    this.sortDirection = change.direction;
  }
}
