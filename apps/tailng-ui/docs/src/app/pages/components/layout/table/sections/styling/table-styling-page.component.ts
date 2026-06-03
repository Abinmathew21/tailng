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

        <section id="row-and-cell-classes" class="docs-section-anchor docs-overview-block">
          <h3>Row and cell styling</h3>
          <p class="docs-overview-lead">
            For data-driven styling, attach your own classes through the
            <code>rowClass</code> input and the column-level <code>cellClass</code> /
            <code>headerClass</code> hooks. For component-scoped dynamic styling, use
            <code>rowStyle</code>, <code>cellStyle</code>, and <code>headerStyle</code>; these apply
            inline styles and CSS custom properties directly to the internal table elements.
          </p>
          <p class="docs-overview-note">
            Class hooks are best for global CSS, Tailwind utilities, or shared library classes.
            Style hooks are the component-CSS-friendly path because Angular scoped styles cannot
            select the table's internal rows and cells without <code>::ng-deep</code>.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Hook</th>
                  <th>Applies to</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>rowClass(row, index)</code></td>
                  <td>Extra classes for each body <code>&lt;tr&gt;</code>, evaluated per row.</td>
                </tr>
                <tr>
                  <td><code>rowStyle(row, index)</code></td>
                  <td>
                    Inline styles/custom properties for each body <code>&lt;tr&gt;</code>. Use
                    <code>--tng-table-row-bg</code> for row backgrounds.
                  </td>
                </tr>
                <tr>
                  <td><code>column.cellClass</code></td>
                  <td>Body cells of one column (static or a <code>(row, value, index)</code> predicate).</td>
                </tr>
                <tr>
                  <td><code>column.cellStyle</code></td>
                  <td>Inline styles for body cells of one column (static or predicate).</td>
                </tr>
                <tr>
                  <td><code>column.headerClass</code></td>
                  <td>The header cell of a leaf or group column.</td>
                </tr>
                <tr>
                  <td><code>column.headerStyle</code></td>
                  <td>Inline styles for a leaf or group header cell.</td>
                </tr>
                <tr>
                  <td><code>[data-group-position]</code></td>
                  <td>
                    Row attribute (<code>first | middle | last | single</code>) for styling
                    <code>groupBy</code> blocks, e.g. dividers between groups.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <pre class="docs-code-block"><code>{{ styleHookExample }}</code></pre>
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

  protected readonly styleHookExample = `// component.ts
protected rowStyle = (row: Order) =>
  row.status === 'overdue'
    ? { '--tng-table-row-bg': 'var(--orders-overdue-row-bg)' }
    : null;

protected columns: TngTableColumn<Order>[] = [
  { id: 'name', label: 'Name' },
  {
    id: 'total',
    label: 'Total',
    align: 'end',
    cellStyle: (_row, value) =>
      Number(value) < 0 ? { color: 'var(--orders-negative-fg)' } : null,
  },
];

/* component.css */
tng-table {
  --orders-overdue-row-bg: color-mix(
    in srgb,
    var(--tng-semantic-accent-danger) 12%,
    var(--tng-semantic-background-surface)
  );
  --orders-negative-fg: var(--tng-semantic-accent-danger);
}
`;
}
