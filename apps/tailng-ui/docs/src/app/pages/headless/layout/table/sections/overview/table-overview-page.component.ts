import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngTable,
  TngTableBody,
  TngTableCell,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableRow,
  TngTableScrollContainer,
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
  "import { TngTable, TngTableBody, TngTableCell, TngTableHeader, TngTableHeaderCell, TngTableRow, TngTableScrollContainer } from '@tailng-ui/primitives';",
  '',
  'type ReleaseRow = Readonly<{ service: string; owner: string; status: string }>; ',
  '',
  '@Component({',
  "  selector: 'app-release-queue-table',",
  '  standalone: true,',
  '  imports: [TngTableScrollContainer, TngTable, TngTableHeader, TngTableBody, TngTableRow, TngTableHeaderCell, TngTableCell],',
  "  templateUrl: './release-queue-table.component.html',",
  "  styleUrl: './release-queue-table.component.css',",
  '})',
  'export class ReleaseQueueTableComponent {',
  '  protected readonly rows: readonly ReleaseRow[] = [',
  "    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },",
  "    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },",
  "    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },",
  '  ];',
  '}',
].join('\n');

const plainHtml = [
  '<div tngTableScrollContainer class="table-scroll">',
  '  <table tngTable ariaLabel="Release queue" [items]="rows" class="table">',
  '    <thead tngTableHeader>',
  '      <tr tngTableRow>',
  '        <th tngTableHeaderCell scope="col">Service</th>',
  '        <th tngTableHeaderCell scope="col">Owner</th>',
  '        <th tngTableHeaderCell scope="col">Status</th>',
  '      </tr>',
  '    </thead>',
  '    <tbody tngTableBody>',
  '      @for (row of rows; track row.service) {',
  '        <tr tngTableRow [tngTableRowId]="row.service">',
  '          <td tngTableCell>{{ row.service }}</td>',
  '          <td tngTableCell>{{ row.owner }}</td>',
  '          <td tngTableCell>{{ row.status }}</td>',
  '        </tr>',
  '      }',
  '    </tbody>',
  '  </table>',
  '</div>',
  '',
].join('\n');

const plainCss = [
  '.table-scroll { overflow-x: auto; border: 1px solid #d7dde8; border-radius: 12px; }',
  '.table { border-collapse: collapse; min-width: 100%; }',
  'th, td { border-bottom: 1px solid #e6eaf2; padding: 0.75rem; text-align: left; }',
  'thead { background: #f6f8fb; }',
].join('\n');

const tailwindHtml = [
  '<div tngTableScrollContainer class="overflow-x-auto rounded-xl border border-tng-border-subtle">',
  '  <table tngTable ariaLabel="Release queue" [items]="rows" class="min-w-full border-collapse text-sm">',
  '    <thead tngTableHeader class="bg-tng-bg-muted">',
  '      <tr tngTableRow>',
  '        <th tngTableHeaderCell scope="col" class="p-3 text-left">Service</th>',
  '        <th tngTableHeaderCell scope="col" class="p-3 text-left">Owner</th>',
  '        <th tngTableHeaderCell scope="col" class="p-3 text-left">Status</th>',
  '      </tr>',
  '    </thead>',
  '    <tbody tngTableBody>',
  '      @for (row of rows; track row.service) {',
  '        <tr tngTableRow [tngTableRowId]="row.service">',
  '          <td tngTableCell class="border-t border-tng-border-subtle p-3">{{ row.service }}</td>',
  '          <td tngTableCell class="border-t border-tng-border-subtle p-3">{{ row.owner }}</td>',
  '          <td tngTableCell class="border-t border-tng-border-subtle p-3">{{ row.status }}</td>',
  '        </tr>',
  '      }',
  '    </tbody>',
  '  </table>',
  '</div>',
  '',
].join('\n');

@Component({
  selector: 'app-headless-table-overview-page',
  imports: [
    TngTableScrollContainer,
    TngTable,
    TngTableHeader,
    TngTableBody,
    TngTableRow,
    TngTableHeaderCell,
    TngTableCell,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Table overview</h2>
          <p class="docs-overview-lead">
            Headless table adds stable slots, focus management, row ids, sticky metadata, and
            data-state hooks to native table markup.
          </p>
        </section>

        <app-docs-example-tabs-section
          id="basic-composition"
          class="docs-section-anchor docs-overview-block"
          heading="Basic composition"
          description="Compose native table markup with primitive directives and your own styles."
          ariaLabel="Headless table overview variants"
          tabListAriaLabel="Headless table overview style tabs"
          defaultValue="plain-css"
          [codeBlockTheme]="codeBlockTheme()"
        >
          <ng-template
            appDocsExampleVariant
            value="plain-css"
            label="Plain-CSS"
            panelTitle="Headless table (Plain CSS)"
            [codeTabs]="plainCodeTabs"
          >
            <div tngTableScrollContainer class="table-scroll">
              <table tngTable ariaLabel="Release queue" [items]="rows" class="table">
                <thead tngTableHeader>
                  <tr tngTableRow>
                    <th tngTableHeaderCell scope="col">Service</th>
                    <th tngTableHeaderCell scope="col">Owner</th>
                    <th tngTableHeaderCell scope="col">Status</th>
                  </tr>
                </thead>
                <tbody tngTableBody>
                  @for (row of rows; track row.service) {
                    <tr tngTableRow [tngTableRowId]="row.service">
                      <td tngTableCell>{{ row.service }}</td>
                      <td tngTableCell>{{ row.owner }}</td>
                      <td tngTableCell>{{ row.status }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </ng-template>

          <ng-template
            appDocsExampleVariant
            value="tailwind-css"
            label="Tailwind CSS"
            panelTitle="Headless table (Tailwind CSS)"
            [codeTabs]="tailwindCodeTabs"
          >
            <div
              tngTableScrollContainer
              class="overflow-x-auto rounded-xl border border-tng-border-subtle"
            >
              <table
                tngTable
                ariaLabel="Release queue"
                [items]="rows"
                class="min-w-full border-collapse text-sm"
              >
                <thead tngTableHeader class="bg-tng-bg-muted">
                  <tr tngTableRow>
                    <th tngTableHeaderCell scope="col" class="p-3 text-left">Service</th>
                    <th tngTableHeaderCell scope="col" class="p-3 text-left">Owner</th>
                    <th tngTableHeaderCell scope="col" class="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody tngTableBody>
                  @for (row of rows; track row.service) {
                    <tr tngTableRow [tngTableRowId]="row.service">
                      <td tngTableCell class="border-t border-tng-border-subtle p-3">
                        {{ row.service }}
                      </td>
                      <td tngTableCell class="border-t border-tng-border-subtle p-3">
                        {{ row.owner }}
                      </td>
                      <td tngTableCell class="border-t border-tng-border-subtle p-3">
                        {{ row.status }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </ng-template>
        </app-docs-example-tabs-section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>
              Keep native <code>table</code>, <code>thead</code>, <code>tbody</code>,
              <code>tr</code>, <code>th</code>, and <code>td</code> semantics.
            </li>
            <li>
              Use <code>ariaLabel</code> or <code>ariaLabelledby</code> when the table has no
              visible caption.
            </li>
            <li>Interactive controls inside cells are ignored by row click handling.</li>
          </ul>
        </section>
      </div>
    </article>
  `,
  styles: [
    `
      .table-scroll {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.875rem;
        overflow-x: auto;
      }
      .table {
        border-collapse: collapse;
        min-width: 100%;
      }
      th,
      td {
        border-bottom: 1px solid var(--tng-semantic-border-subtle);
        padding: 0.75rem;
        text-align: left;
      }
      thead {
        background: var(--tng-semantic-background-muted);
      }
    `,
  ],
})
export class HeadlessTableOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCodeTabs = createCodeTabs(
    'release-queue-table-plain-css',
    tsCode,
    plainHtml,
    plainCss,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'release-queue-table-tailwind',
    tsCode,
    tailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly rows: readonly ReleaseRow[] = [
    { service: 'Billing API', owner: 'Mina Lee', status: 'Ready' },
    { service: 'Docs shell', owner: 'Ava Mathews', status: 'Review' },
    { service: 'Search index', owner: 'Omar Aziz', status: 'Blocked' },
  ];

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
