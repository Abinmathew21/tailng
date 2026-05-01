import { Component } from '@angular/core';

@Component({
  selector: 'app-headless-pagination-api-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="root-directive" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Headless pagination API</h2>
          <p class="docs-overview-lead">
            <code>tngPagination</code> coordinates page state, page count, disabled state, and
            change events for your custom controls.
          </p>
          <ul class="docs-overview-list">
            <li><code>pageIndex</code>/<code>pageSize</code> create controlled pagination.</li>
            <li>
              <code>defaultPageIndex</code>/<code>defaultPageSize</code> create uncontrolled
              pagination.
            </li>
            <li><code>mode="server"</code> keeps forward movement open for paged API responses.</li>
          </ul>
        </section>

        <section id="movement-buttons" class="docs-section-anchor docs-overview-block">
          <h3>Movement buttons</h3>
          <ul class="docs-overview-list">
            <li><code>button[tngPaginationFirst]</code> moves to the first page.</li>
            <li><code>button[tngPaginationPrevious]</code> moves backward one page.</li>
            <li>
              <code>button[tngPaginationPage]</code> moves to a specific zero-based page index.
            </li>
            <li><code>button[tngPaginationNext]</code> moves forward one page.</li>
            <li><code>button[tngPaginationLast]</code> moves to the last client-side page.</li>
          </ul>
        </section>

        <section id="page-size-select" class="docs-section-anchor docs-overview-block">
          <h3>Page size select</h3>
          <p>
            Apply <code>select[tngPaginationPageSize]</code> to a native select. The directive reads
            the selected value and calls <code>setPageSize()</code> on the pagination root.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessPaginationApiPageComponent {}
