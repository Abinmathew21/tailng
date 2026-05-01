import { Component } from '@angular/core';

@Component({
  selector: 'app-headless-table-api-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="root-and-sections" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table API</h2>
          <p class="docs-overview-lead">
            Compose <code>tngTable</code> with native table sections. The root reflects layout,
            loading, error, empty, pageable, and filterable state.
          </p>
        </section>

        <section id="rows-and-cells" class="docs-section-anchor docs-overview-block">
          <h3>Rows and cells</h3>
          <ul class="docs-overview-list">
            <li>
              <code>tr[tngTableRow]</code> accepts row ids plus selected, expanded, and disabled
              state.
            </li>
            <li>
              <code>td[tngTableCell]</code> and <code>th[tngTableHeaderCell]</code> expose column
              id, sticky side, offset, and truncate inputs.
            </li>
            <li>
              Cell directives register with the root for keyboard focus and sticky positioning.
            </li>
          </ul>
        </section>

        <section id="state-directives" class="docs-section-anchor docs-overview-block">
          <h3>State directives</h3>
          <p>
            Empty, loading, error, toolbar, pagination, selection, expansion, and scroll-container
            directives provide named slots while leaving rendering to the owner.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessTableApiPageComponent {}
