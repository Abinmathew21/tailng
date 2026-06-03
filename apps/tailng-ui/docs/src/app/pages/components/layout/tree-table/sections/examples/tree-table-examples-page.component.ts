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

// ── Shared types ──────────────────────────────────────────────────────────────
type AccountRow = {
  id: string;
  name: string;
  type: string;
  balance: number;
  children?: AccountRow[];
};

type FileRow = {
  id: string;
  name: string;
  size: string;
  modified: string;
  children?: FileRow[];
};

// ── Code-tab factory ──────────────────────────────────────────────────────────
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

// ── 1. Basic tree table ───────────────────────────────────────────────────────
const basicTs = [
  "import { Component } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  '@Component({ selector: \'app-basic-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class BasicTreeTableComponent {',
  '  protected expandedKeys: readonly TngTreeTableKey[] = [];',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  '    { key: \'name\', label: \'Account\', treeToggle: true, accessor: r => r.name },',
  '    { key: \'type\', label: \'Type\', accessor: r => r.type },',
  '    { key: \'balance\', label: \'Balance\', align: \'end\', accessor: r => r.balance },',
  '  ];',
  '  protected readonly data: readonly AccountRow[] = [',
  '    { id: \'assets\', name: \'Assets\', type: \'Group\', balance: 10000, children: [',
  '      { id: \'cash\', name: \'Cash\', type: \'Ledger\', balance: 3000 },',
  '    ]},',
  '    { id: \'liab\', name: \'Liabilities\', type: \'Group\', balance: 4000 },',
  '  ];',
  '  protected readonly getKey = (row: AccountRow) => row.id;',
  '  protected readonly getChildren = (row: AccountRow) => row.children;',
  '}',
].join('\n');

const basicHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys"',
  '  (expandedKeysChange)="expandedKeys = $event"',
  '/>',
].join('\n');

const sharedCss = [
  'tng-tree-table {',
  '  --tng-tree-table-radius: 0.75rem;',
  '  --tng-tree-table-cell-px: 1rem;',
  '}',
].join('\n');

// ── 2. Controlled expanded keys ───────────────────────────────────────────────
const controlledTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  '@Component({ selector: \'app-controlled-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class ControlledTreeTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([\'assets\']);',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  '    { key: \'name\', label: \'Account\', treeToggle: true, accessor: r => r.name },',
  '    { key: \'type\', label: \'Type\', accessor: r => r.type },',
  '  ];',
  '  // ... data, getKey, getChildren same as basic example',
  '  protected toggleAll(): void {',
  '    this.expandedKeys.set(this.expandedKeys().length > 0 ? [] : [\'assets\', \'liab\']);',
  '  }',
  '}',
].join('\n');

const controlledHtml = [
  '<button (click)="toggleAll()">Toggle all</button>',
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys()"',
  '  (expandedKeysChange)="expandedKeys.set($event)"',
  '/>',
].join('\n');

// ── 3. Selectable rows ────────────────────────────────────────────────────────
const selectableTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  '@Component({ selector: \'app-selectable-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class SelectableTreeTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly selectedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  // ... columns, data, getKey, getChildren same as basic example',
  '}',
].join('\n');

const selectableHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  selectable',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys()"',
  '  [selectedKeys]="selectedKeys()"',
  '  (expandedKeysChange)="expandedKeys.set($event)"',
  '  (selectedKeysChange)="selectedKeys.set($event)"',
  '/>',
].join('\n');

// ── 4. Loading state ──────────────────────────────────────────────────────────
const loadingTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  '',
  '@Component({ selector: \'app-loading-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class LoadingTreeTableComponent {',
  '  protected readonly loading = signal(true);',
  '  protected readonly columns = [',
  '    { key: \'name\', label: \'Account\', treeToggle: true },',
  '    { key: \'balance\', label: \'Balance\', align: \'end\' as const },',
  '  ];',
  '}',
].join('\n');

const loadingHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  loadingText="Fetching accounts…"',
  '  [loading]="loading()"',
  '  [columns]="columns"',
  '  [data]="[]"',
  '  [getKey]="r => r.id"',
  '  [getChildren]="r => undefined"',
  '/>',
].join('\n');

// ── 5. Empty state ────────────────────────────────────────────────────────────
const emptyTs = [
  "import { Component } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  '',
  '@Component({ selector: \'app-empty-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class EmptyTreeTableComponent {',
  '  protected readonly columns = [',
  '    { key: \'name\', label: \'Account\', treeToggle: true },',
  '    { key: \'balance\', label: \'Balance\', align: \'end\' as const },',
  '  ];',
  '}',
].join('\n');

const emptyHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  emptyText="No accounts found"',
  '  [columns]="columns"',
  '  [data]="[]"',
  '  [getKey]="r => r.id"',
  '  [getChildren]="r => undefined"',
  '/>',
].join('\n');

// ── 6. Custom tree column ─────────────────────────────────────────────────────
const customTreeColTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type FileRow = { id: string; name: string; size: string; modified: string; children?: FileRow[] };',
  '',
  '@Component({ selector: \'app-file-tree-table\', standalone: true, imports: [TngTreeTableComponent] })',
  'export class FileTreeTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly columns: readonly TngTreeTableColumn<FileRow>[] = [',
  '    // treeColumnKey=\'name\' on the component selects the tree column when treeToggle is not set',
  '    { key: \'name\', label: \'Name\', accessor: r => r.name },',
  '    { key: \'size\', label: \'Size\', align: \'end\', accessor: r => r.size },',
  '    { key: \'modified\', label: \'Modified\', accessor: r => r.modified },',
  '  ];',
  '  protected readonly getKey = (row: FileRow) => row.id;',
  '  protected readonly getChildren = (row: FileRow) => row.children;',
  '}',
].join('\n');

const customTreeColHtml = [
  '<tng-tree-table',
  '  ariaLabel="Files"',
  '  treeColumnKey="name"',
  '  [indentSize]="16"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys()"',
  '  (expandedKeysChange)="expandedKeys.set($event)"',
  '/>',
].join('\n');

@Component({
  selector: 'app-tree-table-examples-page',
  imports: [TngTreeTableComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  template: `
    <article class="tree-table-doc">
      <h2 class="tree-table-doc__title">Examples</h2>
      <p class="tree-table-doc__lead">
        Copy-pasteable tree table examples. Each demo is interactive — click the toggle buttons or
        press ArrowRight/Left on any row.
      </p>

      <!-- 1. Basic -->
      <app-docs-example-tabs-section
        id="basic-tree-table"
        class="tree-table-doc__block"
        heading="Basic tree table"
        description="Click the expand button or press ArrowRight on a parent row to reveal children."
        ariaLabel="Basic tree table variants"
        tabListAriaLabel="Basic tree table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Basic tree table"
          [codeTabs]="basicCodeTabs"
        >
          <div class="tree-demo-shell">
            <tng-tree-table
              ariaLabel="Accounts"
              [columns]="accountColumns"
              [data]="accountData"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
              [expandedKeys]="basicExpandedKeys()"
              (expandedKeysChange)="basicExpandedKeys.set($event)"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Basic tree table (Tailwind)"
          [codeTabs]="basicCodeTabs"
        >
          <tng-tree-table
            ariaLabel="Accounts"
            class="[--tng-tree-table-radius:0.75rem] [--tng-tree-table-cell-px:1rem]"
            [columns]="accountColumns"
            [data]="accountData"
            [getKey]="getAccountKey"
            [getChildren]="getAccountChildren"
            [expandedKeys]="basicExpandedKeys()"
            (expandedKeysChange)="basicExpandedKeys.set($event)"
          />
        </ng-template>
      </app-docs-example-tabs-section>

      <!-- 2. Controlled expanded keys -->
      <app-docs-example-tabs-section
        id="controlled-expanded-keys"
        class="tree-table-doc__block"
        heading="Controlled expanded keys"
        description="Drive expansion from outside using a signal. The component never mutates the input array."
        ariaLabel="Controlled expanded keys variants"
        tabListAriaLabel="Controlled expanded keys style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Controlled expansion"
          [codeTabs]="controlledCodeTabs"
        >
          <div class="tree-demo-shell">
            <div class="tree-demo-toolbar">
              <button class="tree-demo-btn" (click)="toggleAllAccounts()">
                {{ controlledExpandedKeys().length > 0 ? 'Collapse all' : 'Expand all' }}
              </button>
            </div>
            <tng-tree-table
              ariaLabel="Accounts"
              [columns]="accountColumns"
              [data]="accountData"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
              [expandedKeys]="controlledExpandedKeys()"
              (expandedKeysChange)="controlledExpandedKeys.set($event)"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Controlled expansion (Tailwind)"
          [codeTabs]="controlledCodeTabs"
        >
          <div class="flex flex-col gap-2">
            <button
              class="self-start rounded-md border border-tng-border-subtle px-3 py-1.5 text-sm"
              (click)="toggleAllAccounts()"
            >
              {{ controlledExpandedKeys().length > 0 ? 'Collapse all' : 'Expand all' }}
            </button>
            <tng-tree-table
              ariaLabel="Accounts"
              class="[--tng-tree-table-radius:0.75rem] [--tng-tree-table-cell-px:1rem]"
              [columns]="accountColumns"
              [data]="accountData"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
              [expandedKeys]="controlledExpandedKeys()"
              (expandedKeysChange)="controlledExpandedKeys.set($event)"
            />
          </div>
        </ng-template>
      </app-docs-example-tabs-section>

      <!-- 3. Selectable rows -->
      <app-docs-example-tabs-section
        id="selectable-rows"
        class="tree-table-doc__block"
        heading="Selectable rows"
        description="Enable selectable to allow Space-key and programmatic row selection. Selected keys are controlled — the component emits a new array."
        ariaLabel="Selectable rows variants"
        tabListAriaLabel="Selectable rows style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Selectable rows"
          [codeTabs]="selectableCodeTabs"
        >
          <div class="tree-demo-shell">
            <p class="tree-demo-status">
              Selected: {{ selectedKeys().join(', ') || 'none' }}
            </p>
            <tng-tree-table
              ariaLabel="Accounts"
              selectable
              [columns]="accountColumns"
              [data]="accountData"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
              [expandedKeys]="selectableExpandedKeys()"
              [selectedKeys]="selectedKeys()"
              (expandedKeysChange)="selectableExpandedKeys.set($event)"
              (selectedKeysChange)="selectedKeys.set($event)"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Selectable rows (Tailwind)"
          [codeTabs]="selectableCodeTabs"
        >
          <div class="flex flex-col gap-2">
            <p class="text-sm text-tng-fg-secondary">
              Selected: {{ selectedKeys().join(', ') || 'none' }}
            </p>
            <tng-tree-table
              ariaLabel="Accounts"
              selectable
              class="[--tng-tree-table-radius:0.75rem] [--tng-tree-table-cell-px:1rem]"
              [columns]="accountColumns"
              [data]="accountData"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
              [expandedKeys]="selectableExpandedKeys()"
              [selectedKeys]="selectedKeys()"
              (expandedKeysChange)="selectableExpandedKeys.set($event)"
              (selectedKeysChange)="selectedKeys.set($event)"
            />
          </div>
        </ng-template>
      </app-docs-example-tabs-section>

      <!-- 4. Loading state -->
      <app-docs-example-tabs-section
        id="loading-state"
        class="tree-table-doc__block"
        heading="Loading state"
        description="Set loading to show a full-width row. Loading takes priority over the empty state."
        ariaLabel="Loading state variants"
        tabListAriaLabel="Loading state style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Loading state"
          [codeTabs]="loadingCodeTabs"
        >
          <div class="tree-demo-shell">
            <tng-tree-table
              ariaLabel="Accounts"
              loadingText="Fetching accounts…"
              [loading]="true"
              [columns]="accountColumns"
              [data]="[]"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Loading state (Tailwind)"
          [codeTabs]="loadingCodeTabs"
        >
          <tng-tree-table
            ariaLabel="Accounts"
            loadingText="Fetching accounts…"
            class="[--tng-tree-table-radius:0.75rem]"
            [loading]="true"
            [columns]="accountColumns"
            [data]="[]"
            [getKey]="getAccountKey"
            [getChildren]="getAccountChildren"
          />
        </ng-template>
      </app-docs-example-tabs-section>

      <!-- 5. Empty state -->
      <app-docs-example-tabs-section
        id="empty-state"
        class="tree-table-doc__block"
        heading="Empty state"
        description="When data is an empty array (and loading is false), the empty row is displayed."
        ariaLabel="Empty state variants"
        tabListAriaLabel="Empty state style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Empty state"
          [codeTabs]="emptyCodeTabs"
        >
          <div class="tree-demo-shell">
            <tng-tree-table
              ariaLabel="Accounts"
              emptyText="No accounts match your filter"
              [columns]="accountColumns"
              [data]="[]"
              [getKey]="getAccountKey"
              [getChildren]="getAccountChildren"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Empty state (Tailwind)"
          [codeTabs]="emptyCodeTabs"
        >
          <tng-tree-table
            ariaLabel="Accounts"
            emptyText="No accounts match your filter"
            class="[--tng-tree-table-radius:0.75rem]"
            [columns]="accountColumns"
            [data]="[]"
            [getKey]="getAccountKey"
            [getChildren]="getAccountChildren"
          />
        </ng-template>
      </app-docs-example-tabs-section>

      <!-- 6. Custom tree column -->
      <app-docs-example-tabs-section
        id="custom-tree-column"
        class="tree-table-doc__block"
        heading="Custom tree column"
        description="Use treeColumnKey to pick the tree column by id when no column has treeToggle: true. Adjust indentSize for tighter or wider hierarchies."
        ariaLabel="Custom tree column variants"
        tabListAriaLabel="Custom tree column style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Custom tree column"
          [codeTabs]="customTreeColCodeTabs"
        >
          <div class="tree-demo-shell">
            <tng-tree-table
              ariaLabel="Files"
              treeColumnKey="name"
              [indentSize]="16"
              [columns]="fileColumns"
              [data]="fileData"
              [getKey]="getFileKey"
              [getChildren]="getFileChildren"
              [expandedKeys]="fileExpandedKeys()"
              (expandedKeysChange)="fileExpandedKeys.set($event)"
            />
          </div>
        </ng-template>
        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Custom tree column (Tailwind)"
          [codeTabs]="customTreeColCodeTabs"
        >
          <tng-tree-table
            ariaLabel="Files"
            treeColumnKey="name"
            class="[--tng-tree-table-radius:0.75rem]"
            [indentSize]="16"
            [columns]="fileColumns"
            [data]="fileData"
            [getKey]="getFileKey"
            [getChildren]="getFileChildren"
            [expandedKeys]="fileExpandedKeys()"
            (expandedKeysChange)="fileExpandedKeys.set($event)"
          />
        </ng-template>
      </app-docs-example-tabs-section>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .tree-table-doc {
        display: grid;
        gap: 1.5rem;
      }

      .tree-table-doc__title {
        font-size: clamp(1.45rem, 1.05rem + 1.3vw, 1.95rem);
        font-weight: 700;
        line-height: 1.2;
        margin: 0;
      }

      .tree-table-doc__lead {
        color: var(--tng-semantic-foreground-secondary);
        margin: 0;
        max-width: 72ch;
      }

      .tree-table-doc__block,
      .tree-demo-shell {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 1rem;
        padding: 1rem;
      }

      .tree-demo-toolbar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      .tree-demo-btn {
        background: transparent;
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 0.375rem;
        cursor: pointer;
        font-size: 0.875rem;
        padding: 0.375rem 0.75rem;
      }

      .tree-demo-btn:hover {
        background: color-mix(
          in srgb,
          var(--tng-semantic-foreground-primary) 6%,
          var(--tng-semantic-background-surface)
        );
      }

      .tree-demo-status {
        color: var(--tng-semantic-foreground-secondary);
        font-size: 0.8125rem;
        margin: 0 0 0.5rem;
      }
    `,
  ],
})
export class TreeTableExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  // ── Code tabs ──────────────────────────────────────────────────────────────

  protected readonly basicCodeTabs = createCodeTabs('basic-tree-table', basicTs, basicHtml, sharedCss);
  protected readonly controlledCodeTabs = createCodeTabs('controlled-tree-table', controlledTs, controlledHtml, sharedCss);
  protected readonly selectableCodeTabs = createCodeTabs('selectable-tree-table', selectableTs, selectableHtml, sharedCss);
  protected readonly loadingCodeTabs = createCodeTabs('loading-tree-table', loadingTs, loadingHtml, sharedCss);
  protected readonly emptyCodeTabs = createCodeTabs('empty-tree-table', emptyTs, emptyHtml, sharedCss);
  protected readonly customTreeColCodeTabs = createCodeTabs('custom-tree-col', customTreeColTs, customTreeColHtml, sharedCss);

  // ── Account data (shared across demos 1–5) ─────────────────────────────────

  protected readonly accountColumns: readonly TngTreeTableColumn<AccountRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    { key: 'type', label: 'Type', accessor: (r) => r.type },
    { key: 'balance', label: 'Balance', align: 'end', accessor: (r) => r.balance.toLocaleString() },
  ];

  protected readonly accountData: readonly AccountRow[] = [
    {
      id: 'assets',
      name: 'Assets',
      type: 'Group',
      balance: 13000,
      children: [
        { id: 'cash', name: 'Cash', type: 'Ledger', balance: 3000 },
        {
          id: 'invest',
          name: 'Investments',
          type: 'Group',
          balance: 10000,
          children: [
            { id: 'stocks', name: 'Stocks', type: 'Ledger', balance: 6000 },
            { id: 'bonds', name: 'Bonds', type: 'Ledger', balance: 4000 },
          ],
        },
      ],
    },
    {
      id: 'liab',
      name: 'Liabilities',
      type: 'Group',
      balance: 4000,
      children: [{ id: 'loan', name: 'Bank Loan', type: 'Ledger', balance: 4000 }],
    },
    { id: 'equity', name: 'Equity', type: 'Group', balance: 9000 },
  ];

  protected readonly getAccountKey = (row: AccountRow) => row.id;
  protected readonly getAccountChildren = (row: AccountRow) => row.children;

  // ── Per-demo expansion / selection state ───────────────────────────────────

  protected readonly basicExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly controlledExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly selectableExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly selectedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly fileExpandedKeys = signal<readonly TngTreeTableKey[]>([]);

  protected toggleAllAccounts(): void {
    const allGroupIds: TngTreeTableKey[] = ['assets', 'invest', 'liab'];
    this.controlledExpandedKeys.set(
      this.controlledExpandedKeys().length > 0 ? [] : allGroupIds,
    );
  }

  // ── File data (demo 6) ────────────────────────────────────────────────────

  protected readonly fileColumns: readonly TngTreeTableColumn<FileRow>[] = [
    { key: 'name', label: 'Name', accessor: (r) => r.name },
    { key: 'size', label: 'Size', align: 'end', accessor: (r) => r.size },
    { key: 'modified', label: 'Modified', accessor: (r) => r.modified },
  ];

  protected readonly fileData: readonly FileRow[] = [
    {
      id: 'src',
      name: 'src/',
      size: '—',
      modified: 'Today',
      children: [
        {
          id: 'app',
          name: 'app/',
          size: '—',
          modified: 'Today',
          children: [
            { id: 'app-ts', name: 'app.component.ts', size: '3.1 KB', modified: '2h ago' },
            { id: 'app-html', name: 'app.component.html', size: '1.2 KB', modified: '2h ago' },
          ],
        },
        { id: 'main', name: 'main.ts', size: '512 B', modified: 'Yesterday' },
      ],
    },
    { id: 'pkg', name: 'package.json', size: '1.8 KB', modified: 'Last week' },
  ];

  protected readonly getFileKey = (row: FileRow) => row.id;
  protected readonly getFileChildren = (row: FileRow) => row.children;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
