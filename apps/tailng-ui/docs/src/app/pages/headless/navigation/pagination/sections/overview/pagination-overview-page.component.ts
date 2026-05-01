import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngPagination,
  TngPaginationFirst,
  TngPaginationLast,
  TngPaginationNext,
  TngPaginationPage,
  TngPaginationPageSize,
  TngPaginationPrevious,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

const tsCode = [
  "import { Component } from '@angular/core';",
  "import { TngPagination, TngPaginationFirst, TngPaginationLast, TngPaginationNext, TngPaginationPage, TngPaginationPageSize, TngPaginationPrevious } from '@tailng-ui/primitives';",
  '',
  '@Component({',
  "  selector: 'app-invoice-pagination',",
  '  standalone: true,',
  '  imports: [TngPagination, TngPaginationFirst, TngPaginationPrevious, TngPaginationNext, TngPaginationLast, TngPaginationPage, TngPaginationPageSize],',
  "  templateUrl: './invoice-pagination.component.html',",
  "  styleUrl: './invoice-pagination.component.css',",
  '})',
  'export class InvoicePaginationComponent {}',
].join('\n');

const plainHtml = [
  '<nav #pagination="tngPagination" tngPagination ariaLabel="Invoices pages" class="pagination" [totalItems]="86" [defaultPageSize]="10">',
  '  <p class="pagination-summary">',
  '    Page {{ pagination.state().pageIndex + 1 }} of {{ pagination.pageCount() }} ·',
  '    {{ pagination.state().pageSize }} rows',
  '  </p>',
  '  <div class="pagination-controls">',
  '    <button tngPaginationFirst class="pagination-button">First</button>',
  '    <button tngPaginationPrevious class="pagination-button">Previous</button>',
  '    @for (page of [0, 1, 2, 3, 4]; track page) {',
  '      <button tngPaginationPage class="pagination-button" [tngPaginationPage]="page">',
  '        {{ page + 1 }}',
  '      </button>',
  '    }',
  '    <button tngPaginationNext class="pagination-button">Next</button>',
  '    <button tngPaginationLast class="pagination-button">Last</button>',
  '    <label class="page-size-label">',
  '      Rows',
  '      <select tngPaginationPageSize class="page-size-select">',
  '        <option value="5">5</option>',
  '        <option value="10">10</option>',
  '        <option value="25">25</option>',
  '      </select>',
  '    </label>',
  '  </div>',
  '</nav>',
  '',
].join('\n');

const plainCss = [
  '.pagination { display: grid; gap: 0.75rem; border: 1px solid #d7dde8; border-radius: 12px; padding: 1rem; }',
  '.pagination-summary { color: #596579; font-size: 0.875rem; margin: 0; }',
  '.pagination-controls { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }',
  '.pagination-button, .page-size-select { border: 1px solid #d7dde8; border-radius: 8px; padding: 0.4rem 0.65rem; }',
  '.pagination-button[aria-current="page"] { font-weight: 700; }',
  '.page-size-label { display: inline-flex; gap: 0.5rem; align-items: center; }',
].join('\n');

const tailwindHtml = [
  '<nav #pagination="tngPagination" tngPagination ariaLabel="Invoices pages" class="grid gap-3 rounded-lg border border-tng-border-subtle p-4" [totalItems]="86" [defaultPageSize]="10">',
  '  <p class="m-0 text-sm text-tng-fg-secondary">',
  '    Page {{ pagination.state().pageIndex + 1 }} of {{ pagination.pageCount() }} ·',
  '    {{ pagination.state().pageSize }} rows',
  '  </p>',
  '  <div class="flex flex-wrap items-center gap-2">',
  '    <button tngPaginationFirst class="rounded border border-tng-border-subtle px-3 py-1">First</button>',
  '    <button tngPaginationPrevious class="rounded border border-tng-border-subtle px-3 py-1">Previous</button>',
  '    @for (page of [0, 1, 2, 3, 4]; track page) {',
  '      <button tngPaginationPage class="rounded border border-tng-border-subtle px-3 py-1 aria-[current=page]:font-bold" [tngPaginationPage]="page">',
  '        {{ page + 1 }}',
  '      </button>',
  '    }',
  '    <button tngPaginationNext class="rounded border border-tng-border-subtle px-3 py-1">Next</button>',
  '    <button tngPaginationLast class="rounded border border-tng-border-subtle px-3 py-1">Last</button>',
  '    <label class="ml-2 inline-flex items-center gap-2 text-sm text-tng-fg-secondary">',
  '      Rows',
  '      <select tngPaginationPageSize class="rounded border border-tng-border-subtle bg-tng-bg-surface px-2 py-1">',
  '        <option value="5">5</option>',
  '        <option value="10">10</option>',
  '        <option value="25">25</option>',
  '      </select>',
  '    </label>',
  '  </div>',
  '</nav>',
  '',
].join('\n');

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
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
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

        <app-docs-example-tabs-section
          id="basic-composition"
          class="docs-section-anchor docs-overview-block"
          heading="Basic composition"
          description="Build pagination from primitive directives while owning the buttons, select, and layout."
          ariaLabel="Headless pagination overview variants"
          tabListAriaLabel="Headless pagination overview style tabs"
          defaultValue="plain-css"
          [codeBlockTheme]="codeBlockTheme()"
        >
          <ng-template
            appDocsExampleVariant
            value="plain-css"
            label="Plain-CSS"
            panelTitle="Headless pagination (Plain CSS)"
            [codeTabs]="plainCodeTabs"
          >
            <nav
              #pagination="tngPagination"
              tngPagination
              ariaLabel="Invoices pages"
              class="pagination"
              [totalItems]="86"
              [defaultPageSize]="10"
            >
              <p class="pagination-summary">
                Page {{ pagination.state().pageIndex + 1 }} of {{ pagination.pageCount() }} ·
                {{ pagination.state().pageSize }} rows
              </p>
              <div class="pagination-controls">
                <button tngPaginationFirst class="pagination-button">First</button>
                <button tngPaginationPrevious class="pagination-button">Previous</button>
                @for (page of [0, 1, 2, 3, 4]; track page) {
                  <button tngPaginationPage class="pagination-button" [tngPaginationPage]="page">
                    {{ page + 1 }}
                  </button>
                }
                <button tngPaginationNext class="pagination-button">Next</button>
                <button tngPaginationLast class="pagination-button">Last</button>
                <label class="page-size-label">
                  Rows
                  <select tngPaginationPageSize class="page-size-select">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                  </select>
                </label>
              </div>
            </nav>
          </ng-template>

          <ng-template
            appDocsExampleVariant
            value="tailwind-css"
            label="Tailwind CSS"
            panelTitle="Headless pagination (Tailwind CSS)"
            [codeTabs]="tailwindCodeTabs"
          >
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
                <button
                  tngPaginationFirst
                  class="rounded border border-tng-border-subtle px-3 py-1"
                >
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
                    class="rounded border border-tng-border-subtle px-3 py-1 aria-[current=page]:font-bold"
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
          </ng-template>
        </app-docs-example-tabs-section>

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
  styles: [
    `
      .pagination {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.875rem;
        display: grid;
        gap: 0.75rem;
        padding: 1rem;
      }
      .pagination-summary {
        color: var(--tng-semantic-foreground-secondary);
        font-size: 0.875rem;
        margin: 0;
      }
      .pagination-controls {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .pagination-button {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.5rem;
        padding: 0.4rem 0.65rem;
      }
      .page-size-label {
        align-items: center;
        display: inline-flex;
        gap: 0.5rem;
      }
      .page-size-select {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.5rem;
        padding: 0.4rem 0.65rem;
      }
    `,
  ],
})
export class HeadlessPaginationOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );
  protected readonly plainCodeTabs = createCodeTabs(
    'invoice-pagination-plain-css',
    tsCode,
    plainHtml,
    plainCss,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'invoice-pagination-tailwind',
    tsCode,
    tailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
