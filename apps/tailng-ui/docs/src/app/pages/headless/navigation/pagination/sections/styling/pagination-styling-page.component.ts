import { Component } from '@angular/core';

@Component({
  selector: 'app-headless-pagination-styling-page',
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="slot-hooks" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Headless pagination styling</h2>
          <p class="docs-overview-lead">
            Pagination directives add slot attributes while leaving the visual structure fully owned
            by your markup.
          </p>
          <div class="docs-table-scroll">
            <table class="docs-api-table">
              <thead>
                <tr>
                  <th>Hook</th>
                  <th>Element</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>[data-slot='pagination']</code></td>
                  <td>Root landmark.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='pagination-first']</code></td>
                  <td>First page button.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='pagination-page']</code></td>
                  <td>Numbered page button.</td>
                </tr>
                <tr>
                  <td><code>[data-slot='pagination-page-size']</code></td>
                  <td>Rows-per-page select.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="state-hooks" class="docs-section-anchor docs-overview-block">
          <h3>State hooks</h3>
          <ul class="docs-overview-list">
            <li><code>[data-disabled]</code> marks disabled roots and controls.</li>
            <li><code>[data-current]</code> marks the selected numbered page button.</li>
            <li>
              <code>[data-mode]</code>, <code>[data-page-index]</code>, and
              <code>[data-page-size]</code> describe root state.
            </li>
          </ul>
        </section>

        <section id="practical-guidance" class="docs-section-anchor docs-overview-block">
          <h3>Practical guidance</h3>
          <p>
            Keep movement controls in DOM order, reserve enough width for the largest page number,
            and use native button and select elements so disabled and focus states remain reliable.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessPaginationStylingPageComponent {}
