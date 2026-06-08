import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngTableCellTemplate,
  TngTableComponent,
  TngTableHeaderTemplate,
  type TngTableColumn,
  type TngTableStyleInput,
} from '@tailng-ui/components';
import type { TngTableSortChange } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

type AccountRow = Readonly<{
  health: 'At risk' | 'Healthy' | 'Needs review';
  owner: string;
  plan: string;
  seats: number;
}>;

type PersonRow = Readonly<{
  anniversary: string;
  dob: string;
  email: string;
  firstName: string;
  lastName: string;
  notes: string;
  phone: string;
}>;

type DepartmentRow = Readonly<{
  department: string;
  employee: string;
  level: string;
  salary: string;
}>;

type StatementRow = Readonly<{
  amount: string;
  balance: string;
  category: string;
  date: string;
  description: string;
  method: string;
  reference: string;
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

const accountTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  "import type { TngTableSortChange } from '@tailng-ui/primitives';",
  '',
  'type AccountRow = Readonly<{ owner: string; plan: string; seats: number; health: string }>; ',
  '',
  '@Component({',
  "  selector: 'app-account-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent],',
  "  templateUrl: './account-table.component.html',",
  "  styleUrl: './account-table.component.css',",
  '})',
  'export class AccountTableComponent {',
  "  protected sortActive: string | null = 'owner';",
  "  protected sortDirection: 'asc' | 'desc' | null = 'asc';",
  '',
  '  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [',
  "    { id: 'owner', label: 'Owner', sortable: true },",
  "    { id: 'plan', label: 'Plan', sortable: true },",
  "    { id: 'seats', label: 'Seats', align: 'end', sortable: true },",
  "    { id: 'health', label: 'Health' },",
  '  ];',
  '',
  '  protected readonly rows: readonly AccountRow[] = [',
  "    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },",
  "    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },",
  "    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },",
  '  ];',
  '',
  '  protected onSortChange(change: TngTableSortChange): void {',
  '    this.sortActive = change.activeColumnId;',
  '    this.sortDirection = change.direction;',
  '  }',
  '}',
].join('\n');

const accountTablePlainHtml = [
  '<section class="table-card">',
  '  <tng-table',
  '    ariaLabel="Accounts"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    [sortActive]="sortActive"',
  '    [sortDirection]="sortDirection"',
  '    (sortChange)="onSortChange($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const accountTablePlainCss = [
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

const accountTableTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table',
  '    ariaLabel="Accounts"',
  '    class="[--tng-table-radius:0.75rem] [--tng-table-cell-px:1rem]"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    [sortActive]="sortActive"',
  '    [sortDirection]="sortDirection"',
  '    (sortChange)="onSortChange($event)"',
  '  />',
  '</section>',
  '',
].join('\n');

const healthTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableCellTemplate, TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type AccountRow = Readonly<{ owner: string; plan: string; seats: number; health: string }>; ',
  '',
  '@Component({',
  "  selector: 'app-account-health-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent, TngTableCellTemplate],',
  "  templateUrl: './account-health-table.component.html',",
  "  styleUrl: './account-health-table.component.css',",
  '})',
  'export class AccountHealthTableComponent {',
  '  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [',
  "    { id: 'owner', label: 'Owner' },",
  "    { id: 'plan', label: 'Plan' },",
  "    { id: 'seats', label: 'Seats', align: 'end' },",
  "    { id: 'health', label: 'Health' },",
  '  ];',
  '',
  '  protected readonly rows: readonly AccountRow[] = [',
  "    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },",
  "    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },",
  "    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },",
  '  ];',
  '}',
].join('\n');

const healthPlainHtml = [
  '<section class="table-card">',
  '  <tng-table ariaLabel="Account health" [columns]="columns" [items]="rows" density="compact">',
  '    <ng-template tngTableCellTemplate="health" let-value>',
  '      <span class="health-pill">{{ value }}</span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const healthPlainCss = [
  '.table-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
  '',
  '.health-pill {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 999px;',
  '  display: inline-flex;',
  '  font-size: 0.75rem;',
  '  padding: 0.25rem 0.55rem;',
  '}',
].join('\n');

const healthTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table ariaLabel="Account health" [columns]="columns" [items]="rows" density="compact">',
  '    <ng-template tngTableCellTemplate="health" let-value>',
  '      <span class="inline-flex rounded-full border border-tng-border-subtle px-2 py-1 text-xs">',
  '        {{ value }}',
  '      </span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const scrollTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type StatementRow = Readonly<{',
  '  date: string;',
  '  description: string;',
  '  category: string;',
  '  method: string;',
  '  reference: string;',
  '  status: string;',
  '  amount: string;',
  '  balance: string;',
  '}>;',
  '',
  '@Component({',
  "  selector: 'app-statement-preview-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent],',
  "  templateUrl: './statement-preview-table.component.html',",
  "  styleUrl: './statement-preview-table.component.css',",
  '})',
  'export class StatementPreviewTableComponent {',
  '  protected readonly columns: readonly TngTableColumn<StatementRow>[] = [',
  "    { id: 'date', label: 'Date', width: '8rem' },",
  "    { id: 'description', label: 'Description', width: '16rem' },",
  "    { id: 'category', label: 'Category', width: '10rem' },",
  "    { id: 'method', label: 'Method', width: '9rem' },",
  "    { id: 'reference', label: 'Reference', width: '10rem' },",
  "    { id: 'status', label: 'Status', width: '9rem' },",
  "    { id: 'amount', label: 'Amount', align: 'end', width: '8rem' },",
  "    { id: 'balance', label: 'Balance', align: 'end', width: '8rem' },",
  '  ];',
  '',
  '  protected readonly rows: readonly StatementRow[] = [',
  "    { date: 'Jan 02', description: 'Opening balance', category: 'Ledger', method: 'System', reference: 'BAL-1000', status: 'Posted', amount: '$0.00', balance: '$14,820.00' },",
  "    { date: 'Jan 04', description: 'Wire from Acme Supply', category: 'Receivable', method: 'Wire', reference: 'WIRE-1832', status: 'Posted', amount: '$3,240.00', balance: '$18,060.00' },",
  "    { date: 'Jan 08', description: 'Payroll batch', category: 'Payroll', method: 'ACH', reference: 'PAY-0148', status: 'Posted', amount: '-$6,850.00', balance: '$11,210.00' },",
  "    { date: 'Jan 10', description: 'Software subscription', category: 'Tools', method: 'Card', reference: 'CARD-4431', status: 'Posted', amount: '-$489.00', balance: '$10,721.00' },",
  "    { date: 'Jan 15', description: 'Client retainer', category: 'Revenue', method: 'ACH', reference: 'ACH-2204', status: 'Pending', amount: '$4,500.00', balance: '$15,221.00' },",
  "    { date: 'Jan 17', description: 'Travel reimbursement', category: 'Expense', method: 'ACH', reference: 'EXP-0911', status: 'Posted', amount: '-$780.00', balance: '$14,441.00' },",
  "    { date: 'Jan 22', description: 'Tax estimate', category: 'Tax', method: 'ACH', reference: 'TAX-2026', status: 'Scheduled', amount: '-$2,100.00', balance: '$12,341.00' },",
  '  ];',
  '}',
].join('\n');

const scrollPlainHtml = [
  '<section class="table-card">',
  '  <tng-table',
  '    class="statement-preview-table"',
  '    ariaLabel="Statement preview"',
  '    scrollAxis="both"',
  '    [stickyHeader]="true"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    density="compact"',
  '  />',
  '</section>',
  '',
].join('\n');

const scrollPlainCss = [
  '.table-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
  '',
  '.statement-preview-table {',
  '  --tng-table-scroll-max-height: min(14rem, 30vh);',
  '  --tng-table-min-width: 84rem;',
  '  --tng-table-header-bg: var(--tng-semantic-background-surface);',
  '}',
].join('\n');

const scrollTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table',
  '    ariaLabel="Statement preview"',
  '    class="[--tng-table-scroll-max-height:min(14rem,30vh)] [--tng-table-min-width:84rem] [--tng-table-header-bg:var(--tng-semantic-background-surface)]"',
  '    scrollAxis="both"',
  '    [stickyHeader]="true"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    density="compact"',
  '  />',
  '</section>',
  '',
].join('\n');

const groupedTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableComponent, TngTableHeaderTemplate, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type PersonRow = Readonly<{',
  '  firstName: string;',
  '  lastName: string;',
  '  email: string;',
  '  phone: string;',
  '  dob: string;',
  '  anniversary: string;',
  '  notes: string;',
  '}>;',
  '',
  '@Component({',
  "  selector: 'app-person-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent, TngTableHeaderTemplate],',
  "  templateUrl: './person-table.component.html',",
  "  styleUrl: './person-table.component.css',",
  '})',
  'export class PersonTableComponent {',
  '  protected readonly columns: readonly TngTableColumn<PersonRow>[] = [',
  '    {',
  "      id: 'person',",
  "      label: 'Person',",
  '      children: [',
  "        { id: 'firstName', label: 'First Name', sortable: true },",
  "        { id: 'lastName', label: 'Last Name', sortable: true },",
  '      ],',
  '    },',
  '    {',
  "      id: 'contact',",
  "      label: 'Contact',",
  '      children: [',
  "        { id: 'email', label: 'Email' },",
  "        { id: 'phone', label: 'Phone' },",
  '      ],',
  '    },',
  '    {',
  "      id: 'dates',",
  "      label: 'Important Dates',",
  '      children: [',
  "        { id: 'dob', label: 'Date of Birth' },",
  "        { id: 'anniversary', label: 'Anniversary' },",
  '      ],',
  '    },',
  "    { id: 'notes', label: 'Notes' },",
  '  ];',
  '',
  '  protected readonly rows: readonly PersonRow[] = [',
  '    {',
  "      firstName: 'Ada',",
  "      lastName: 'Lovelace',",
  "      email: 'ada@example.com',",
  "      phone: '+44 20 7946 0958',",
  "      dob: '1815-12-10',",
  "      anniversary: '1835-07-08',",
  "      notes: 'Mathematician',",
  '    },',
  '    {',
  "      firstName: 'Alan',",
  "      lastName: 'Turing',",
  "      email: 'alan@example.com',",
  "      phone: '+44 161 306 6000',",
  "      dob: '1912-06-23',",
  "      anniversary: '—',",
  "      notes: 'Computer scientist',",
  '    },',
  '    {',
  "      firstName: 'Grace',",
  "      lastName: 'Hopper',",
  "      email: 'grace@example.com',",
  "      phone: '+1 202 555 0117',",
  "      dob: '1906-12-09',",
  "      anniversary: '1930-06-15',",
  "      notes: 'Rear Admiral',",
  '    },',
  '  ];',
  '}',
].join('\n');

const groupedPlainHtml = [
  '<section class="table-card">',
  '  <tng-table ariaLabel="People" [columns]="columns" [items]="rows">',
  '    <ng-template tngTableHeaderTemplate="dates" let-label="label" let-colspan="colspan">',
  '      <span class="group-header">',
  '        {{ label }} <small>({{ colspan }} cols)</small>',
  '      </span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const groupedPlainCss = [
  '.table-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
  '',
  '.group-header {',
  '  display: inline-flex;',
  '  align-items: baseline;',
  '  gap: 0.35rem;',
  '  font-weight: 700;',
  '}',
  '',
  '.group-header small {',
  '  color: var(--tng-semantic-foreground-secondary);',
  '  font-weight: 500;',
  '}',
  '',
  '/* Visually separate group header rows from leaf header rows. */',
  '.table-card th[data-header-group] {',
  '  border-bottom: 1px solid var(--tng-semantic-border-subtle);',
  '  background: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-background-surface) 70%,',
  '    var(--tng-semantic-background-base) 30%',
  '  );',
  '}',
].join('\n');

const groupedTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table ariaLabel="People" [columns]="columns" [items]="rows">',
  '    <ng-template tngTableHeaderTemplate="dates" let-label="label" let-colspan="colspan">',
  '      <span class="inline-flex items-baseline gap-1 font-bold">',
  '        {{ label }}',
  '        <span class="text-xs font-medium text-tng-fg-secondary">({{ colspan }} cols)</span>',
  '      </span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const groupByTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableCellTemplate, TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type DepartmentRow = Readonly<{',
  '  department: string;',
  '  employee: string;',
  '  level: string;',
  '  salary: string;',
  '}>;',
  '',
  '@Component({',
  "  selector: 'app-department-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent, TngTableCellTemplate],',
  "  templateUrl: './department-table.component.html',",
  "  styleUrl: './department-table.component.css',",
  '})',
  'export class DepartmentTableComponent {',
  '  protected readonly columns: readonly TngTableColumn<DepartmentRow>[] = [',
  "    { id: 'department', label: 'Department', groupBy: true },",
  "    { id: 'employee', label: 'Employee' },",
  "    { id: 'level', label: 'Level' },",
  "    { id: 'salary', label: 'Salary', align: 'end' },",
  '  ];',
  '',
  '  // Rows should be pre-sorted by the group-by column.',
  '  protected readonly rows: readonly DepartmentRow[] = [',
  "    { department: 'Engineering', employee: 'Alice Nguyen', level: 'Staff', salary: '$148k' },",
  "    { department: 'Engineering', employee: 'Ben Carter', level: 'Senior', salary: '$132k' },",
  "    { department: 'Engineering', employee: 'Carla Diaz', level: 'Principal', salary: '$171k' },",
  "    { department: 'Sales', employee: 'Dev Malik', level: 'Manager', salary: '$118k' },",
  "    { department: 'Sales', employee: 'Eve Brooks', level: 'Associate', salary: '$86k' },",
  "    { department: 'People', employee: 'Frank Stone', level: 'Lead', salary: '$104k' },",
  '  ];',
  '}',
].join('\n');

const groupByPlainHtml = [
  '<section class="table-card group-by-demo">',
  '  <tng-table ariaLabel="Departments" hoverMode="group" [columns]="columns" [items]="rows" density="compact">',
  '    <ng-template tngTableCellTemplate="department" let-value let-groupSize="groupSize">',
  '      <span class="department-group">',
  '        <strong>{{ value }}</strong>',
  '        <small>{{ groupSize }} people</small>',
  '      </span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const groupByPlainCss = [
  '.table-card {',
  '  border: 1px solid var(--tng-semantic-border-subtle);',
  '  border-radius: 0.875rem;',
  '  padding: 1rem;',
  '}',
  '',
  '.department-group {',
  '  display: grid;',
  '  gap: 0.2rem;',
  '}',
  '',
  '.department-group small {',
  '  color: var(--tng-semantic-foreground-secondary);',
  '  font-size: 0.75rem;',
  '}',
  '',
  '.group-by-demo td[data-group-leader] {',
  '  background: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-background-surface) 82%,',
  '    var(--tng-semantic-background-base) 18%',
  '  );',
  '}',
].join('\n');

const groupByTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table ariaLabel="Departments" hoverMode="group" [columns]="columns" [items]="rows" density="compact">',
  '    <ng-template tngTableCellTemplate="department" let-value let-groupSize="groupSize">',
  '      <span class="grid gap-0.5">',
  '        <strong>{{ value }}</strong>',
  '        <span class="text-xs text-tng-fg-secondary">{{ groupSize }} people</span>',
  '      </span>',
  '    </ng-template>',
  '  </tng-table>',
  '</section>',
  '',
].join('\n');

const classHookTableTs = [
  "import { Component } from '@angular/core';",
  "import { TngTableComponent, type TngTableColumn } from '@tailng-ui/components';",
  '',
  'type AccountRow = Readonly<{ owner: string; plan: string; seats: number; health: string }>;',
  '',
  '@Component({',
  "  selector: 'app-account-class-table',",
  '  standalone: true,',
  '  imports: [TngTableComponent],',
  "  templateUrl: './account-class-table.component.html',",
  "  styleUrl: './account-class-table.component.css',",
  '})',
  'export class AccountClassTableComponent {',
  '  // Per-row style hook: return inline styles, CSS variables, or null.',
  '  protected readonly rowStyle = (row: AccountRow) =>',
  "    row.health === 'At risk'",
  "      ? { '--tng-table-row-bg': 'var(--account-risk-row-bg)' }",
  '      : null;',
  '',
  '  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [',
  "    { id: 'owner', label: 'Owner' },",
  "    { id: 'plan', label: 'Plan' },",
  '    {',
  "      id: 'seats',",
  "      label: 'Seats',",
  "      align: 'end',",
  '      // Per-cell style hook receives (row, value, index).',
  '      cellStyle: (_row, value) =>',
  "        Number(value) < 20 ? { color: 'var(--account-low-seat-color)', fontWeight: 650 } : null,",
  '    },',
  "    { id: 'health', label: 'Health' },",
  '  ];',
  '',
  '  protected readonly rows: readonly AccountRow[] = [',
  "    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },",
  "    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },",
  "    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },",
  '  ];',
  '}',
].join('\n');

const classHookPlainHtml = [
  '<section class="table-card account-style-table">',
  '  <tng-table',
  '    ariaLabel="Accounts"',
  '    density="compact"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    [rowStyle]="rowStyle"',
  '  />',
  '</section>',
  '',
].join('\n');

const classHookPlainCss = [
  '.account-style-table {',
  '  --account-risk-row-bg: color-mix(',
  '    in srgb,',
  '    var(--tng-semantic-accent-danger) 12%,',
  '    var(--tng-semantic-background-surface)',
  '  );',
  '  --account-low-seat-color: var(--tng-semantic-accent-danger);',
  '}',
].join('\n');

const classHookTailwindTs = classHookTableTs
  .replace("'var(--account-risk-row-bg)'", "'rgb(254 242 242)'")
  .replace("'var(--account-low-seat-color)'", "'rgb(220 38 38)'");

const classHookTailwindHtml = [
  '<section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">',
  '  <tng-table',
  '    ariaLabel="Accounts"',
  '    density="compact"',
  '    [columns]="columns"',
  '    [items]="rows"',
  '    [rowStyle]="rowStyle"',
  '  />',
  '</section>',
  '',
].join('\n');

@Component({
  selector: 'app-table-examples-page',
  imports: [
    TngTableComponent,
    TngTableCellTemplate,
    TngTableHeaderTemplate,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  template: `
    <article class="table-doc">
      <h2 class="table-doc__title">Examples</h2>
      <p class="table-doc__lead">
        Copy-pasteable table examples with separate Angular, HTML, and CSS files.
      </p>

      <app-docs-example-tabs-section
        id="sortable-account-table"
        class="table-doc__block"
        heading="Sortable account table"
        description="Use sortable column metadata with controlled sort state when the parent owns ordering."
        ariaLabel="Sortable table variants"
        tabListAriaLabel="Sortable table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Sortable table (Plain CSS)"
          [codeTabs]="sortablePlainCodeTabs"
        >
          <section class="table-demo-shell">
            <tng-table
              ariaLabel="Accounts"
              [columns]="columns"
              [items]="rows"
              [sortActive]="sortActive"
              [sortDirection]="sortDirection"
              (sortChange)="onSortChange($event)"
            />
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Sortable table (Tailwind CSS)"
          [codeTabs]="sortableTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <tng-table
              ariaLabel="Accounts"
              class="[--tng-table-radius:0.75rem] [--tng-table-cell-px:1rem]"
              [columns]="columns"
              [items]="rows"
              [sortActive]="sortActive"
              [sortDirection]="sortDirection"
              (sortChange)="onSortChange($event)"
            />
          </section>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="custom-cell-template"
        class="table-doc__block"
        heading="Custom cell template"
        description="Project a template for cells that need richer visual treatment than plain text."
        ariaLabel="Custom cell table variants"
        tabListAriaLabel="Custom cell table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Custom cell table (Plain CSS)"
          [codeTabs]="healthPlainCodeTabs"
        >
          <section class="table-demo-shell">
            <tng-table
              ariaLabel="Account health"
              [columns]="columns"
              [items]="rows"
              density="compact"
            >
              <ng-template tngTableCellTemplate="health" let-value>
                <span class="health-pill">{{ value }}</span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Custom cell table (Tailwind CSS)"
          [codeTabs]="healthTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <tng-table
              ariaLabel="Account health"
              [columns]="columns"
              [items]="rows"
              density="compact"
            >
              <ng-template tngTableCellTemplate="health" let-value>
                <span
                  class="inline-flex rounded-full border border-tng-border-subtle px-2 py-1 text-xs"
                >
                  {{ value }}
                </span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="scrollable-sticky-statement-table"
        class="table-doc__block"
        heading="Scrollable sticky statement table"
        description="Use scrollAxis with table sizing variables when the table needs both vertical and horizontal scrolling. The header stays sticky while the vertical axis scrolls."
        ariaLabel="Scrollable statement table variants"
        tabListAriaLabel="Scrollable statement table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Scrollable table (Plain CSS)"
          [codeTabs]="scrollPlainCodeTabs"
        >
          <section class="table-demo-shell">
            <tng-table
              class="statement-preview-table"
              ariaLabel="Statement preview"
              scrollAxis="both"
              [stickyHeader]="true"
              [columns]="statementColumns"
              [items]="statementRows"
              density="compact"
            />
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Scrollable table (Tailwind CSS)"
          [codeTabs]="scrollTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <tng-table
              ariaLabel="Statement preview"
              class="[--tng-table-scroll-max-height:min(14rem,30vh)] [--tng-table-min-width:84rem] [--tng-table-header-bg:var(--tng-semantic-background-surface)]"
              scrollAxis="both"
              [stickyHeader]="true"
              [columns]="statementColumns"
              [items]="statementRows"
              density="compact"
            />
          </section>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="grouped-column-headers"
        class="table-doc__block"
        heading="Grouped column headers"
        description="Compose a tree of columns to get multi-row headers with colspan and rowspan. Group columns carry only an id, label, and children — leaf columns keep their existing accessor, sortable, sticky, width and truncate options."
        ariaLabel="Grouped column header variants"
        tabListAriaLabel="Grouped column header style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Grouped headers (Plain CSS)"
          [codeTabs]="groupedPlainCodeTabs"
        >
          <section class="table-demo-shell grouped-demo">
            <tng-table ariaLabel="People" [columns]="personColumns" [items]="personRows">
              <ng-template tngTableHeaderTemplate="dates" let-label="label" let-colspan="colspan">
                <span class="group-header">
                  {{ label }} <small>({{ colspan }} cols)</small>
                </span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Grouped headers (Tailwind CSS)"
          [codeTabs]="groupedTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <tng-table ariaLabel="People" [columns]="personColumns" [items]="personRows">
              <ng-template tngTableHeaderTemplate="dates" let-label="label" let-colspan="colspan">
                <span class="inline-flex items-baseline gap-1 font-bold">
                  {{ label }}
                  <span class="text-xs font-medium text-tng-fg-secondary"
                    >({{ colspan }} cols)</span
                  >
                </span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="grouped-body-rows"
        class="table-doc__block"
        heading="Grouped body rows"
        description='Mark a leaf column with groupBy to merge consecutive equal values into native rowspan cells. Keep the incoming rows sorted by the grouped column so each group is contiguous. Set hoverMode="group" so hovering any row highlights the whole merged group instead of a single physical row.'
        ariaLabel="Grouped body row variants"
        tabListAriaLabel="Grouped body row style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Grouped body rows (Plain CSS)"
          [codeTabs]="groupByPlainCodeTabs"
        >
          <section class="table-demo-shell group-by-demo">
            <tng-table
              ariaLabel="Departments"
              hoverMode="group"
              [columns]="departmentColumns"
              [items]="departmentRows"
              density="compact"
            >
              <ng-template tngTableCellTemplate="department" let-value let-groupSize="groupSize">
                <span class="department-group">
                  <strong>{{ value }}</strong>
                  <small>{{ groupSize }} people</small>
                </span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Grouped body rows (Tailwind CSS)"
          [codeTabs]="groupByTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <tng-table
              ariaLabel="Departments"
              hoverMode="group"
              [columns]="departmentColumns"
              [items]="departmentRows"
              density="compact"
            >
              <ng-template tngTableCellTemplate="department" let-value let-groupSize="groupSize">
                <span class="grid gap-0.5">
                  <strong>{{ value }}</strong>
                  <span class="text-xs text-tng-fg-secondary">{{ groupSize }} people</span>
                </span>
              </ng-template>
            </tng-table>
          </section>
        </ng-template>
      </app-docs-example-tabs-section>

      <app-docs-example-tabs-section
        id="conditional-row-and-cell-classes"
        class="table-doc__block"
        heading="Conditional row and cell styling"
        description="Style specific rows and cells with the rowStyle input and column cellStyle hook. These apply inline styles and CSS custom properties to the table's internal elements, so component CSS variables can drive the result without global selectors."
        ariaLabel="Conditional styling table variants"
        tabListAriaLabel="Conditional styling table style tabs"
        defaultValue="plain-css"
        [codeBlockTheme]="codeBlockTheme()"
      >
        <ng-template
          appDocsExampleVariant
          value="plain-css"
          label="Plain-CSS"
          panelTitle="Conditional styles (Plain CSS)"
          [codeTabs]="classHookPlainCodeTabs"
        >
          <section class="table-demo-shell class-hook-demo">
            <tng-table
              ariaLabel="Accounts"
              density="compact"
              [columns]="classHookColumns"
              [items]="rows"
              [rowStyle]="classHookRowStyle"
            />
          </section>
        </ng-template>

        <ng-template
          appDocsExampleVariant
          value="tailwind-css"
          label="Tailwind CSS"
          panelTitle="Conditional styles (Tailwind CSS)"
          [codeTabs]="classHookTailwindCodeTabs"
        >
          <section class="rounded-xl border border-tng-border-subtle bg-tng-bg-surface p-4">
            <section class="class-hook-demo">
              <tng-table
                ariaLabel="Accounts"
                density="compact"
                [columns]="classHookColumns"
                [items]="rows"
                [rowStyle]="classHookRowStyle"
              />
            </section>
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

      .table-doc {
        display: grid;
        gap: 1.5rem;
        min-width: 0;
      }

      .table-doc__title {
        font-size: clamp(1.45rem, 1.05rem + 1.3vw, 1.95rem);
        font-weight: 700;
        line-height: 1.2;
        margin: 0;
      }

      .table-doc__lead {
        color: var(--tng-semantic-foreground-secondary);
        margin: 0;
        max-width: 72ch;
      }

      .table-doc__block,
      .table-demo-shell {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 1rem;
        max-width: 100%;
        min-width: 0;
        padding: 1rem;
      }

      .health-pill {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 999px;
        display: inline-flex;
        font-size: 0.75rem;
        padding: 0.25rem 0.55rem;
      }

      .statement-preview-table {
        --tng-table-header-bg: var(--tng-semantic-background-surface);
        --tng-table-min-width: 84rem;
        --tng-table-scroll-max-height: min(14rem, 30vh);
      }

      .group-header {
        align-items: baseline;
        display: inline-flex;
        font-weight: 700;
        gap: 0.35rem;
      }

      .group-header small {
        color: var(--tng-semantic-foreground-secondary);
        font-weight: 500;
      }

      .department-group {
        display: grid;
        gap: 0.2rem;
      }

      .department-group small {
        color: var(--tng-semantic-foreground-secondary);
        font-size: 0.75rem;
      }

      .grouped-demo ::ng-deep th[data-header-group] {
        background: color-mix(
          in srgb,
          var(--tng-semantic-background-surface) 70%,
          var(--tng-semantic-background-base) 30%
        );
        border-bottom: 1px solid var(--tng-semantic-border-subtle);
      }

      .group-by-demo ::ng-deep td[data-group-leader] {
        background: color-mix(
          in srgb,
          var(--tng-semantic-background-surface) 82%,
          var(--tng-semantic-background-base) 18%
        );
      }

      .class-hook-demo {
        --account-risk-row-bg: color-mix(
          in srgb,
          var(--tng-semantic-accent-danger) 12%,
          var(--tng-semantic-background-surface)
        );
        --account-low-seat-color: var(--tng-semantic-accent-danger);
      }
    `,
  ],
})
export class TableExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sortablePlainCodeTabs = createCodeTabs(
    'account-table-plain-css',
    accountTableTs,
    accountTablePlainHtml,
    accountTablePlainCss,
  );
  protected readonly sortableTailwindCodeTabs = createCodeTabs(
    'account-table-tailwind',
    accountTableTs,
    accountTableTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly healthPlainCodeTabs = createCodeTabs(
    'account-health-table-plain-css',
    healthTableTs,
    healthPlainHtml,
    healthPlainCss,
  );
  protected readonly healthTailwindCodeTabs = createCodeTabs(
    'account-health-table-tailwind',
    healthTableTs,
    healthTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly scrollPlainCodeTabs = createCodeTabs(
    'statement-preview-table-plain-css',
    scrollTableTs,
    scrollPlainHtml,
    scrollPlainCss,
  );
  protected readonly scrollTailwindCodeTabs = createCodeTabs(
    'statement-preview-table-tailwind',
    scrollTableTs,
    scrollTailwindHtml,
    '/* Tailwind arbitrary properties set the table CSS variables in the template. */',
  );
  protected readonly groupedPlainCodeTabs = createCodeTabs(
    'person-table-plain-css',
    groupedTableTs,
    groupedPlainHtml,
    groupedPlainCss,
  );
  protected readonly groupedTailwindCodeTabs = createCodeTabs(
    'person-table-tailwind',
    groupedTableTs,
    groupedTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly groupByPlainCodeTabs = createCodeTabs(
    'department-table-plain-css',
    groupByTableTs,
    groupByPlainHtml,
    groupByPlainCss,
  );
  protected readonly groupByTailwindCodeTabs = createCodeTabs(
    'department-table-tailwind',
    groupByTableTs,
    groupByTailwindHtml,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly classHookPlainCodeTabs = createCodeTabs(
    'account-class-table-plain-css',
    classHookTableTs,
    classHookPlainHtml,
    classHookPlainCss,
  );
  protected readonly classHookTailwindCodeTabs = createCodeTabs(
    'account-class-table-tailwind',
    classHookTailwindTs,
    classHookTailwindHtml,
    '/* Styles are returned by rowStyle / cellStyle. */',
  );

  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [
    { id: 'owner', label: 'Owner', sortable: true },
    { id: 'plan', label: 'Plan', sortable: true },
    { id: 'seats', label: 'Seats', align: 'end', sortable: true },
    { id: 'health', label: 'Health' },
  ];

  protected readonly classHookRowStyle = (row: AccountRow): TngTableStyleInput =>
    row.health === 'At risk' ? { '--tng-table-row-bg': 'var(--account-risk-row-bg)' } : null;

  protected readonly classHookColumns: readonly TngTableColumn<AccountRow>[] = [
    { id: 'owner', label: 'Owner' },
    { id: 'plan', label: 'Plan' },
    {
      id: 'seats',
      label: 'Seats',
      align: 'end',
      cellStyle: (_row, value) =>
        Number(value) < 20 ? { color: 'var(--account-low-seat-color)', fontWeight: 650 } : null,
    },
    { id: 'health', label: 'Health' },
  ];

  protected readonly rows: readonly AccountRow[] = [
    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },
    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },
    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },
  ];

  protected readonly statementColumns: readonly TngTableColumn<StatementRow>[] = [
    { id: 'date', label: 'Date', width: '8rem' },
    { id: 'description', label: 'Description', width: '16rem' },
    { id: 'category', label: 'Category', width: '10rem' },
    { id: 'method', label: 'Method', width: '9rem' },
    { id: 'reference', label: 'Reference', width: '10rem' },
    { id: 'status', label: 'Status', width: '9rem' },
    { id: 'amount', label: 'Amount', align: 'end', width: '8rem' },
    { id: 'balance', label: 'Balance', align: 'end', width: '8rem' },
  ];

  protected readonly statementRows: readonly StatementRow[] = [
    {
      date: 'Jan 02',
      description: 'Opening balance',
      category: 'Ledger',
      method: 'System',
      reference: 'BAL-1000',
      status: 'Posted',
      amount: '$0.00',
      balance: '$14,820.00',
    },
    {
      date: 'Jan 04',
      description: 'Wire from Acme Supply',
      category: 'Receivable',
      method: 'Wire',
      reference: 'WIRE-1832',
      status: 'Posted',
      amount: '$3,240.00',
      balance: '$18,060.00',
    },
    {
      date: 'Jan 08',
      description: 'Payroll batch',
      category: 'Payroll',
      method: 'ACH',
      reference: 'PAY-0148',
      status: 'Posted',
      amount: '-$6,850.00',
      balance: '$11,210.00',
    },
    {
      date: 'Jan 10',
      description: 'Software subscription',
      category: 'Tools',
      method: 'Card',
      reference: 'CARD-4431',
      status: 'Posted',
      amount: '-$489.00',
      balance: '$10,721.00',
    },
    {
      date: 'Jan 15',
      description: 'Client retainer',
      category: 'Revenue',
      method: 'ACH',
      reference: 'ACH-2204',
      status: 'Pending',
      amount: '$4,500.00',
      balance: '$15,221.00',
    },
    {
      date: 'Jan 17',
      description: 'Travel reimbursement',
      category: 'Expense',
      method: 'ACH',
      reference: 'EXP-0911',
      status: 'Posted',
      amount: '-$780.00',
      balance: '$14,441.00',
    },
    {
      date: 'Jan 22',
      description: 'Tax estimate',
      category: 'Tax',
      method: 'ACH',
      reference: 'TAX-2026',
      status: 'Scheduled',
      amount: '-$2,100.00',
      balance: '$12,341.00',
    },
  ];

  protected readonly personColumns: readonly TngTableColumn<PersonRow>[] = [
    {
      id: 'person',
      label: 'Person',
      children: [
        { id: 'firstName', label: 'First Name', sortable: true },
        { id: 'lastName', label: 'Last Name', sortable: true },
      ],
    },
    {
      id: 'contact',
      label: 'Contact',
      children: [
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' },
      ],
    },
    {
      id: 'dates',
      label: 'Important Dates',
      children: [
        { id: 'dob', label: 'Date of Birth' },
        { id: 'anniversary', label: 'Anniversary' },
      ],
    },
    { id: 'notes', label: 'Notes' },
  ];

  protected readonly personRows: readonly PersonRow[] = [
    {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+44 20 7946 0958',
      dob: '1815-12-10',
      anniversary: '1835-07-08',
      notes: 'Mathematician',
    },
    {
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
      phone: '+44 161 306 6000',
      dob: '1912-06-23',
      anniversary: '—',
      notes: 'Computer scientist',
    },
    {
      firstName: 'Grace',
      lastName: 'Hopper',
      email: 'grace@example.com',
      phone: '+1 202 555 0117',
      dob: '1906-12-09',
      anniversary: '1930-06-15',
      notes: 'Rear Admiral',
    },
  ];

  protected readonly departmentColumns: readonly TngTableColumn<DepartmentRow>[] = [
    { id: 'department', label: 'Department', groupBy: true },
    { id: 'employee', label: 'Employee' },
    { id: 'level', label: 'Level' },
    { id: 'salary', label: 'Salary', align: 'end' },
  ];

  protected readonly departmentRows: readonly DepartmentRow[] = [
    { department: 'Engineering', employee: 'Alice Nguyen', level: 'Staff', salary: '$148k' },
    { department: 'Engineering', employee: 'Ben Carter', level: 'Senior', salary: '$132k' },
    { department: 'Engineering', employee: 'Carla Diaz', level: 'Principal', salary: '$171k' },
    { department: 'Sales', employee: 'Dev Malik', level: 'Manager', salary: '$118k' },
    { department: 'Sales', employee: 'Eve Brooks', level: 'Associate', salary: '$86k' },
    { department: 'People', employee: 'Frank Stone', level: 'Lead', salary: '$104k' },
  ];

  protected sortActive: string | null = 'owner';
  protected sortDirection: 'asc' | 'desc' | null = 'asc';

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onSortChange(change: TngTableSortChange): void {
    this.sortActive = change.activeColumnId;
    this.sortDirection = change.direction;
  }
}
