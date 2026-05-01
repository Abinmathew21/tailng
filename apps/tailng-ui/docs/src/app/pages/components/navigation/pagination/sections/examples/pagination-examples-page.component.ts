import { Component, signal } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-pagination-examples-page',
  imports: [TngPaginatorComponent],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="compact-toolbar" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Compact toolbar</h2>
          <p class="docs-overview-lead">
            Hide range text and first/last controls when the paginator sits inside a narrow toolbar.
          </p>
          <tng-paginator
            ariaLabel="Compact result pages"
            size="sm"
            [totalItems]="64"
            [pageIndex]="compactPageIndex()"
            [pageSize]="8"
            [showFirstLast]="false"
            [showPageSize]="false"
            [showRange]="false"
            (pageIndexChange)="compactPageIndex.set($event)"
          />
        </section>

        <section id="server-pagination" class="docs-section-anchor docs-overview-block">
          <h3>Server pagination</h3>
          <tng-paginator
            ariaLabel="Server result pages"
            mode="server"
            [totalItems]="250"
            [pageIndex]="serverPageIndex()"
            [pageSize]="serverPageSize()"
            [pageSizeOptions]="[25, 50, 100]"
            (pageIndexChange)="serverPageIndex.set($event)"
            (pageSizeChange)="serverPageSize.set($event)"
          />
        </section>
      </div>
    </article>
  `,
})
export class PaginationExamplesPageComponent {
  protected readonly compactPageIndex = signal(1);
  protected readonly serverPageIndex = signal(0);
  protected readonly serverPageSize = signal(25);
}
