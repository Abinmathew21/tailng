import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';
import type { TngTreeTableKey } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type AccountRow = {
  id: string;
  name: string;
  type: string;
  balance: number;
  children?: AccountRow[];
};

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
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  '@Component({',
  "  selector: 'app-chart-of-accounts',",
  '  standalone: true,',
  '  imports: [TngTreeTableComponent],',
  "  templateUrl: './chart-of-accounts.component.html',",
  '})',
  'export class ChartOfAccountsComponent {',
  '  protected expandedKeys: readonly TngTreeTableKey[] = [];',
  '',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },",
  "    { key: 'type', label: 'Type', accessor: (r) => r.type },",
  "    { key: 'balance', label: 'Balance', align: 'end', accessor: (r) => r.balance.toLocaleString() },",
  '  ];',
  '',
  '  protected readonly data: readonly AccountRow[] = [',
  "    { id: 'assets', name: 'Assets', type: 'Group', balance: 13000, children: [",
  "      { id: 'cash', name: 'Cash', type: 'Ledger', balance: 3000 },",
  "      { id: 'invest', name: 'Investments', type: 'Ledger', balance: 10000 },",
  '    ]},',
  "    { id: 'liab', name: 'Liabilities', type: 'Group', balance: 4000, children: [",
  "      { id: 'loan', name: 'Loan', type: 'Ledger', balance: 4000 },",
  '    ]},',
  "    { id: 'equity', name: 'Equity', type: 'Group', balance: 9000 },",
  '  ];',
  '',
  '  protected readonly getKey = (row: AccountRow) => row.id;',
  '  protected readonly getChildren = (row: AccountRow) => row.children;',
  '}',
].join('\n');

const plainHtml = [
  '<tng-tree-table',
  '  ariaLabel="Chart of accounts"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys"',
  '  (expandedKeysChange)="expandedKeys = $event"',
  '/>',
  '',
].join('\n');

const plainCss = [
  'tng-tree-table {',
  '  --tng-tree-table-radius: 0.75rem;',
  '  --tng-tree-table-cell-px: 1rem;',
  '}',
].join('\n');

const tailwindHtml = [
  '<tng-tree-table',
  '  ariaLabel="Chart of accounts"',
  '  class="[--tng-tree-table-radius:0.75rem] [--tng-tree-table-cell-px:1rem]"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys"',
  '  (expandedKeysChange)="expandedKeys = $event"',
  '/>',
  '',
].join('\n');

@Component({
  selector: 'app-tree-table-overview-page',
  imports: [TngTreeTableComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  template: `
    <article class="docs-section-page">
      <div class="docs-section-page-main">
        <section id="imports" class="docs-section-anchor docs-overview-block">
          <h2 class="docs-overview-title">Tree Table overview</h2>
          <p class="docs-overview-lead">
            <code>tng-tree-table</code> renders hierarchical rows inside a native
            <code>role="treegrid"</code> table. It is separate from <code>tng-table</code> (flat
            rows) and <code>tng-tree</code> (navigation tree), sharing ideas from both without
            coupling either. The component is signal-first and fully controlled: you own
            <code>expandedKeys</code> and <code>selectedKeys</code>.
          </p>
        </section>

        <app-docs-example-tabs-section
          id="chart-of-accounts"
          class="docs-section-anchor docs-overview-block"
          heading="Chart of accounts"
          description="A collapsible financial hierarchy. Each parent row is a group account; children are ledger lines."
          ariaLabel="Chart of accounts tree table variants"
          tabListAriaLabel="Chart of accounts style tabs"
          defaultValue="plain-css"
          [codeBlockTheme]="codeBlockTheme()"
        >
          <ng-template
            appDocsExampleVariant
            value="plain-css"
            label="Plain-CSS"
            panelTitle="Chart of accounts (Plain CSS)"
            [codeTabs]="plainCodeTabs"
          >
            <div class="tree-demo-shell">
              <tng-tree-table
                ariaLabel="Chart of accounts"
                [columns]="columns"
                [data]="data"
                [getKey]="getKey"
                [getChildren]="getChildren"
                [expandedKeys]="expandedKeys()"
                (expandedKeysChange)="expandedKeys.set($event)"
              />
            </div>
          </ng-template>

          <ng-template
            appDocsExampleVariant
            value="tailwind-css"
            label="Tailwind CSS"
            panelTitle="Chart of accounts (Tailwind CSS)"
            [codeTabs]="tailwindCodeTabs"
          >
            <tng-tree-table
              ariaLabel="Chart of accounts"
              class="[--tng-tree-table-radius:0.75rem] [--tng-tree-table-cell-px:1rem]"
              [columns]="columns"
              [data]="data"
              [getKey]="getKey"
              [getChildren]="getChildren"
              [expandedKeys]="expandedKeys()"
              (expandedKeysChange)="expandedKeys.set($event)"
            />
          </ng-template>
        </app-docs-example-tabs-section>

        <section id="key-concepts" class="docs-section-anchor docs-overview-block">
          <h3>Key concepts</h3>
          <ul class="docs-overview-list">
            <li>
              <strong>Flat data, tree shape.</strong> You pass flat typed data to
              <code>data</code> and provide <code>getChildren</code> and <code>getKey</code>
              accessors — the component flattens the tree into visible rows on each change.
            </li>
            <li>
              <strong>Fully controlled expansion.</strong> Bind <code>[expandedKeys]</code> and
              react to <code>(expandedKeysChange)</code>. The component never mutates the input
              array.
            </li>
            <li>
              <strong>Tree toggle column.</strong> Mark one column with
              <code>treeToggle: true</code>; it receives the indent spacer, expand/collapse button,
              and cell text. If none is marked, the first column is used.
            </li>
            <li>
              <strong>Keyboard navigation.</strong> ArrowRight expands, ArrowLeft collapses, Enter
              toggles, Space selects (when <code>selectable</code>), Home/End move focus.
            </li>
            <li>
              <strong>Treegrid accessibility.</strong> The table renders
              <code>role="treegrid"</code> with <code>aria-level</code>,
              <code>aria-expanded</code>, <code>aria-selected</code>, and
              <code>aria-disabled</code> on every row.
            </li>
          </ul>
        </section>

        <section id="accessibility-baseline" class="docs-section-anchor docs-overview-block">
          <h3>Accessibility baseline</h3>
          <ul class="docs-overview-list">
            <li>
              Always provide <code>ariaLabel</code> so screen readers can announce the treegrid
              purpose.
            </li>
            <li>
              Use meaningful column labels — they are announced when focus enters a header cell.
            </li>
            <li>
              Keep each <code>getKey</code> value stable across renders so focus is preserved after
              expand/collapse.
            </li>
          </ul>
        </section>
      </div>
    </article>
  `,
  styles: [
    `
      .tree-demo-shell {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.875rem;
        padding: 1rem;
      }
    `,
  ],
})
export class TreeTableOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCodeTabs = createCodeTabs(
    'chart-of-accounts-plain-css',
    tsCode,
    plainHtml,
    plainCss,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'chart-of-accounts-tailwind',
    tsCode,
    tailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);

  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    { key: 'type', label: 'Type', accessor: (r) => r.type },
    {
      key: 'balance',
      label: 'Balance',
      align: 'end',
      accessor: (r) => r.balance.toLocaleString(),
    },
  ];

  protected readonly data: readonly AccountRow[] = [
    {
      id: 'assets',
      name: 'Assets',
      type: 'Group',
      balance: 13000,
      children: [
        { id: 'cash', name: 'Cash', type: 'Ledger', balance: 3000 },
        { id: 'invest', name: 'Investments', type: 'Ledger', balance: 10000 },
      ],
    },
    {
      id: 'liab',
      name: 'Liabilities',
      type: 'Group',
      balance: 4000,
      children: [{ id: 'loan', name: 'Loan', type: 'Ledger', balance: 4000 }],
    },
    { id: 'equity', name: 'Equity', type: 'Group', balance: 9000 },
  ];

  protected readonly getKey = (row: AccountRow) => row.id;
  protected readonly getChildren = (row: AccountRow) => row.children;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
