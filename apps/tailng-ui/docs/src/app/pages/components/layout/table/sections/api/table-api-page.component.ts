import { Component } from '@angular/core';

@Component({
  selector: 'app-table-api-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="component-wrapper" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table API</h2>
          <p class="docs-overview-lead">
            Import <code>TngTableComponent</code> from <code>&#64;tailng-ui/components</code> and
            pass column definitions plus row items.
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
                  <td><code>columns</code></td>
                  <td><code>readonly TngTableColumn&lt;TRow&gt;[]</code></td>
                  <td>
                    A column tree. Leaves carry id, label, accessor, alignment, sorting, sticky
                    position, truncation, width, and optional <code>groupBy</code> row merging.
                    Groups carry id, label, and a <code>children</code> array to produce multi-row
                    headers with colspan / rowspan.
                  </td>
                </tr>
                <tr>
                  <td><code>items</code></td>
                  <td><code>readonly TRow[]</code></td>
                  <td>Rows rendered into the table body.</td>
                </tr>
                <tr>
                  <td><code>density</code></td>
                  <td><code>'comfortable' | 'compact'</code></td>
                  <td>Controls vertical cell padding.</td>
                </tr>
                <tr>
                  <td><code>layout</code></td>
                  <td><code>'auto' | 'fixed'</code></td>
                  <td>Sets the native table layout mode.</td>
                </tr>
                <tr>
                  <td><code>hoverMode</code></td>
                  <td><code>'row' | 'group'</code></td>
                  <td>
                    Controls hover highlighting. <code>'row'</code> highlights the single hovered
                    row; <code>'group'</code> highlights every row in the same
                    <code>groupBy</code> rowspan group, so merged groups react as one block.
                  </td>
                </tr>
                <tr>
                  <td><code>rowClass</code></td>
                  <td><code>(row: TRow, index: number) =&gt; TngTableClassInput</code></td>
                  <td>
                    Predicate that returns extra classes for each body row. Return a
                    <code>string</code>, <code>string[]</code>, or
                    <code>Record&lt;string, boolean&gt;</code>. Applied via the native
                    <code>[class]</code> binding, so base row markup is preserved.
                  </td>
                </tr>
                <tr>
                  <td><code>rowStyle</code></td>
                  <td><code>(row: TRow, index: number) =&gt; TngTableStyleInput</code></td>
                  <td>
                    Predicate that returns inline styles or CSS custom properties for each body row.
                    Use <code>--tng-table-row-bg</code> to set the painted row background on cells.
                  </td>
                </tr>
                <tr>
                  <td><code>loading</code>, <code>error</code></td>
                  <td><code>boolean</code></td>
                  <td>Render full-width state rows.</td>
                </tr>
                <tr>
                  <td><code>stickyHeader</code></td>
                  <td><code>boolean</code></td>
                  <td>Makes the header row sticky inside the scroll container.</td>
                </tr>
                <tr>
                  <td><code>sortActive</code>, <code>sortDirection</code></td>
                  <td><code>string | null</code></td>
                  <td>Controlled sorting state forwarded to sortable headers.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="class-hooks" class="docs-section-anchor docs-overview-block">
          <h3>Styling hooks</h3>
          <p class="docs-overview-lead">
            Per-row styling uses the <code>rowClass</code> and <code>rowStyle</code> inputs;
            per-column styling lives on the column definition next to <code>align</code> and
            <code>width</code>. Class hooks are applied with the native <code>[class]</code>
            binding; style hooks apply inline styles and CSS custom properties directly to the
            internal table elements.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Hook</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>rowClass</code> (input)</td>
                  <td><code>(row, index) =&gt; TngTableClassInput</code></td>
                  <td>Classes for each <code>&lt;tr&gt;</code>, evaluated per row.</td>
                </tr>
                <tr>
                  <td><code>rowStyle</code> (input)</td>
                  <td><code>(row, index) =&gt; TngTableStyleInput</code></td>
                  <td>
                    Inline styles/custom properties for each body <code>&lt;tr&gt;</code>, evaluated
                    per row.
                  </td>
                </tr>
                <tr>
                  <td><code>column.cellClass</code></td>
                  <td>
                    <code>TngTableClassInput | (row, value, index) =&gt; TngTableClassInput</code>
                  </td>
                  <td>
                    Classes for that leaf column's body cells. Static for column-wide styling, or a
                    predicate for value-driven styling.
                  </td>
                </tr>
                <tr>
                  <td><code>column.cellStyle</code></td>
                  <td>
                    <code>TngTableStyleInput | (row, value, index) =&gt; TngTableStyleInput</code>
                  </td>
                  <td>Inline styles for that leaf column's body cells.</td>
                </tr>
                <tr>
                  <td><code>column.headerClass</code></td>
                  <td><code>TngTableClassInput</code></td>
                  <td>Classes for the column's header cell. Valid on leaf and group columns.</td>
                </tr>
                <tr>
                  <td><code>column.headerStyle</code></td>
                  <td><code>TngTableStyleInput</code></td>
                  <td>Inline styles for the column's header cell. Valid on leaf and group columns.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="docs-overview-note">
            Because Angular scopes component styles, class selectors for internal rows and cells
            still belong in global CSS, Tailwind utilities, or shared library styles. Use
            <code>rowStyle</code>, <code>cellStyle</code>, and <code>headerStyle</code> when the
            styling should be driven from component code and component CSS variables.
          </p>
        </section>

        <section id="outputs-and-templates" class="docs-section-anchor docs-overview-block">
          <h3>Outputs and templates</h3>
          <ul class="docs-overview-list">
            <li>
              <code>sortChange</code> emits <code>TngTableSortChange</code> when a sortable header
              changes.
            </li>
            <li>
              <code>ng-template[tngTableCellTemplate]</code> customizes body cells by column id. The
              context exposes <code>value</code>, <code>row</code>, <code>rowIndex</code>,
              <code>column</code>, <code>columnId</code>, <code>groupSize</code>, and
              <code>isGroupLeader</code>.
            </li>
            <li>
              <code>ng-template[tngTableHeaderTemplate]</code> customizes header cells by column id.
              The context exposes <code>label</code>, <code>columnId</code>, <code>column</code>,
              <code>isGroup</code>, <code>depth</code>, <code>colspan</code>, and
              <code>rowspan</code>, so the same template can render leaf and group headers.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class TableApiPageComponent {}
