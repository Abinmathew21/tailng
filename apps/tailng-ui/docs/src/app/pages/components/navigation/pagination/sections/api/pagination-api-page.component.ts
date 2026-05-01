import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-api-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="component-wrapper" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Paginator API</h2>
          <p class="docs-overview-lead">
            Import <code>TngPaginatorComponent</code> from <code>&#64;tailng-ui/components</code>
            for the styled pagination surface.
          </p>
        </section>

        <section id="inputs" class="docs-section-anchor docs-overview-block">
          <h3>Inputs</h3>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>totalItems</code></td>
                  <td><code>number</code></td>
                  <td>Total result count used for range text and client-mode boundaries.</td>
                </tr>
                <tr>
                  <td><code>pageIndex</code>, <code>pageSize</code></td>
                  <td><code>number | undefined</code></td>
                  <td>Controlled page state. Use defaults when the paginator should own state.</td>
                </tr>
                <tr>
                  <td><code>defaultPageIndex</code>, <code>defaultPageSize</code></td>
                  <td><code>number</code></td>
                  <td>Initial uncontrolled state.</td>
                </tr>
                <tr>
                  <td><code>mode</code></td>
                  <td><code>'client' | 'server'</code></td>
                  <td>Server mode keeps next-page movement available for paged API responses.</td>
                </tr>
                <tr>
                  <td><code>pageSizeOptions</code></td>
                  <td><code>readonly number[]</code></td>
                  <td>Options rendered in the rows-per-page select.</td>
                </tr>
                <tr>
                  <td>
                    <code>showFirstLast</code>, <code>showPageSize</code>, <code>showRange</code>
                  </td>
                  <td><code>boolean</code></td>
                  <td>Trim the paginator surface for compact layouts.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="outputs" class="docs-section-anchor docs-overview-block">
          <h3>Outputs</h3>
          <ul class="docs-overview-list">
            <li><code>pageIndexChange</code> emits the next page index.</li>
            <li><code>pageSizeChange</code> emits only when the selected page size changes.</li>
            <li>
              <code>pageChange</code> includes previous values and the trigger that caused the
              change.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class PaginationApiPageComponent {}
