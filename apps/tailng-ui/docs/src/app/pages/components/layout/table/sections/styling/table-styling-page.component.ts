import { Component } from '@angular/core';

@Component({
  selector: 'app-table-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="state-and-slot-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table styling</h2>
          <p class="docs-overview-lead">
            Table styling is wrapper-first, with stable classes for the scroll shell, generated
            table, header cells, body cells, and state rows.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Hook</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>.tng-table__scroll</code></td>
                  <td>Outer border, radius, background, and scroll behavior.</td>
                </tr>
                <tr>
                  <td><code>.tng-table</code></td>
                  <td>Typography, table layout, width, and density state.</td>
                </tr>
                <tr>
                  <td><code>.tng-table__header-cell</code></td>
                  <td>Header background, sort affordance, focus ring, and sticky presentation.</td>
                </tr>
                <tr>
                  <td><code>.tng-table__cell</code></td>
                  <td>Body cell padding, borders, alignment, truncation, and hover state.</td>
                </tr>
                <tr>
                  <td><code>.tng-table__state-cell</code></td>
                  <td>Loading, error, and empty states.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="css-starter" class="docs-section-anchor docs-overview-block">
          <h3>CSS starter</h3>
          <pre class="docs-code-block"><code>{{ cssStarter }}</code></pre>
        </section>
      </div>
    </article>
  `,
})
export class TableStylingPageComponent {
  protected readonly cssStarter = `tng-table {
  --tng-table-border: var(--tng-semantic-border-subtle);
  --tng-table-radius: 0.75rem;
  --tng-table-cell-px: 1rem;
  --tng-table-cell-py: 0.75rem;
  --tng-table-header-bg: var(--tng-semantic-background-muted);
}`;
}
