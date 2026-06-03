import { Component } from '@angular/core';

@Component({
  selector: 'app-tree-table-api-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="component-wrapper" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Tree Table API</h2>
          <p class="docs-overview-lead">
            Import <code>TngTreeTableComponent</code> from <code>&#64;tailng-ui/components</code>.
            Pass column definitions, a flat-but-hierarchical data array, and key/children accessors.
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
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>columns</code> *</td>
                  <td><code>readonly TngTreeTableColumn&lt;TRow&gt;[]</code></td>
                  <td>—</td>
                  <td>
                    Required. Column definitions. Mark one with <code>treeToggle: true</code> to
                    place the indent/toggle in that column; first column is the fallback.
                  </td>
                </tr>
                <tr>
                  <td><code>data</code></td>
                  <td><code>readonly TRow[]</code></td>
                  <td><code>[]</code></td>
                  <td>Root-level rows. Children come from <code>getChildren</code>.</td>
                </tr>
                <tr>
                  <td><code>getKey</code></td>
                  <td><code>(row: TRow, indexPath: number[]) =&gt; TngTreeTableKey</code></td>
                  <td>index path join</td>
                  <td>
                    Stable identity function. Prefer a property accessor
                    (<code>row =&gt; row.id</code>) for reliable expansion and focus tracking.
                  </td>
                </tr>
                <tr>
                  <td><code>getChildren</code></td>
                  <td><code>(row: TRow) =&gt; readonly TRow[] | null | undefined</code></td>
                  <td>returns <code>undefined</code></td>
                  <td>Returns child rows or <code>null/undefined</code> for leaf nodes.</td>
                </tr>
                <tr>
                  <td><code>expandedKeys</code></td>
                  <td><code>readonly TngTreeTableKey[]</code></td>
                  <td><code>[]</code></td>
                  <td>Controlled expansion state. Pair with <code>(expandedKeysChange)</code>.</td>
                </tr>
                <tr>
                  <td><code>selectedKeys</code></td>
                  <td><code>readonly TngTreeTableKey[]</code></td>
                  <td><code>[]</code></td>
                  <td>Controlled selection state. Only meaningful when <code>selectable</code> is true.</td>
                </tr>
                <tr>
                  <td><code>loading</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Shows a full-width loading row. Takes priority over the empty state.</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disables all interaction on every row.</td>
                </tr>
                <tr>
                  <td><code>selectable</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Enables row selection via Space key or programmatically.</td>
                </tr>
                <tr>
                  <td><code>expandOnRowClick</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Clicking anywhere on an expandable row also toggles it.</td>
                </tr>
                <tr>
                  <td><code>emptyText</code></td>
                  <td><code>string</code></td>
                  <td><code>'No records found'</code></td>
                  <td>Message shown in the empty-state row.</td>
                </tr>
                <tr>
                  <td><code>loadingText</code></td>
                  <td><code>string</code></td>
                  <td><code>'Loading...'</code></td>
                  <td>Message shown in the loading-state row.</td>
                </tr>
                <tr>
                  <td><code>treeColumnKey</code></td>
                  <td><code>string | null</code></td>
                  <td><code>null</code></td>
                  <td>
                    If no column has <code>treeToggle: true</code>, this key selects the tree column
                    by id. The first column is the final fallback.
                  </td>
                </tr>
                <tr>
                  <td><code>indentSize</code></td>
                  <td><code>number</code></td>
                  <td><code>20</code></td>
                  <td>Pixels of indent per nesting level in the tree column.</td>
                </tr>
                <tr>
                  <td><code>ariaLabel</code></td>
                  <td><code>string | null</code></td>
                  <td><code>'Tree table'</code></td>
                  <td>Accessible label for the table element.</td>
                </tr>
                <tr>
                  <td><code>density</code></td>
                  <td><code>'comfortable' | 'compact'</code></td>
                  <td><code>'comfortable'</code></td>
                  <td>Controls cell vertical padding.</td>
                </tr>
                <tr>
                  <td><code>dir</code></td>
                  <td><code>'ltr' | 'rtl' | null</code></td>
                  <td><code>null</code></td>
                  <td>Text direction forwarded to the table element.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="outputs" class="docs-section-anchor docs-overview-block">
          <h3>Outputs</h3>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Payload</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>expandedKeysChange</code></td>
                  <td><code>readonly TngTreeTableKey[]</code></td>
                  <td>
                    Emitted after expand or collapse. Always a new array — never mutates the input.
                  </td>
                </tr>
                <tr>
                  <td><code>selectedKeysChange</code></td>
                  <td><code>readonly TngTreeTableKey[]</code></td>
                  <td>Emitted after a selection toggle. Always a new array.</td>
                </tr>
                <tr>
                  <td><code>rowClick</code></td>
                  <td><code>TngTreeTableRowEvent&lt;TRow&gt;</code></td>
                  <td>Emitted when a row is clicked (always, not just on expansion).</td>
                </tr>
                <tr>
                  <td><code>rowExpand</code></td>
                  <td><code>TngTreeTableRowEvent&lt;TRow&gt;</code></td>
                  <td>Emitted when a row is expanded.</td>
                </tr>
                <tr>
                  <td><code>rowCollapse</code></td>
                  <td><code>TngTreeTableRowEvent&lt;TRow&gt;</code></td>
                  <td>Emitted when a row is collapsed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="column-api" class="docs-section-anchor docs-overview-block">
          <h3>Column definition — <code>TngTreeTableColumn&lt;TRow&gt;</code></h3>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>key</code></td>
                  <td><code>string</code></td>
                  <td>Unique column id. Used as a fallback property accessor on the row.</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>Header cell text.</td>
                </tr>
                <tr>
                  <td><code>accessor</code></td>
                  <td>
                    <code>keyof TRow | ((row: TRow, index: number) =&gt; unknown)</code>
                  </td>
                  <td>Data accessor. Falls back to <code>row[column.key]</code> when omitted.</td>
                </tr>
                <tr>
                  <td><code>treeToggle</code></td>
                  <td><code>boolean</code></td>
                  <td>
                    When <code>true</code>, this column renders the indent spacer, expand/collapse
                    button, and cell text inline.
                  </td>
                </tr>
                <tr>
                  <td><code>align</code></td>
                  <td><code>'start' | 'center' | 'end'</code></td>
                  <td>Cell text alignment. Defaults to <code>'start'</code>.</td>
                </tr>
                <tr>
                  <td><code>width</code>, <code>minWidth</code>, <code>maxWidth</code></td>
                  <td><code>string | number | null</code></td>
                  <td>CSS column width. Numbers are treated as <code>px</code>.</td>
                </tr>
                <tr>
                  <td><code>sticky</code></td>
                  <td><code>'start' | 'end' | null</code></td>
                  <td>Sticky column side (not rendered by default CSS — wire via custom CSS).</td>
                </tr>
                <tr>
                  <td><code>headerClass</code></td>
                  <td><code>TngTreeTableClassInput</code></td>
                  <td>Extra classes for the header cell.</td>
                </tr>
                <tr>
                  <td><code>cellClass</code></td>
                  <td>
                    <code>TngTreeTableClassInput | ((row: TRow) =&gt; TngTreeTableClassInput)</code>
                  </td>
                  <td>Extra classes for body cells. Use a function for row-driven styling.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="row-event" class="docs-section-anchor docs-overview-block">
          <h3>Row event — <code>TngTreeTableRowEvent&lt;TRow&gt;</code></h3>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>row</code></td>
                  <td><code>TRow</code></td>
                  <td>The original data row (same reference, not a copy).</td>
                </tr>
                <tr>
                  <td><code>key</code></td>
                  <td><code>TngTreeTableKey</code></td>
                  <td>The stable key returned by <code>getKey</code>.</td>
                </tr>
                <tr>
                  <td><code>level</code></td>
                  <td><code>number</code></td>
                  <td>Zero-based nesting depth of the row.</td>
                </tr>
                <tr>
                  <td><code>originalEvent</code></td>
                  <td><code>Event</code></td>
                  <td>The originating DOM event (click, keydown, etc.).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `,
})
export class TreeTableApiPageComponent {}
