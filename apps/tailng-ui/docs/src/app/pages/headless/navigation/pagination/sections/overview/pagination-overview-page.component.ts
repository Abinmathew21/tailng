import { Component } from '@angular/core';
import {
  TngPagination,
  TngPaginationFirst,
  TngPaginationLast,
  TngPaginationNext,
  TngPaginationPage,
  TngPaginationPageSize,
  TngPaginationPrevious,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-pagination-overview-page',
  imports: [
    TngPagination,
    TngPaginationFirst,
    TngPaginationPrevious,
    TngPaginationNext,
    TngPaginationLast,
    TngPaginationPage,
    TngPaginationPageSize,
  ],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Headless pagination overview</h2>
          <p class="docs-overview-lead">
            Pagination owns page index, page size, client or server mode, range metadata, and
            disabled state. You provide the button, select, and layout markup.
          </p>
        </section>

        <section id="basic-composition" class="docs-section-anchor docs-overview-block">
          <h3>Basic composition</h3>
          <nav
            #pagination="tngPagination"
            tngPagination
            ariaLabel="Invoices pages"
            class="grid gap-3 rounded-lg border border-tng-border-subtle p-4"
            [totalItems]="86"
            [defaultPageSize]="10"
          >
            <p class="m-0 text-sm text-tng-fg-secondary">
              Page {{ pagination.state().pageIndex + 1 }} of {{ pagination.pageCount() }} ·
              {{ pagination.state().pageSize }} rows
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <button tngPaginationFirst class="rounded border border-tng-border-subtle px-3 py-1">
                First
              </button>
              <button
                tngPaginationPrevious
                class="rounded border border-tng-border-subtle px-3 py-1"
              >
                Previous
              </button>
              @for (page of [0, 1, 2, 3, 4]; track page) {
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
              <button tngPaginationLast class="rounded border border-tng-border-subtle px-3 py-1">
                Last
              </button>
              <label class="ml-2 inline-flex items-center gap-2 text-sm text-tng-fg-secondary">
                Rows
                <select
                  tngPaginationPageSize
                  class="rounded border border-tng-border-subtle bg-tng-bg-surface px-2 py-1"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </label>
            </div>
          </nav>
        </section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>Use a labelled <code>nav[tngPagination]</code> landmark.</li>
            <li>Numbered page buttons expose <code>aria-current="page"</code> when selected.</li>
            <li>The page-size directive keeps the native select disabled state in sync.</li>
          </ul>
        </section>
      </div>
    </article>
  `,
})
export class HeadlessPaginationOverviewPageComponent {}
