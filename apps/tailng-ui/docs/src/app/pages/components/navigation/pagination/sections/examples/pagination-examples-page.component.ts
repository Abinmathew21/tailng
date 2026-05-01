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

const compactTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngPaginatorComponent } from '@tailng-ui/components';",
  '',
  '@Component({',
  "  selector: 'app-compact-paginator',",
  '  standalone: true,',
  '  imports: [TngPaginatorComponent],',
  "  templateUrl: './compact-paginator.component.html',",
  "  styleUrl: './compact-paginator.component.css',",
  '})',
  'export class CompactPaginatorComponent {',
  '  protected readonly pageIndex = signal(1);',
  '}',
].join('\n');

const compactPlainHtml = [
  '<section class="paginator-toolbar">',
  '  <tng-paginator',
  '    ariaLabel="Compact result pages"',
  '    size="sm"',
  '    [totalItems]="64"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="8"',
  '    [showFirstLast]="false"',
  '    [showPageSize]="false"',
  '    [showRange]="false"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const compactPlainCss = [
  '.paginator-toolbar {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 0.75rem;',
  '}',
].join('\n');

const compactTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-3">',
  '  <tng-paginator',
  '    ariaLabel="Compact result pages"',
  '    size="sm"',
  '    [totalItems]="64"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="8"',
  '    [showFirstLast]="false"',
  '    [showPageSize]="false"',
  '    [showRange]="false"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const serverTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngPaginatorComponent } from '@tailng-ui/components';",
  '',
  '@Component({',
  "  selector: 'app-server-paginator',",
  '  standalone: true,',
  '  imports: [TngPaginatorComponent],',
  "  templateUrl: './server-paginator.component.html',",
  "  styleUrl: './server-paginator.component.css',",
  '})',
  'export class ServerPaginatorComponent {',
  '  protected readonly pageIndex = signal(0);',
  '  protected readonly pageSize = signal(25);',
  '}',
].join('\n');

const serverPlainHtml = [
  '<section class="paginator-card">',
  '  <tng-paginator',
  '    ariaLabel="Server result pages"',
  '    mode="server"',
  '    [totalItems]="250"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="pageSize()"',
  '    [pageSizeOptions]="[25, 50, 100]"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '    (pageSizeChange)="pageSize.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const serverPlainCss = [
  '.paginator-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
].join('\n');

const serverTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-paginator',
  '    ariaLabel="Server result pages"',
  '    mode="server"',
  '    [totalItems]="250"',
  '    [pageIndex]="pageIndex()"',
  '    [pageSize]="pageSize()"',
  '    [pageSizeOptions]="[25, 50, 100]"',
  '    (pageIndexChange)="pageIndex.set($event)"',
  '    (pageSizeChange)="pageSize.set($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

@Component({
  selector: 'app-pagination-examples-page',
  imports: [TngPaginatorComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  template: `
    <article class="pagination-doc">
      <h2 class="pagination-doc__title">Examples</h2>
      <p class="pagination-doc__lead">
        Copy-pasteable paginator examples with separate Angular, HTML, and CSS files.
      </p>

      <app-docs-example-tabs-section
        id="compact-toolbar"
        class="pagination-doc__block"
        heading="Compact toolbar"
        description="Hide range text and first/last controls when the paginator sits inside a narrow toolbar."
        ariaLabel="Compact paginator variants"
        tabListAriaLabel="Compact paginator style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Compact paginator (Plain CSS)"
          [codeTabs]="compactPlainCodeTabs"
        >
          <section class="paginator-toolbar">
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
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Compact paginator (Tailwind CSS)"
          [codeTabs]="compactTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-3">
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
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="server-pagination"
        class="pagination-doc__block"
        heading="Server pagination"
        description="Use server mode when the backend owns page availability and result fetching."
        ariaLabel="Server paginator variants"
        tabListAriaLabel="Server paginator style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Server paginator (Plain CSS)"
          [codeTabs]="serverPlainCodeTabs"
        >
          <section class="paginator-card">
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
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Server paginator (Tailwind CSS)"
          [codeTabs]="serverTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
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
      .pagination-doc__block,
      .paginator-toolbar,
      .paginator-card {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 1rem;
        padding: 1rem;
      }
    `,
  ],
})
export class PaginationExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly compactPlainCodeTabs = createCodeTabs(
    'compact-paginator-plain-css',
    compactTs,
    compactPlainHtml,
    compactPlainCss,
  );
  protected readonly compactTailwindCodeTabs = createCodeTabs(
    'compact-paginator-tailwind',
    compactTs,
    compactTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly serverPlainCodeTabs = createCodeTabs(
    'server-paginator-plain-css',
    serverTs,
    serverPlainHtml,
    serverPlainCss,
  );
  protected readonly serverTailwindCodeTabs = createCodeTabs(
    'server-paginator-tailwind',
    serverTs,
    serverTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly compactPageIndex = signal(1);
  protected readonly serverPageIndex = signal(0);
  protected readonly serverPageSize = signal(25);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
