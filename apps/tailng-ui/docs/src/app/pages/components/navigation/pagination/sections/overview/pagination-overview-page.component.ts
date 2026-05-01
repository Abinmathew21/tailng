import { Component, signal } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-pagination-overview-page',
  imports: [TngPaginatorComponent],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Pagination overview</h2>
          <p class="docs-overview-lead">
            The styled paginator wraps the headless pagination contract with range text, movement
            controls, numbered page buttons, and page-size selection.
          </p>
        </section>

        <section id="basic-usage" class="docs-section-anchor docs-overview-block">
          <h3>Basic usage</h3>
          <tng-paginator
            ariaLabel="Invoice result pages"
            [totalItems]="128"
            [pageIndex]="pageIndex()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[10, 25, 50]"
            (pageIndexChange)="pageIndex.set($event)"
            (pageSizeChange)="pageSize.set($event)"
          />
        </section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>Provide a clear <code>ariaLabel</code> for the pagination landmark.</li>
            <li>Current page buttons expose <code>aria-current="page"</code>.</li>
            <li>Disabled movement buttons stay non-interactive at page boundaries.</li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class PaginationOverviewPageComponent {
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
}
