import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngPagination,
  TngPaginationNext,
  TngPaginationPage,
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

const controlledTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngPagination, TngPaginationNext, TngPaginationPage, TngPaginationPrevious } from '@tailng-ui/primitives';",
  '',
  '@Component({',
  "  selector: 'app-controlled-pagination',",
  '  standalone: true,',
  '  imports: [TngPagination, TngPaginationPrevious, TngPaginationNext, TngPaginationPage],',
  "  templateUrl: './controlled-pagination.component.html',",
  "  styleUrl: './controlled-pagination.component.css',",
  '})',
  'export class ControlledPaginationComponent {',
  '  protected readonly pageIndex = signal(0);',
  '}',
].join('\n');

const controlledPlainHtml = [
  '<nav',
  '  tngPagination',
  '  ariaLabel="Controlled pages"',
  '  class="pagination"',
  '  [totalItems]="90"',
  '  [pageIndex]="pageIndex()"',
  '  [pageSize]="10"',
  '  (pageIndexChange)="pageIndex.set($event)"',
  '>',
  '  <button tngPaginationPrevious class="pagination-button">Previous</button>',
  '  @for (page of [0, 1, 2]; track page) {',
  '    <button tngPaginationPage class="pagination-button" [tngPaginationPage]="page">',
  '      {{ page + 1 }}',
  '    </button>',
  '  }',
  '  <button tngPaginationNext class="pagination-button">Next</button>',
  '</nav>',
  '',
].join('\n');

const controlledPlainCss = [
  '.pagination { display: flex; flex-wrap: wrap; gap: 0.5rem; }',
  '.pagination-button {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.5rem;',
  '  padding: 0.45rem 0.75rem;',
  '}',
  '.pagination-button[aria-current="page"] { font-weight: 700; }',
].join('\n');

const controlledTailwindHtml = [
  '<nav',
  '  tngPagination',
  '  ariaLabel="Controlled pages"',
  '  class="flex flex-wrap items-center gap-2"',
  '  [totalItems]="90"',
  '  [pageIndex]="pageIndex()"',
  '  [pageSize]="10"',
  '  (pageIndexChange)="pageIndex.set($event)"',
  '>',
  '  <button tngPaginationPrevious class="rounded border border-tng-border-subtle px-3 py-1">Previous</button>',
  '  @for (page of [0, 1, 2]; track page) {',
  '    <button tngPaginationPage class="rounded border border-tng-border-subtle px-3 py-1 aria-[current=page]:font-bold" [tngPaginationPage]="page">',
  '      {{ page + 1 }}',
  '    </button>',
  '  }',
  '  <button tngPaginationNext class="rounded border border-tng-border-subtle px-3 py-1">Next</button>',
  '</nav>',
  '',
].join('\n');

const serverTs = controlledTs
  .replace("selector: 'app-controlled-pagination'", "selector: 'app-server-pagination'")
  .replace('ControlledPaginationComponent', 'ServerPaginationComponent');

const serverPlainHtml = controlledPlainHtml.replace(
  'ariaLabel="Controlled pages"',
  'ariaLabel="Server pages"\n  mode="server"',
);
const serverTailwindHtml = controlledTailwindHtml.replace(
  'ariaLabel="Controlled pages"',
  'ariaLabel="Server pages"\n  mode="server"',
);

@Component({
  selector: 'app-headless-pagination-examples-page',
  imports: [
    TngPagination,
    TngPaginationPrevious,
    TngPaginationNext,
    TngPaginationPage,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  template: `
    <article class="pagination-doc">
      <h2 class="pagination-doc__title">Examples</h2>
      <p class="pagination-doc__lead">
        Copy-pasteable headless pagination examples with separate Angular, HTML, and CSS files.
      </p>

      <app-docs-example-tabs-section
        id="controlled-pagination"
        class="pagination-doc__block"
        heading="Controlled pagination"
        description="Bind page index to app state when data fetching or sibling UI depends on the current page."
        ariaLabel="Controlled pagination variants"
        tabListAriaLabel="Controlled pagination style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Controlled pagination (Plain CSS)"
          [codeTabs]="controlledPlainCodeTabs"
        >
          <nav
            tngPagination
            ariaLabel="Controlled pages"
            class="pagination"
            [totalItems]="90"
            [pageIndex]="pageIndex()"
            [pageSize]="10"
            (pageIndexChange)="pageIndex.set($event)"
          >
            <button tngPaginationPrevious class="pagination-button">Previous</button>
            @for (page of [0, 1, 2]; track page) {
              <button tngPaginationPage class="pagination-button" [tngPaginationPage]="page">
                {{ page + 1 }}
              </button>
            }
            <button tngPaginationNext class="pagination-button">Next</button>
          </nav>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Controlled pagination (Tailwind CSS)"
          [codeTabs]="controlledTailwindCodeTabs"
        >
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
                class="rounded border border-tng-border-subtle px-3 py-1 aria-[current=page]:font-bold"
                [tngPaginationPage]="page"
              >
                {{ page + 1 }}
              </button>
            }
            <button tngPaginationNext class="rounded border border-tng-border-subtle px-3 py-1">
              Next
            </button>
          </nav>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="server-mode"
        class="pagination-doc__block"
        heading="Server mode"
        description="Use server mode when the API decides whether more results exist after the current response."
        ariaLabel="Server pagination variants"
        tabListAriaLabel="Server pagination style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Server pagination (Plain CSS)"
          [codeTabs]="serverPlainCodeTabs"
        >
          <nav
            tngPagination
            ariaLabel="Server pages"
            mode="server"
            class="pagination"
            [totalItems]="90"
            [pageIndex]="pageIndex()"
            [pageSize]="10"
            (pageIndexChange)="pageIndex.set($event)"
          >
            <button tngPaginationPrevious class="pagination-button">Previous</button>
            <button tngPaginationNext class="pagination-button">Next</button>
          </nav>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Server pagination (Tailwind CSS)"
          [codeTabs]="serverTailwindCodeTabs"
        >
          <nav
            tngPagination
            ariaLabel="Server pages"
            mode="server"
            class="flex flex-wrap items-center gap-2"
            [totalItems]="90"
            [pageIndex]="pageIndex()"
            [pageSize]="10"
            (pageIndexChange)="pageIndex.set($event)"
          >
            <button tngPaginationPrevious class="rounded border border-tng-border-subtle px-3 py-1">
              Previous
            </button>
            <button tngPaginationNext class="rounded border border-tng-border-subtle px-3 py-1">
              Next
            </button>
          </nav>
        </ng-template>
      </app-docs-example-tabs-section>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pagination-doc {
        display: grid;
        gap: 1.5rem;
      }
      .pagination-doc__title {
        font-size: clamp(1.45rem, 1.05rem + 1.3vw, 1.95rem);
        font-weight: 700;
        margin: 0;
      }
      .pagination-doc__lead {
        color: var(--tng-semantic-foreground-secondary);
        margin: 0;
        max-width: 72ch;
      }
      .pagination-doc__block {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 1rem;
        padding: 1rem;
      }
      .pagination {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .pagination-button {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.5rem;
        padding: 0.45rem 0.75rem;
      }
      .pagination-button[aria-current='page'] {
        font-weight: 700;
      }
    `,
  ],
})
export class HeadlessPaginationExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly controlledPlainCodeTabs = createCodeTabs(
    'controlled-pagination-plain-css',
    controlledTs,
    controlledPlainHtml,
    controlledPlainCss,
  );
  protected readonly controlledTailwindCodeTabs = createCodeTabs(
    'controlled-pagination-tailwind',
    controlledTs,
    controlledTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly serverPlainCodeTabs = createCodeTabs(
    'server-pagination-plain-css',
    serverTs,
    serverPlainHtml,
    controlledPlainCss,
  );
  protected readonly serverTailwindCodeTabs = createCodeTabs(
    'server-pagination-tailwind',
    serverTs,
    serverTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly pageIndex = signal(0);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
