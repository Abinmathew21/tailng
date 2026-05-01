import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type ReleaseRow = Readonly<{
  owner: string;
  service: string;
  status: string;
}>;

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
  "import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type ReleaseRow = Readonly<{ service: string; owner: string; status: string }>; ',
  '',
  '@Component({',
  "  selector: 'app-release-status-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent],',
  "  templateUrl: './release-status-table.component.html',",
  "  styleUrl: './release-status-table.component.css',",
  '})',
  'export class ReleaseStatusTableComponent {',
  '  protected readonly columns: readonly TngTableColumn<ReleaseRow>[] = [',
  "    { id: 'service', label: 'Service', sortable: true },",
  "    { id: 'owner', label: 'Owner' },",
  "    { id: 'status', label: 'Status' },",
  '  ];',
  '',
  '  protected readonly rows: readonly ReleaseRow[] = [',
  "    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },",
  "    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },",
  "    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },",
  '  ];',
  '}',
].join('\n');

const plainHtml = [
  '<section class="table-card">',
  '  <tng-table',
  '    ariaLabel="Release status"',
  '    density="compact"',
  '    stickyHeader',
  '    [columns]="columns"',
  '    [items]="rows"',
  '  />',
  '</section>',
  '',
].join('\n');

const plainCss = [
  '.table-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
  '',
  'tng-table {',
  '  --tng-table-radius: 0.75rem;',
  '  --tng-table-cell-px: 1rem;',
  '}',
].join('\n');

const tailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table',
  '    ariaLabel="Release status"',
  '    density="compact"',
  '    stickyHeader',
  '    class="[--tng-table-radius:0.75rem] [--tng-table-cell-px:1rem]"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '  />',
  '</section>',
  '',
].join('\n');

@Component({
  selector: 'app-table-overview-page',
  imports: [TngTableComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table overview</h2>
          <p class="docs-overview-lead">
            The styled table wrapper turns column metadata and row data into an accessible native
            table with sorting hooks, sticky columns, density controls, and state rows.
          </p>
        </section>

        <app-docs-example-tabs-section
          id="release-status"
          class="docs-section-anchor docs-overview-block"
          heading="Release status"
          description="A compact styled table with sticky headers for status-heavy dashboards."
          ariaLabel="Release status table variants"
          tabListAriaLabel="Release status table style tabs"
          defaultValue="plain-css"
          [codeBlockTheme]="codeBlockTheme()"
        >
          <ng-template
            appDocsExampleVariant
            value="plain-css"
            label="Plain-CSS"
            panelTitle="Release status table (Plain CSS)"
            [codeTabs]="plainCodeTabs"
          >
            <section class="table-card">
              <tng-table
                ariaLabel="Release status"
                [columns]="columns"
                [items]="rows"
                stickyHeader
                density="compact"
              />
            </section>
          </ng-template>

          <ng-template
            appDocsExampleVariant
            value="tailwind-css"
            label="Tailwind CSS"
            panelTitle="Release status table (Tailwind CSS)"
            [codeTabs]="tailwindCodeTabs"
          >
            <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
              <tng-table
                ariaLabel="Release status"
                class="[--tng-table-radius:0.75rem] [--tng-table-cell-px:1rem]"
                [columns]="columns"
                [items]="rows"
                stickyHeader
                density="compact"
              />
            </section>
          </ng-template>
        </app-docs-example-tabs-section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>
              Provide <code>ariaLabel</code> or <code>ariaLabelledby</code> when no caption is
              visible.
            </li>
            <li>Use meaningful column labels because sortable headers announce those labels.</li>
            <li>
              Keep cell actions focused and labelled; the wrapper preserves native table semantics.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
  styles: [
    `
      .table-card {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.875rem;
        padding: 1rem;
      }
    `,
  ],
})
export class TableOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCodeTabs = createCodeTabs(
    'release-status-table-plain-css',
    tsCode,
    plainHtml,
    plainCss,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'release-status-table-tailwind',
    tsCode,
    tailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly columns: readonly TngTableColumn<ReleaseRow>[] = [
    { id: 'service', label: 'Service', sortable: true },
    { id: 'owner', label: 'Owner' },
    { id: 'status', label: 'Status' },
  ];

  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
