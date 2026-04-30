import { Component, signal } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-pagination-page',
  imports: [TngPaginatorComponent],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="overview" class="docs-section-anchor docs-overview-block">
          <h1 class="docs-overview-title">Pagination</h1>
          <p class="docs-overview-lead">
            The styled paginator wraps the headless pagination contract with range text, movement
            controls, numbered page buttons, and page-size selection.
          </p>
        </section>

        <section id="basic-usage" class="docs-section-anchor docs-overview-block">
          <h2>Basic usage</h2>
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

        <section id="api" class="docs-section-anchor docs-overview-block">
          <h2>API notes</h2>
          <ul class="docs-overview-list">
            <li>
              <code>totalItems</code>, <code>pageIndex</code>, and <code>pageSize</code> define the
              current range.
            </li>
            <li>
              <code>mode="server"</code> supports paged API responses where the next page can be
              requested optimistically.
            </li>
            <li>
              <code>showFirstLast</code>, <code>showPageSize</code>, and <code>showRange</code> trim
              the surface for compact layouts.
            </li>
            <li>
              <code>pageChange</code> includes previous values and the trigger that caused the
              change.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class PaginationPageComponent {
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
}
