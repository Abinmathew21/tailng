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
  selector: 'app-headless-table-page',
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
        <section id="overview" class="docs-section-anchor docs-overview-block">
          <h1 class="docs-overview-title">Headless Table</h1>
          <p class="docs-overview-lead">
            Table primitives add stable slots, focus management, row ids, sticky metadata, and
            data-state hooks to native table markup without controlling your rendering model.
          </p>
        </section>

        <section id="basic-composition" class="docs-section-anchor docs-overview-block">
          <h2>Basic composition</h2>
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

        <section id="api" class="docs-section-anchor docs-overview-block">
          <h2>API notes</h2>
          <ul class="docs-overview-list">
            <li>
              Use <code>tngTable</code>, <code>tngTableHeader</code>, <code>tngTableBody</code>, and
              row/cell directives on native table elements.
            </li>
            <li>
              <code>items</code>, <code>loading</code>, <code>error</code>, and
              <code>pageable</code> reflect data state attributes.
            </li>
            <li>
              Cells support roving focus plus <code>data-focused</code> and
              <code>data-focus-visible</code> hooks.
            </li>
            <li>Sticky headers and columns are opt-in through section and cell inputs.</li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessTablePageComponent {
  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];
}
