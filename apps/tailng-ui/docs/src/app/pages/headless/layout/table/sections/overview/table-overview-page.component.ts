import { Component } from '@angular/core';
import {
  TngTable,
  TngTableBody,
  TngTableCell,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableRow,
  TngTableScrollContainer,
} from '@tailng-ui/primitives';

type ReleaseRow = Readonly<{
  owner: string;
  service: string;
  status: string;
}>;

@Component({
  selector: 'app-headless-table-overview-page',
  imports: [
    TngTableScrollContainer,
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
  ],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table overview</h2>
          <p class="docs-overview-lead">
            Headless table adds stable slots, focus management, row ids, sticky metadata, and
            data-state hooks to native table markup.
          </p>
        </section>

        <section id="basic-composition" class="docs-section-anchor docs-overview-block">
          <h3>Basic composition</h3>
          <div
            tngTableScrollContainer
            class="overflow-x-auto rounded-lg border border-tng-border-subtle"
          >
            <table
              tngTable
              ariaLabel="Release queue"
              [items]="rows"
              class="min-w-full border-collapse text-sm"
            >
              <thead tngTableHeader class="bg-tng-bg-muted">
                <tr tngTableRow>
                  <th tngTableHeaderCell scope="col" class="p-3 text-left">Service</th>
                  <th tngTableHeaderCell scope="col" class="p-3 text-left">Owner</th>
                  <th tngTableHeaderCell scope="col" class="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody tngTableBody>
                @for (row of rows; track row.service) {
                  <tr tngTableRow [tngTableRowId]="row.service">
                    <td tngTableCell class="border-t border-tng-border-subtle p-3">
                      {{ row.service }}
                    </td>
                    <td tngTableCell class="border-t border-tng-border-subtle p-3">
                      {{ row.owner }}
                    </td>
                    <td tngTableCell class="border-t border-tng-border-subtle p-3">
                      {{ row.status }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>
              Keep native <code>table</code>, <code>thead</code>, <code>tbody</code>,
              <code>tr</code>, <code>th</code>, and <code>td</code> semantics.
            </li>
            <li>
              Use <code>ariaLabel</code> or <code>ariaLabelledby</code> when the table has no
              visible caption.
            </li>
            <li>Interactive controls inside cells are ignored by row click handling.</li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessTableOverviewPageComponent {
  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];
}
