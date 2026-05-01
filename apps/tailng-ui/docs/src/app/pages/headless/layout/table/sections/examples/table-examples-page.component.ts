import { Component } from '@angular/core';

@Component({
  selector: 'app-headless-table-examples-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="release-queue" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table examples</h2>
          <p class="docs-overview-lead">
            Use the headless table when your app owns row actions, custom filter bars, virtual
            scrolling, or server-driven sorting.
          </p>
        </section>

        <section id="sticky-columns" class="docs-section-anchor docs-overview-block">
          <h3>Sticky columns</h3>
          <p>
            Combine <code>tngTableScrollContainer</code> with sticky header and cell inputs for wide
            operational tables where row identity must remain visible.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessTableExamplesPageComponent {}
