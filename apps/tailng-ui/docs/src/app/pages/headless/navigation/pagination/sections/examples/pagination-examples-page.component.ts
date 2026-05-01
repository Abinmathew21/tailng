import { Component, signal } from '@angular/core';
import {
  TngPagination,
  TngPaginationNext,
  TngPaginationPage,
  TngPaginationPrevious,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-pagination-examples-page',
  imports: [TngPagination, TngPaginationPrevious, TngPaginationNext, TngPaginationPage],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="controlled-pagination" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Controlled pagination</h2>
          <nav
            tngPagination
            ariaLabel="Controlled pages"
            class="flex flex-wrap items-center gap-2"
            [totalItems]="90"
            [pageIndex]="pageIndex()"
            [pageSize]="10"
            (pageIndexChange)="pageIndex.set($event)"
          >
            <button tngPaginationPrevious class="rounded border border-tng-border-subtle px-3 py-1">
              Previous
            </button>
            @for (page of [0, 1, 2]; track page) {
              <button
                tngPaginationPage
                class="rounded border border-tng-border-subtle px-3 py-1"
                [tngPaginationPage]="page"
              >
                {{ page + 1 }}
              </button>
            }
            <button tngPaginationNext class="rounded border border-tng-border-subtle px-3 py-1">
              Next
            </button>
          </nav>
        </section>

        <section id="server-mode" class="docs-section-anchor docs-overview-block">
          <h3>Server mode</h3>
          <p>
            Use <code>mode="server"</code> when the API decides whether more results exist after the
            current response. Forward movement stays available until your app disables it.
          </p>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessPaginationExamplesPageComponent {
  protected readonly pageIndex = signal(0);
}
