import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngTableCellTemplate,
  TngTableComponent,
  TngTableHeaderTemplate,
  type TngTableColumn,
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
              <ng-template
                tngTableHeaderTemplate="dates"
                let-label="label"
                let-colspan="colspan"
              >
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
              <ng-template
                tngTableHeaderTemplate="dates"
                let-label="label"
                let-colspan="colspan"
              >
                <span class="inline-flex items-baseline gap-1 font-bold">
                  {{ label }}
                  <span class="text-xs font-medium text-tng-fg-secondary">({{ colspan }} cols)</span>
                </span>
              </ng-template>
            </tng-table>
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
        padding: 1rem;
      }

      .health-pill {
        border: 1px solid var(--tng-semantic-border-subtle);
        border-radius: 999px;
        display: inline-flex;
        font-size: 0.75rem;
        padding: 0.25rem 0.55rem;
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

      .grouped-demo ::ng-deep th[data-header-group] {
        background: color-mix(
          in srgb,
          var(--tng-semantic-background-surface) 70%,
          var(--tng-semantic-background-base) 30%
        );
        border-bottom: 1px solid var(--tng-semantic-border-subtle);
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

  protected readonly columns: readonly TngTableColumn<AccountRow>[] = [
    { id: 'owner', label: 'Owner', sortable: true },
    { id: 'plan', label: 'Plan', sortable: true },
    { id: 'seats', label: 'Seats', align: 'end', sortable: true },
    { id: 'health', label: 'Health' },
  ];

  protected readonly rows: readonly AccountRow[] = [
    { owner: 'Ava Mathews', plan: 'Enterprise', seats: 82, health: 'Healthy' },
    { owner: 'Mina Lee', plan: 'Growth', seats: 28, health: 'Needs review' },
    { owner: 'Omar Aziz', plan: 'Starter', seats: 9, health: 'At risk' },
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
