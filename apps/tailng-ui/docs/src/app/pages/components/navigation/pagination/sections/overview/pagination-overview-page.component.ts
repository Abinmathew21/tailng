import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngPaginatorComponent } from '@tailng-ui/components';
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
  "import { Component, signal } from '@angular/core';",
  "import { TngPaginatorComponent } from '@tailng-ui/components';",
  '',
  '@Component({',
  "  selector: 'app-invoice-paginator',",
  '  standalone: true,',
  '  imports: [TngPaginatorComponent],',
  "  templateUrl: './invoice-paginator.component.html',",
  "  styleUrl: './invoice-paginator.component.css',",
  '})',
  'export class InvoicePaginatorComponent {',
  '  protected readonly pageIndex = signal(0);',
  '  protected readonly pageSize = signal(10);',
  '}',
].join('\n');

const plainHtml = [
  '<section class="paginator-card">',
  '  <tng-paginator',
  '    ariaLabel="Invoice result pages"',
  '    [totalItems]="128"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="pageSize()"',
  '    [pageSizeOptions]="[10, 25, 50]"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '    (pageSizeChange)="pageSize.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const plainCss = [
  '.paginator-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
].join('\n');

const tailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-paginator',
  '    ariaLabel="Invoice result pages"',
  '    [totalItems]="128"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="pageSize()"',
  '    [pageSizeOptions]="[10, 25, 50]"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '    (pageSizeChange)="pageSize.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

@Component({
  selector: 'app-pagination-overview-page',
  imports: [TngPaginatorComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
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

        <app-docs-example-tabs-section
          id="basic-usage"
          class="docs-section-anchor docs-overview-block"
          heading="Basic usage"
          description="A styled paginator with controlled page index and page size."
          ariaLabel="Pagination overview variants"
          tabListAriaLabel="Pagination overview style tabs"
          defaultValue="plain-css"
          [codeBlockTheme]="codeBlockTheme()"
        >
          <ng-template
            appDocsExampleVariant
            value="plain-css"
            label="Plain-CSS"
            panelTitle="Paginator (Plain CSS)"
            [codeTabs]="plainCodeTabs"
          >
            <section class="paginator-card">
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
          </ng-template>

          <ng-template
            appDocsExampleVariant
            value="tailwind-css"
            label="Tailwind CSS"
            panelTitle="Paginator (Tailwind CSS)"
            [codeTabs]="tailwindCodeTabs"
          >
            <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
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
          </ng-template>
        </app-docs-example-tabs-section>

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
  styles: [
    `
      .paginator-card {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.875rem;
        padding: 1rem;
      }
    `,
  ],
})
export class PaginationOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );
  protected readonly plainCodeTabs = createCodeTabs(
    'invoice-paginator-plain-css',
    tsCode,
    plainHtml,
    plainCss,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'invoice-paginator-tailwind',
    tsCode,
    tailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
