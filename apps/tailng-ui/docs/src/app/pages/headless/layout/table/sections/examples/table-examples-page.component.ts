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

type ReleaseRow = Readonly<{ owner: string; service: string; status: string }>;

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

const headlessTableTs = [
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

const releasePlainHtml = [
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

const releasePlainCss = [
  '.table-scroll { overflow-x: auto; border: 1px solid #d7dde8; border-radius: 12px; }',
  '.table { border-collapse: collapse; min-width: 100%; }',
  'th, td { border-bottom: 1px solid #e6eaf2; padding: 0.75rem; text-align: left; }',
  'thead { background: #f6f8fb; }',
  'tr:last-child td { border-bottom: 0; }',
].join('\n');

const releaseTailwindHtml = [
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

const stickyPlainHtml = releasePlainHtml.replace(
  '<th tngTableHeaderCell scope="col">Service</th>',
  '<th tngTableHeaderCell scope="col" tngTableStickyColumn="start">Service</th>',
);
const stickyPlainCss = `${releasePlainCss}\n[data-sticky] { background: white; }`;
const stickyTailwindHtml = releaseTailwindHtml.replace(
  '<th tngTableHeaderCell scope="col" class="p-3 text-left">Service</th>',
  '<th tngTableHeaderCell scope="col" tngTableStickyColumn="start" class="bg-tng-bg-muted p-3 text-left">Service</th>',
);

@Component({
  selector: 'app-headless-table-examples-page',
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
    <article class="table-doc">
      <h2 class="table-doc__title">Examples</h2>
      <p class="table-doc__lead">
        Copy-pasteable headless table examples with separate Angular, HTML, and CSS files.
      </p>

      <app-docs-example-tabs-section
        id="release-queue"
        class="table-doc__block"
        heading="Release queue"
        description="Compose native table markup with primitive slots and your own visual classes."
        ariaLabel="Release queue table variants"
        tabListAriaLabel="Release queue table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Release queue (Plain CSS)"
          [codeTabs]="releasePlainCodeTabs"
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
          panelTitle="Release queue (Tailwind CSS)"
          [codeTabs]="releaseTailwindCodeTabs"
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

      <app-docs-example-tabs-section
        id="sticky-columns"
        class="table-doc__block"
        heading="Sticky columns"
        description="Keep row identity visible in horizontally scrolling operational tables."
        ariaLabel="Sticky table variants"
        tabListAriaLabel="Sticky table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Sticky column (Plain CSS)"
          [codeTabs]="stickyPlainCodeTabs"
        >
          <p>
            Use <code>tngTableStickyColumn="start"</code> on header and body cells that should
            remain pinned.
          </p>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Sticky column (Tailwind CSS)"
          [codeTabs]="stickyTailwindCodeTabs"
        >
          <p>
            Apply Tailwind utilities to the same primitive slots while the sticky state comes from
            the directive.
          </p>
        </ng-template>
      </app-docs-example-tabs-section>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .table-doc {
        display: grid;
        gap: 1.5rem;
      }
      .table-doc__title {
        font-size: clamp(1.45rem, 1.05rem + 1.3vw, 1.95rem);
        font-weight: 700;
        margin: 0;
      }
      .table-doc__lead {
        color: var(--tng-semantic-foreground-secondary);
        margin: 0;
        max-width: 72ch;
      }
      .table-doc__block,
      .table-scroll {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 1rem;
      }
      .table-doc__block {
        padding: 1rem;
      }
      .table-scroll {
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
export class HeadlessTableExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly releasePlainCodeTabs = createCodeTabs(
    'release-queue-table-plain-css',
    headlessTableTs,
    releasePlainHtml,
    releasePlainCss,
  );
  protected readonly releaseTailwindCodeTabs = createCodeTabs(
    'release-queue-table-tailwind',
    headlessTableTs,
    releaseTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly stickyPlainCodeTabs = createCodeTabs(
    'sticky-table-plain-css',
    headlessTableTs,
    stickyPlainHtml,
    stickyPlainCss,
  );
  protected readonly stickyTailwindCodeTabs = createCodeTabs(
    'sticky-table-tailwind',
    headlessTableTs,
    stickyTailwindHtml,
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
