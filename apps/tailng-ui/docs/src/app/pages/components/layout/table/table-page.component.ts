import { Component } from '@angular/core';
import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';

type ReleaseRow = Readonly<{
  owner: string;
  service: string;
  status: string;
  updated: string;
}>;

@Component({
  selector: 'app-table-page',
  imports: [TngTableComponent],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="overview" class="docs-section-anchor docs-overview-block">
          <h1 class="docs-overview-title">Table</h1>
          <p class="docs-overview-lead">
            The table component renders a styled, accessible data grid from column metadata and row
            objects while keeping custom cell templates available for product-specific content.
          </p>
        </section>

        <section id="basic-usage" class="docs-section-anchor docs-overview-block">
          <h2>Basic usage</h2>
          <tng-table
            ariaLabel="Release services"
            density="comfortable"
            [columns]="columns"
            [items]="rows"
            [stickyHeader]="true"
          />
        </section>

        <section id="api" class="docs-section-anchor docs-overview-block">
          <h2>API notes</h2>
          <ul class="docs-overview-list">
            <li>
              <code>columns</code> define labels, accessors, alignment, widths, truncation, sorting,
              and sticky sides.
            </li>
            <li>
              <code>items</code> is the row source; empty, loading, and error states render built-in
              rows.
            </li>
            <li>
              Use <code>ng-template[tngTableCellTemplate]</code> for custom cells and
              <code>tngTableHeaderTemplate</code> for custom headers.
            </li>
            <li>
              <code>sortChange</code> forwards the primitive sort event for client or server
              sorting.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class TablePageComponent {
  protected readonly columns: readonly TngTableColumn<ReleaseRow>[] = [
    { id: 'service', label: 'Service', sortable: true, sticky: 'start', width: 180 },
    { id: 'owner', label: 'Owner' },
    { id: 'status', label: 'Status' },
    { id: 'updated', label: 'Updated', align: 'end' },
  ];

  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready', updated: '2m ago' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review', updated: '18m ago' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked', updated: '1h ago' },
  ];
}
