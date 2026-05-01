import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="state-and-slot-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Paginator styling</h2>
          <p class="docs-overview-lead">
            The styled wrapper exposes stable classes for range text, movement controls, page
            buttons, and the page-size select.
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
                  <td><code>.tng-paginator</code></td>
                  <td>Layout, wrapping behavior, disabled opacity, and size state.</td>
                </tr>
                <tr>
                  <td><code>.tng-paginator__range</code></td>
                  <td>Current result range text.</td>
                </tr>
                <tr>
                  <td><code>.tng-paginator__button</code></td>
                  <td>Movement and numbered page controls.</td>
                </tr>
                <tr>
                  <td><code>.tng-paginator__button[aria-current='page']</code></td>
                  <td>Active page styling.</td>
                </tr>
                <tr>
                  <td><code>.tng-paginator__select</code></td>
                  <td>Rows-per-page select styling and focus ring.</td>
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
export class PaginationStylingPageComponent {
  protected readonly cssStarter = `tng-paginator {
  --tng-semantic-accent-brand: oklch(0.58 0.17 250);
  --tng-semantic-border-subtle: oklch(0.9 0.02 250);
  --tng-semantic-background-surface: white;
  --tng-semantic-focus-ring: oklch(0.68 0.16 250 / 0.35);
}`;
}
