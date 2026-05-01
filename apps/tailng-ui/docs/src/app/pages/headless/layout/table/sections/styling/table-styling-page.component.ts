import { Component } from '@angular/core';

@Component({
  selector: 'app-headless-table-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="slot-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table styling</h2>
          <p class="docs-overview-lead">
            Every primitive emits <code>data-slot</code> so owners can style a native table without
            class-name coupling.
          </p>
        </section>

        <section id="state-hooks" class="docs-section-anchor docs-overview-block">
          <h3>State hooks</h3>
          <ul class="docs-overview-list">
            <li>
              <code>[data-empty]</code>, <code>[data-loading]</code>, and
              <code>[data-error]</code> reflect root data state.
            </li>
            <li>
              <code>[data-selected]</code>, <code>[data-expanded]</code>, and
              <code>[data-disabled]</code> reflect row state.
            </li>
            <li>
              <code>[data-sticky]</code>, <code>[data-sticky-side]</code>, and
              <code>[data-truncate]</code> reflect cell layout state.
            </li>
          </ul>
        </section>

        <section id="practical-guidance" class="docs-section-anchor docs-overview-block">
          <h3>Practical guidance</h3>
          <p>
            Keep density, zebra striping, sticky shadows, and overflow affordances in app-owned CSS.
            The primitives focus on semantics, focus, and stable attributes.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessTableStylingPageComponent {}
