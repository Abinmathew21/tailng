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
