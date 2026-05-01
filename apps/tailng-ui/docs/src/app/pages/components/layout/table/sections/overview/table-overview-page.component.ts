import { Component } from '@angular/core';
import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';

type ReleaseRow = Readonly<{
  owner: string;
  service: string;
  status: string;
}>;

@Component({
  selector: 'app-table-overview-page',
  imports: [TngTableComponent],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table overview</h2>
          <p class="docs-overview-lead">
            The styled table wrapper turns column metadata and row data into an accessible native
            table with sorting hooks, sticky columns, density controls, and state rows.
          </p>
        </section>

        <section id="release-status" class="docs-section-anchor docs-overview-block">
          <h3>Release status</h3>
          <tng-table
            ariaLabel="Release status"
            [columns]="columns"
            [items]="rows"
            stickyHeader
            density="compact"
          />
        </section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>
              Provide <code>ariaLabel</code> or <code>ariaLabelledby</code> when no caption is
              visible.
            </li>
            <li>Use meaningful column labels because sortable headers announce those labels.</li>
            <li>
              Keep cell actions focused and labelled; the wrapper preserves native table semantics.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class TableOverviewPageComponent {
  protected readonly columns: readonly TngTableColumn<ReleaseRow>[] = [
    { id: 'service', label: 'Service', sortable: true },
    { id: 'owner', label: 'Owner' },
    { id: 'status', label: 'Status' },
  ];

  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];
}
