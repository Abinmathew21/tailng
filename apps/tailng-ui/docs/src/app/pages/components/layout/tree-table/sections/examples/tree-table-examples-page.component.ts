import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngTreeTableCellTemplate,
  TngTreeTableComponent,
  type TngTreeTableColumn,
  type TngTreeTableFlatRow,
  type TngTreeTableStyleInput,
} from '@tailng-ui/components';
import type { TngTreeTableKey } from '@tailng-ui/primitives';
import { TngIcon } from '@tailng-ui/icons';
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

type LedgerRow = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'review';
  balance: number;
  children?: LedgerRow[];
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

// ── Shared CSS ────────────────────────────────────────────────────────────────

const sharedCss = [
  'tng-tree-table {',
  '  --tng-tree-table-radius: 0.75rem;',
  '  --tng-tree-table-cell-px: 1rem;',
  '}',
].join('\n');

// ── 1. Basic tree table ───────────────────────────────────────────────────────

const basicTs = [
  "import { Component } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-basic-tree-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class BasicTreeTableComponent {',
  '  protected expandedKeys: readonly TngTreeTableKey[] = [];',
  "  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [",
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name },",
  "    { key: 'type', label: 'Type', accessor: r => r.type },",
  "    { key: 'balance', label: 'Balance', align: 'end', accessor: r => r.balance },",
  '  ];',
  '  protected readonly data: readonly AccountRow[] = [',
  "    { id: 'assets', name: 'Assets', type: 'Group', balance: 10000, children: [",
  "      { id: 'cash', name: 'Cash', type: 'Ledger', balance: 3000 },",
  '    ]},',
  "    { id: 'liab', name: 'Liabilities', type: 'Group', balance: 4000 },",
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

// ── 2. Controlled expanded keys ───────────────────────────────────────────────

const controlledTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-controlled-tree-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class ControlledTreeTableComponent {',
  "  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>(['assets']);",
  '  // ... columns, data, getKey, getChildren same as basic example',
  '  protected toggleAll(): void {',
  "    this.expandedKeys.set(this.expandedKeys().length > 0 ? [] : ['assets', 'liab']);",
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
  "@Component({ selector: 'app-selectable-tree-table', standalone: true, imports: [TngTreeTableComponent] })",
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

const loadingHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  loadingText="Fetching accounts…"',
  '  [loading]="true"',
  '  [columns]="columns"',
  '  [data]="[]"',
  '  [getKey]="r => r.id"',
  '  [getChildren]="r => undefined"',
  '/>',
].join('\n');

// ── 5. Empty state ────────────────────────────────────────────────────────────

const emptyHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  emptyText="No accounts match your filter"',
  '  [columns]="columns"',
  '  [data]="[]"',
  '  [getKey]="r => r.id"',
  '  [getChildren]="r => undefined"',
  '/>',
].join('\n');

// ── 6. Custom tree column ─────────────────────────────────────────────────────

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

// ── 7. rowClass / rowStyle ────────────────────────────────────────────────────

const rowStyleTs = [
  "import { Component, signal } from '@angular/core';",
  "import {",
  "  TngTreeTableComponent,",
  "  type TngTreeTableColumn,",
  "  type TngTreeTableFlatRow,",
  "} from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-row-style-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class RowStyleTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name },",
  "    { key: 'type', label: 'Type', accessor: r => r.type },",
  "    { key: 'balance', label: 'Balance', align: 'end', accessor: r => r.balance.toLocaleString() },",
  '  ];',
  '  // ... data, getKey, getChildren same as basic example',
  '',
  '  // rowStyle: paint the row background via a CSS custom property.',
  '  // rowClass: receives flatRow so it can style by level, expansion, or selection.',
  '  protected readonly rowStyleFn = (row: AccountRow) =>',
  "    row.balance < 0 ? { '--tng-tree-table-row-bg': 'var(--row-risk-bg)' } : null;",
  '',
  '  protected readonly rowClassFn = (',
  '    _row: AccountRow,',
  '    flatRow: TngTreeTableFlatRow<AccountRow>,',
  '  ) => flatRow.level === 0 ? \'is-group-row\' : null;',
  '}',
].join('\n');

const rowStyleHtml = [
  '<tng-tree-table',
  '  ariaLabel="Accounts"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys()"',
  '  [rowStyle]="rowStyleFn"',
  '  [rowClass]="rowClassFn"',
  '  (expandedKeysChange)="expandedKeys.set($event)"',
  '/>',
].join('\n');

const rowStyleCss = [
  '.row-style-demo {',
  '  /* Danger tint for negative-balance rows */',
  '  --row-risk-bg: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-accent-danger) 10%,',
  '    var(--tng-semantic-background-surface)',
  '  );',
  '}',
  '',
  '/* Bold text for root-level group rows */',
  '.row-style-demo ::ng-deep .is-group-row {',
  '  font-weight: 650;',
  '}',
].join('\n');

// ── 8. cellClass / cellStyle ──────────────────────────────────────────────────

const cellStyleTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-cell-style-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class CellStyleTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name },",
  '    {',
  "      key: 'type',",
  "      label: 'Type',",
  '      accessor: r => r.type,',
  '      // cellClass: add badge classes based on the type value',
  '      cellClass: (row) =>',
  "        row.type === 'Group' ? 'type-pill type-pill--group' : 'type-pill type-pill--leaf',",
  '    },',
  '    {',
  "      key: 'balance',",
  "      label: 'Balance',",
  "      align: 'end',",
  '      accessor: r => r.balance.toLocaleString(),',
  '      // cellStyle: color negative values with a danger token',
  "      cellStyle: (row) => row.balance < 0 ? { color: 'var(--cell-danger-fg)', fontWeight: 650 } : null,",
  '    },',
  '  ];',
  '  // ... data, getKey, getChildren same as basic example',
  '}',
].join('\n');

const cellStyleHtml = [
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

const cellStyleCss = [
  '.cell-style-demo {',
  '  --cell-danger-fg: var(--tng-semantic-accent-danger);',
  '}',
  '',
  '.cell-style-demo ::ng-deep .type-pill .tng-tree-table__cell-content {',
  '  border-radius: 999px;',
  '  display: inline-flex;',
  '  flex: 0 0 auto;',
  '  font-size: 0.75rem;',
  '  font-weight: 500;',
  '  padding: 0.125rem 0.5rem;',
  '}',
  '',
  '.cell-style-demo ::ng-deep .type-pill--group .tng-tree-table__cell-content {',
  '  background: color-mix(in srgb, var(--tng-semantic-accent-info) 12%, transparent);',
  '  color: var(--tng-semantic-accent-info);',
  '}',
  '',
  '.cell-style-demo ::ng-deep .type-pill--leaf .tng-tree-table__cell-content {',
  '  background: color-mix(in srgb, var(--tng-semantic-foreground-primary) 8%, transparent);',
  '  color: var(--tng-semantic-foreground-secondary);',
  '}',
].join('\n');

// ── 9. headerClass / headerStyle ──────────────────────────────────────────────

const headerStyleTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-header-style-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class HeaderStyleTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  '    {',
  "      key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name,",
  "      // headerClass: add a custom class to the header cell",
  "      headerClass: 'col-header--primary',",
  '    },',
  '    {',
  "      key: 'type', label: 'Type', accessor: r => r.type,",
  "      // headerClass: visually de-emphasise the metadata column",
  "      headerClass: 'col-header--muted',",
  '    },',
  '    {',
  "      key: 'balance', label: 'Balance', align: 'end', accessor: r => r.balance.toLocaleString(),",
  '      // headerStyle: inline style — accent color for the financial column',
  "      headerStyle: { color: 'var(--tng-semantic-accent-info)', fontWeight: 700 },",
  '    },',
  '  ];',
  '  // ... data, getKey, getChildren same as basic example',
  '}',
].join('\n');

const headerStyleHtml = [
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

const headerStyleCss = [
  ':host ::ng-deep .col-header--primary {',
  '  color: var(--tng-semantic-foreground-primary) !important;',
  '  font-weight: 700;',
  '}',
  '',
  ':host ::ng-deep .col-header--muted {',
  '  color: var(--tng-semantic-foreground-tertiary, var(--tng-semantic-foreground-secondary));',
  '  font-weight: 500;',
  '}',
].join('\n');

// ── 10. Group header columns ──────────────────────────────────────────────────

const groupHeaderTs = [
  "import { Component, signal } from '@angular/core';",
  "import { TngTreeTableComponent, type TngTreeTableColumn } from '@tailng-ui/components';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = { id: string; name: string; type: string; balance: number; children?: AccountRow[] };',
  '',
  "@Component({ selector: 'app-group-header-tree-table', standalone: true, imports: [TngTreeTableComponent] })",
  'export class GroupHeaderTreeTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly columns: readonly TngTreeTableColumn<AccountRow>[] = [',
  '    // Leaf column — hosts the tree toggle',
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name },",
  '    // Group column — produces a colspan header; no body cells',
  '    {',
  "      key: 'financial',",
  "      label: 'Financial',",
  "      headerClass: 'group-col-header',",
  "      headerStyle: { color: 'var(--tng-semantic-accent-info)' },",
  '      children: [',
  "        { key: 'type', label: 'Type', accessor: r => r.type },",
  "        { key: 'balance', align: 'end', accessor: r => r.balance.toLocaleString() },",
  "        { key: 'internalMemo', label: 'Internal memo', hidden: true },",
  '      ],',
  '    },',
  '  ];',
  '  // ... data, getKey, getChildren same as basic example',
  '}',
].join('\n');

const groupHeaderHtml = [
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

const groupHeaderCss = [
  'tng-tree-table {',
  '  --tng-tree-table-group-header-bg: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-accent-info) 8%,',
  '    var(--tng-semantic-background-surface)',
  '  );',
  '}',
  '',
  ':host ::ng-deep .group-col-header {',
  '  font-weight: 700;',
  '  font-size: 0.7rem;',
  '  text-transform: uppercase;',
  '}',
].join('\n');

// ── 11. Cell templates ────────────────────────────────────────────────────────

const cellTemplateTs = [
  "import { Component, signal } from '@angular/core';",
  "import {",
  "  TngTreeTableCellTemplate,",
  "  TngTreeTableComponent,",
  "  type TngTreeTableColumn,",
  "} from '@tailng-ui/components';",
  "import { TngIcon } from '@tailng-ui/icons';",
  "import type { TngTreeTableKey } from '@tailng-ui/primitives';",
  '',
  'type LedgerRow = {',
  '  id: string;',
  '  name: string;',
  "  status: 'active' | 'inactive' | 'review';",
  '  balance: number;',
  '  children?: LedgerRow[];',
  '};',
  '',
  "@Component({",
  "  selector: 'app-cell-template-tree-table',",
  '  standalone: true,',
  '  imports: [TngTreeTableComponent, TngTreeTableCellTemplate, TngIcon],',
  '})',
  'export class CellTemplateTreeTableComponent {',
  '  protected readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);',
  '  protected readonly lastAction = signal<string | null>(null);',
  '',
  '  protected readonly columns: readonly TngTreeTableColumn<LedgerRow>[] = [',
  "    { key: 'name', label: 'Account', treeToggle: true, accessor: r => r.name },",
  "    { key: 'status', label: 'Status', align: 'center', width: '9rem' },",
  "    { key: 'balance', label: 'Balance', align: 'end', accessor: r => r.balance.toLocaleString() },",
  "    { key: 'actions', label: 'Actions', align: 'end', width: '8rem' },",
  '  ];',
  '',
  '  protected readonly data: readonly LedgerRow[] = [',
  "    { id: 'assets', name: 'Assets', status: 'active', balance: 13000, children: [",
  "      { id: 'cash', name: 'Cash', status: 'active', balance: 3000 },",
  "      { id: 'invest', name: 'Investments', status: 'review', balance: 10000, children: [",
  "        { id: 'stocks', name: 'Stocks', status: 'active', balance: 6000 },",
  "        { id: 'bonds', name: 'Bonds', status: 'inactive', balance: 4000 },",
  '      ]},',
  '    ]},',
  "    { id: 'liab', name: 'Liabilities', status: 'review', balance: -4000, children: [",
  "      { id: 'loan', name: 'Bank Loan', status: 'active', balance: -4000 },",
  '    ]},',
  "    { id: 'equity', name: 'Equity', status: 'active', balance: 9000 },",
  '  ];',
  '',
  '  protected readonly getKey = (row: LedgerRow): TngTreeTableKey => row.id;',
  '  protected readonly getChildren = (row: LedgerRow) => row.children;',
  '',
  '  protected onView(row: LedgerRow): void { this.lastAction.set(`View: ${row.name}`); }',
  '  protected onEdit(row: LedgerRow): void { this.lastAction.set(`Edit: ${row.name}`); }',
  '  protected onDelete(row: LedgerRow): void { this.lastAction.set(`Delete: ${row.name}`); }',
  '}',
].join('\n');

const cellTemplateHtml = [
  '<p *ngIf="lastAction()">Last action: {{ lastAction() }}</p>',
  '',
  '<tng-tree-table',
  '  ariaLabel="Ledger accounts"',
  '  [columns]="columns"',
  '  [data]="data"',
  '  [getKey]="getKey"',
  '  [getChildren]="getChildren"',
  '  [expandedKeys]="expandedKeys()"',
  '  (expandedKeysChange)="expandedKeys.set($event)"',
  '>',
  '  <!-- Status badge: renders a colored pill from the row status value -->',
  '  <ng-template tngTreeTableCellTemplate="status" let-row="row">',
  '    <span class="status-badge" [attr.data-status]="row.status">',
  '      {{ row.status }}',
  '    </span>',
  '  </ng-template>',
  '',
  '  <!-- Actions: icon buttons for view / edit / delete -->',
  '  <ng-template tngTreeTableCellTemplate="actions" let-row="row">',
  '    <div class="row-actions">',
  '      <button type="button" class="action-btn" aria-label="View" (click)="onView(row)">',
  '        <tng-icon icon="eye" />',
  '      </button>',
  '      <button type="button" class="action-btn" aria-label="Edit" (click)="onEdit(row)">',
  '        <tng-icon icon="pencil" />',
  '      </button>',
  '      <button type="button" class="action-btn action-btn--danger" aria-label="Delete" (click)="onDelete(row)">',
  '        <tng-icon icon="trash-2" />',
  '      </button>',
  '    </div>',
  '  </ng-template>',
  '</tng-tree-table>',
].join('\n');

const cellTemplateCss = [
  'tng-tree-table {',
  '  --tng-tree-table-radius: 0.75rem;',
  '  --tng-tree-table-cell-px: 1rem;',
  '}',
  '',
  '/* Status badge */  ',
  '.status-badge {',
  '  border-radius: 999px;',
  '  display: inline-flex;',
  '  font-size: 0.75rem;',
  '  font-weight: 500;',
  '  padding: 0.125rem 0.625rem;',
  '  text-transform: capitalize;',
  '}',
  '',
  '.status-badge[data-status="active"] {',
  '  background: color-mix(in srgb, var(--tng-semantic-accent-success) 14%, transparent);',
  '  color: var(--tng-semantic-accent-success);',
  '}',
  '',
  '.status-badge[data-status="inactive"] {',
  '  background: color-mix(in srgb, var(--tng-semantic-foreground-primary) 8%, transparent);',
  '  color: var(--tng-semantic-foreground-secondary);',
  '}',
  '',
  '.status-badge[data-status="review"] {',
  '  background: color-mix(in srgb, var(--tng-semantic-accent-warning) 14%, transparent);',
  '  color: var(--tng-semantic-accent-warning);',
  '}',
  '',
  '/* Action buttons */  ',
  '.row-actions {',
  '  align-items: center;',
  '  display: flex;',
  '  gap: 0.25rem;',
  '  justify-content: flex-end;',
  '}',
  '',
  '.action-btn {',
  '  align-items: center;',
  '  background: transparent;',
  '  border: none;',
  '  border-radius: 0.375rem;',
  '  color: var(--tng-semantic-foreground-secondary);',
  '  cursor: pointer;',
  '  display: inline-flex;',
  '  height: 1.75rem;',
  '  justify-content: center;',
  '  padding: 0;',
  '  transition: background 120ms, color 120ms;',
  '  width: 1.75rem;',
  '}',
  '',
  '.action-btn:hover {',
  '  background: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-foreground-primary) 8%,',
  '    var(--tng-semantic-background-surface)',
  '  );',
  '  color: var(--tng-semantic-foreground-primary);',
  '}',
  '',
  '.action-btn--danger:hover {',
  '  background: color-mix(in srgb, var(--tng-semantic-accent-danger) 12%, transparent);',
  '  color: var(--tng-semantic-accent-danger);',
  '}',
  '',
  '.action-btn tng-icon {',
  '  font-size: 1rem;',
  '}',
].join('\n');

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tree-table-examples-page',
  imports: [
    TngTreeTableComponent,
    TngTreeTableCellTemplate,
    TngIcon,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tree-table-examples-page.component.html',
  styleUrl: './tree-table-examples-page.component.css',
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

  protected readonly basicCodeTabs = createCodeTabs(
    'basic-tree-table', basicTs, basicHtml, sharedCss,
  );
  protected readonly controlledCodeTabs = createCodeTabs(
    'controlled-tree-table', controlledTs, controlledHtml, sharedCss,
  );
  protected readonly selectableCodeTabs = createCodeTabs(
    'selectable-tree-table', selectableTs, selectableHtml, sharedCss,
  );
  protected readonly loadingCodeTabs = createCodeTabs(
    'loading-tree-table',
    "// See HTML tab — set [loading]='true' and provide columns.",
    loadingHtml,
    sharedCss,
  );
  protected readonly emptyCodeTabs = createCodeTabs(
    'empty-tree-table',
    "// See HTML tab — pass an empty [] to [data].",
    emptyHtml,
    sharedCss,
  );
  protected readonly customTreeColCodeTabs = createCodeTabs(
    'custom-tree-col',
    "// Use treeColumnKey='name' when no column has treeToggle: true.",
    customTreeColHtml,
    sharedCss,
  );
  protected readonly rowStyleCodeTabs = createCodeTabs(
    'row-style-tree-table', rowStyleTs, rowStyleHtml, rowStyleCss,
  );
  protected readonly cellStyleCodeTabs = createCodeTabs(
    'cell-style-tree-table', cellStyleTs, cellStyleHtml, cellStyleCss,
  );
  protected readonly headerStyleCodeTabs = createCodeTabs(
    'header-style-tree-table', headerStyleTs, headerStyleHtml, headerStyleCss,
  );
  protected readonly groupHeaderCodeTabs = createCodeTabs(
    'group-header-tree-table', groupHeaderTs, groupHeaderHtml, groupHeaderCss,
  );
  protected readonly cellTemplateCodeTabs = createCodeTabs(
    'cell-template-tree-table', cellTemplateTs, cellTemplateHtml, cellTemplateCss,
  );

  // ── Account data (shared) ─────────────────────────────────────────────────

  protected readonly accountColumns: readonly TngTreeTableColumn<AccountRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    { key: 'type', label: 'Type', accessor: (r) => r.type },
    {
      key: 'balance',
      label: 'Balance',
      align: 'end',
      accessor: (r) => r.balance.toLocaleString(),
    },
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

  protected readonly getAccountKey = (row: AccountRow): TngTreeTableKey => row.id;
  protected readonly getAccountChildren = (row: AccountRow): readonly AccountRow[] | undefined =>
    row.children;

  // ── Styling demo data (negative balances for contrast) ────────────────────

  protected readonly stylingData: readonly AccountRow[] = [
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
      balance: -4000,
      children: [{ id: 'loan', name: 'Bank Loan', type: 'Ledger', balance: -4000 }],
    },
    { id: 'equity', name: 'Equity', type: 'Group', balance: 9000 },
  ];

  // ── Per-demo expansion / selection state ──────────────────────────────────

  protected readonly basicExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly controlledExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly selectableExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly selectedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly fileExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly rowStyleExpandedKeys = signal<readonly TngTreeTableKey[]>(['assets', 'liab']);
  protected readonly cellStyleExpandedKeys = signal<readonly TngTreeTableKey[]>(['assets', 'liab']);
  protected readonly headerStyleExpandedKeys = signal<readonly TngTreeTableKey[]>([]);
  protected readonly groupHeaderExpandedKeys = signal<readonly TngTreeTableKey[]>([]);

  protected toggleAllAccounts(): void {
    const allGroupIds: TngTreeTableKey[] = ['assets', 'invest', 'liab'];
    this.controlledExpandedKeys.set(
      this.controlledExpandedKeys().length > 0 ? [] : allGroupIds,
    );
  }

  // ── Demo 7: row hooks ─────────────────────────────────────────────────────

  protected readonly rowStyleFn = (row: AccountRow): TngTreeTableStyleInput =>
    row.balance < 0 ? { '--tng-tree-table-row-bg': 'var(--row-risk-bg)' } : null;

  protected readonly rowClassFn = (
    _row: AccountRow,
    flatRow: TngTreeTableFlatRow<AccountRow>,
  ): string | null => (flatRow.level === 0 ? 'is-group-row' : null);

  // ── Demo 8: cell hooks ────────────────────────────────────────────────────

  protected readonly cellStyledColumns: readonly TngTreeTableColumn<AccountRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    {
      key: 'type',
      label: 'Type',
      accessor: (r) => r.type,
      cellClass: (row) =>
        row.type === 'Group' ? 'type-pill type-pill--group' : 'type-pill type-pill--leaf',
    },
    {
      key: 'balance',
      label: 'Balance',
      align: 'end',
      accessor: (r) => r.balance.toLocaleString(),
      cellStyle: (row): TngTreeTableStyleInput =>
        row.balance < 0
          ? { color: 'var(--cell-danger-fg)', fontWeight: 650 }
          : null,
    },
  ];

  // ── Demo 9: header hooks ──────────────────────────────────────────────────

  protected readonly headerStyledColumns: readonly TngTreeTableColumn<AccountRow>[] = [
    {
      key: 'name',
      label: 'Account',
      treeToggle: true,
      accessor: (r) => r.name,
      headerClass: 'col-header--primary',
    },
    {
      key: 'type',
      label: 'Type',
      accessor: (r) => r.type,
      headerClass: 'col-header--muted',
    },
    {
      key: 'balance',
      label: 'Balance',
      align: 'end',
      accessor: (r) => r.balance.toLocaleString(),
      headerStyle: { color: 'var(--tng-semantic-accent-info)', fontWeight: 700 },
    },
  ];

  // ── Demo 10: group header columns ─────────────────────────────────────────

  protected readonly groupHeaderColumns: readonly TngTreeTableColumn<AccountRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    {
      key: 'financial',
      label: 'Financial',
      headerClass: 'group-col-header',
      headerStyle: { color: 'var(--tng-semantic-accent-info)' },
      children: [
        { key: 'type', label: 'Type', accessor: (r) => r.type },
        {
          key: 'balance',
          align: 'end',
          accessor: (r) => r.balance.toLocaleString(),
        },
        { key: 'internalMemo', label: 'Internal memo', hidden: true },
      ],
    },
  ];

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

  protected readonly getFileKey = (row: FileRow): TngTreeTableKey => row.id;
  protected readonly getFileChildren = (row: FileRow): readonly FileRow[] | undefined =>
    row.children;

  // ── Demo 11: cell templates ───────────────────────────────────────────────

  protected readonly cellTemplateExpandedKeys = signal<readonly TngTreeTableKey[]>(['assets', 'liab']);
  protected readonly cellTemplateLastAction = signal<string | null>(null);

  protected readonly ledgerColumns: readonly TngTreeTableColumn<LedgerRow>[] = [
    { key: 'name', label: 'Account', treeToggle: true, accessor: (r) => r.name },
    { key: 'status', label: 'Status', align: 'center', width: '9rem' },
    {
      key: 'balance',
      label: 'Balance',
      align: 'end',
      accessor: (r) => r.balance.toLocaleString(),
    },
    { key: 'actions', label: 'Actions', align: 'end', width: '8rem' },
  ];

  protected readonly ledgerData: readonly LedgerRow[] = [
    {
      id: 'assets',
      name: 'Assets',
      status: 'active',
      balance: 13000,
      children: [
        { id: 'cash', name: 'Cash', status: 'active', balance: 3000 },
        {
          id: 'invest',
          name: 'Investments',
          status: 'review',
          balance: 10000,
          children: [
            { id: 'stocks', name: 'Stocks', status: 'active', balance: 6000 },
            { id: 'bonds', name: 'Bonds', status: 'inactive', balance: 4000 },
          ],
        },
      ],
    },
    {
      id: 'liab',
      name: 'Liabilities',
      status: 'review',
      balance: -4000,
      children: [{ id: 'loan', name: 'Bank Loan', status: 'active', balance: -4000 }],
    },
    { id: 'equity', name: 'Equity', status: 'active', balance: 9000 },
  ];

  protected readonly getLedgerKey = (row: LedgerRow): TngTreeTableKey => row.id;
  protected readonly getLedgerChildren = (row: LedgerRow): readonly LedgerRow[] | undefined =>
    row.children;

  protected onLedgerView(row: LedgerRow): void {
    this.cellTemplateLastAction.set(`View: ${row.name}`);
  }

  protected onLedgerEdit(row: LedgerRow): void {
    this.cellTemplateLastAction.set(`Edit: ${row.name}`);
  }

  protected onLedgerDelete(row: LedgerRow): void {
    this.cellTemplateLastAction.set(`Delete: ${row.name}`);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
