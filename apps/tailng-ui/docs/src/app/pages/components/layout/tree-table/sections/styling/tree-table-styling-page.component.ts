import { Component } from '@angular/core';

@Component({
  selector: 'app-tree-table-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="class-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Tree Table styling</h2>
          <p class="docs-overview-lead">
            Tree table styling follows the same BEM + CSS-variable convention as
            <code>tng-table</code>. Stable class names provide hooks for custom CSS and Tailwind
            utilities; CSS custom properties cascade from the host element.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>.tng-tree-table__root</code></td>
                  <td>Outer wrapper: border, radius, background, overflow scroll.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table</code></td>
                  <td>The native <code>&lt;table&gt;</code>: typography, layout, width.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__header-cell</code></td>
                  <td>Header cells: background, weight, border, alignment.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__cell</code></td>
                  <td>Body cells: background, padding, border, hover.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__tree-cell</code></td>
                  <td>
                    The tree column's body cell (also has <code>.tng-tree-table__cell</code>): flex
                    row containing indent, toggle, and content.
                  </td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__indent</code></td>
                  <td>Inline-block spacer whose width is <code>level × indentSize</code>px.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__toggle</code></td>
                  <td>Expand/collapse button: sizing, background, focus ring.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__toggle-placeholder</code></td>
                  <td>Same-size invisible spacer for non-expandable rows (keeps alignment).</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__toggle-icon</code></td>
                  <td>Inner icon span inside the toggle button.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__cell-content</code></td>
                  <td>Flex child that takes the remaining cell width after indent and toggle.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__row</code></td>
                  <td>
                    Body row. Data attributes: <code>[data-level]</code>,
                    <code>[data-expanded]</code>, <code>[data-selected]</code>,
                    <code>[data-disabled]</code>.
                  </td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__empty-cell</code></td>
                  <td>Full-width empty-state cell.</td>
                </tr>
                <tr>
                  <td><code>.tng-tree-table__loading-cell</code></td>
                  <td>Full-width loading-state cell.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="css-variables" class="docs-section-anchor docs-overview-block">
          <h3>CSS custom properties</h3>
          <p class="docs-overview-lead">
            All design tokens cascade from the host. Each variable has a fallback to a
            <code>--tng-semantic-*</code> token so the component works out of the box without
            overrides.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Fallback</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>--tng-tree-table-border</code></td>
                  <td><code>--tng-semantic-border-subtle</code></td>
                  <td>Border color used for the outer wrapper and cell dividers.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-radius</code></td>
                  <td><code>0.65rem</code></td>
                  <td>Border radius of the root wrapper.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-cell-px</code></td>
                  <td><code>0.9rem</code></td>
                  <td>Horizontal cell padding.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-cell-py</code></td>
                  <td><code>0.75rem</code></td>
                  <td>Vertical cell padding (halved in compact density).</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-header-bg</code></td>
                  <td>Color-mixed surface/base</td>
                  <td>Header row background color.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-row-bg</code></td>
                  <td><code>--tng-semantic-background-surface</code></td>
                  <td>Default body cell background.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-row-hover-bg</code></td>
                  <td>Color-mixed foreground/surface</td>
                  <td>Cell background on row hover.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-row-selected-bg</code></td>
                  <td>Color-mixed foreground/surface (slightly stronger)</td>
                  <td>Cell background for selected rows.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-toggle-color</code></td>
                  <td><code>--tng-semantic-foreground-secondary</code></td>
                  <td>Color of the toggle icon.</td>
                </tr>
                <tr>
                  <td><code>--tng-tree-table-toggle-hover-bg</code></td>
                  <td>Color-mixed foreground/surface</td>
                  <td>Toggle button background on hover.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pre class="docs-code-block"><code>{{ cssStarter }}</code></pre>
        </section>

        <section id="data-attribute-hooks" class="docs-section-anchor docs-overview-block">
          <h3>Data attribute hooks</h3>
          <p class="docs-overview-lead">
            Row state is reflected as data attributes on the <code>&lt;tr&gt;</code> element so
            you can write CSS selectors without class-based logic.
          </p>
          <pre class="docs-code-block"><code>{{ dataAttributeExample }}</code></pre>
        </section>
      </div>
    </article>
  `,
})
export class TreeTableStylingPageComponent {
  protected readonly cssStarter = `tng-tree-table {
  --tng-tree-table-border: var(--tng-semantic-border-subtle);
  --tng-tree-table-radius: 0.75rem;
  --tng-tree-table-cell-px: 1rem;
  --tng-tree-table-cell-py: 0.75rem;
  --tng-tree-table-header-bg: var(--tng-semantic-background-muted);
}`;

  protected readonly dataAttributeExample = `/* Style selected rows */
.tng-tree-table__row[data-selected] .tng-tree-table__cell {
  background: var(--my-selected-row-bg);
}

/* Dim rows by nesting level */
.tng-tree-table__row[data-level="1"] .tng-tree-table__cell {
  opacity: 0.85;
}

/* Style the toggle when expanded */
.tng-tree-table__toggle[data-expanded] {
  color: var(--tng-semantic-accent-primary);
}`;
}
