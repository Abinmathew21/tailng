import { Component } from '@angular/core';

@Component({
  selector: 'app-table-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="state-and-slot-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table styling</h2>
          <p class="docs-overview-lead">
            Table styling is wrapper-first. Use CSS variables for component-scoped layout changes
            such as scroll height, overflow, table width, and header background. Use stable
            <code>data-slot</code> hooks for shared global CSS.
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
                  <td><code>[data-slot='table-scroll']</code></td>
                  <td>
                    Outer border, radius, background, max height, and scroll wrapper state. Reflects
                    <code>data-scroll-axis</code> and <code>data-sticky-header</code>.
                  </td>
                </tr>
                <tr>
                  <td><code>[data-slot='table']</code></td>
                  <td>Typography, table layout, min width, density, and hover mode state.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='table-header-cell']</code></td>
                  <td>Header background, sort affordance, focus ring, and sticky presentation.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='table-cell']</code></td>
                  <td>Body cell padding, borders, alignment, truncation, and hover state.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='table-state-cell']</code></td>
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
                  <td>
                    Body cells of one column (static or a
                    <code>(row, value, index)</code> predicate).
                  </td>
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

        <section id="scroll-and-sizing" class="docs-section-anchor docs-overview-block">
          <h3>Scroll and sizing</h3>
          <p class="docs-overview-lead">
            <code>scrollAxis</code> enables the primitive scroll axes. CSS variables define the
            wrapper constraints and the native table's minimum width.
          </p>
          <pre class="docs-code-block"><code>{{ scrollSizingExample }}</code></pre>
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
  --tng-table-scroll-max-height: none;
  --tng-table-scroll-overflow-x: auto;
  --tng-table-scroll-overflow-y: auto;
  --tng-table-min-width: 100%;
  --tng-table-header-z-index: 2;
}`;

  protected readonly scrollSizingExample = `<!-- component.html -->
<tng-table
  class="statement-preview-table"
  scrollAxis="both"
  [stickyHeader]="true"
  [columns]="columns"
  [items]="rows"
/>

/* component.css */
.statement-preview-table {
  --tng-table-scroll-max-height: min(14rem, 30vh);
  --tng-table-min-width: 84rem;
  --tng-table-header-bg: var(--tng-semantic-background-surface);
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
