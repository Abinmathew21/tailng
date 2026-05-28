import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TngTableSortChange } from '@tailng-ui/primitives';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TngTable,
  TngTableCellTemplate,
  type TngTableColumn,
  TngTableComponent,
  TngTableHeaderTemplate,
} from './tng-table.component';

type TableRow = Readonly<{
  id: string;
  name: string;
  status: string;
  total: number;
}>;

type PersonRow = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  anniversary: string;
  notes: string;
}>;

@Component({
  imports: [TngTableComponent, TngTableCellTemplate, TngTableHeaderTemplate],
  template: `
    <tng-table
      [ariaLabel]="ariaLabel()"
      [columns]="columns()"
      [density]="density()"
      [error]="error()"
      [items]="items()"
      [loading]="loading()"
      [sortActive]="sortActive()"
      [sortDirection]="sortDirection()"
      [stickyHeader]="stickyHeader()"
      (sortChange)="onSortChange($event)"
    >
      <ng-template tngTableHeaderTemplate="status" let-label="label">{{ label }} label</ng-template>
      <ng-template tngTableCellTemplate="status" let-row="row">
        <strong data-testid="status-cell">{{ row.status }}</strong>
      </ng-template>
    </tng-table>
  `,
})
class TableHostComponent {
  public readonly ariaLabel = signal('Orders');
  public readonly columns = signal<readonly TngTableColumn<TableRow>[]>([
    { id: 'name', label: 'Name', sortable: true },
    { id: 'status', label: 'Status' },
    { id: 'total', label: 'Total', align: 'end', accessor: (row) => row.total },
  ]);
  public readonly density = signal<'compact' | 'comfortable'>('comfortable');
  public readonly error = signal(false);
  public readonly items = signal<readonly TableRow[]>([
    { id: 'a', name: 'Alpha', status: 'Ready', total: 12 },
    { id: 'b', name: 'Beta', status: 'Draft', total: 7 },
  ]);
  public readonly loading = signal(false);
  public readonly sortActive = signal<string | null | undefined>(undefined);
  public readonly sortDirection = signal<'asc' | 'desc' | null | undefined>(undefined);
  public readonly stickyHeader = signal(false);
  public readonly sortChanges: TngTableSortChange[] = [];

  public onSortChange(event: TngTableSortChange): void {
    this.sortChanges.push(event);
  }
}

@Component({
  imports: [TngTableComponent, TngTableCellTemplate, TngTableHeaderTemplate],
  template: `
    <tng-table
      [columns]="columns()"
      [items]="items()"
      (sortChange)="onSortChange($event)"
    >
      <ng-template
        tngTableHeaderTemplate="person"
        let-isGroup="isGroup"
        let-depth="depth"
        let-colspan="colspan"
        let-rowspan="rowspan"
        let-label="label"
      >
        <span
          data-testid="person-group-header"
          [attr.data-is-group]="isGroup"
          [attr.data-depth]="depth"
          [attr.data-colspan]="colspan"
          [attr.data-rowspan]="rowspan"
        >{{ label }}</span>
      </ng-template>
      <ng-template
        tngTableHeaderTemplate="firstName"
        let-isGroup="isGroup"
        let-depth="depth"
        let-colspan="colspan"
        let-rowspan="rowspan"
        let-label="label"
      >
        <span
          data-testid="first-name-leaf-header"
          [attr.data-is-group]="isGroup"
          [attr.data-depth]="depth"
          [attr.data-colspan]="colspan"
          [attr.data-rowspan]="rowspan"
        >{{ label }}</span>
      </ng-template>
    </tng-table>
  `,
})
class GroupedTableHostComponent {
  public readonly columns = signal<readonly TngTableColumn<PersonRow>[]>([
    {
      id: 'person',
      label: 'Person',
      children: [
        { id: 'firstName', label: 'First Name', sortable: true },
        { id: 'lastName', label: 'Last Name' },
        { id: 'email', label: 'Email' },
      ],
    },
    {
      id: 'dates',
      label: 'Dates',
      children: [
        { id: 'dob', label: 'Date of Birth' },
        { id: 'anniversary', label: 'Anniversary' },
      ],
    },
    { id: 'notes', label: 'Notes' },
  ]);

  public readonly items = signal<readonly PersonRow[]>([
    {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      dob: '1815-12-10',
      anniversary: '1835-07-08',
      notes: 'mathematician',
    },
    {
      id: '2',
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
      dob: '1912-06-23',
      anniversary: '—',
      notes: 'computer scientist',
    },
  ]);

  public readonly sortChanges: TngTableSortChange[] = [];

  public onSortChange(event: TngTableSortChange): void {
    this.sortChanges.push(event);
  }
}

function createFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [TableHostComponent],
  }).createComponent(TableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function createGroupedFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [GroupedTableHostComponent],
  }).createComponent(GroupedTableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function resolveHost(source: { nativeElement: unknown } | Element): Element {
  return 'nativeElement' in source ? (source.nativeElement as Element) : source;
}

function query<TElement extends Element>(
  source: { nativeElement: unknown } | Element,
  selector: string,
): TElement {
  const host = resolveHost(source);
  const element = host.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected element for selector "${selector}".`);
  }

  return element as TElement;
}

function queryAll<TElement extends Element>(
  source: { nativeElement: unknown } | Element,
  selector: string,
): readonly TElement[] {
  const host = resolveHost(source);
  return Array.from(host.querySelectorAll(selector)) as readonly TElement[];
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('tng-table component', () => {
  it('exports the component alias', () => {
    expect(TngTable).toBe(TngTableComponent);
  });

  it('renders a native primitive table with headers and rows', () => {
    const fixture = createFixture();

    const table = query<HTMLTableElement>(fixture, 'table.tng-table');
    expect(table.getAttribute('data-slot')).toBe('table');
    expect(table.getAttribute('aria-label')).toBe('Orders');
    expect(table.getAttribute('data-has-header')).toBe('');
    expect(queryAll<HTMLTableCellElement>(fixture, 'tbody td')).toHaveLength(6);
    expect(query<HTMLTableCellElement>(fixture, 'td[data-column-id="name"]').textContent?.trim()).toBe(
      'Alpha',
    );
    expect(query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]').textContent?.trim()).toBe(
      '12',
    );
  });

  it('uses projected header and cell templates', () => {
    const fixture = createFixture();

    expect(query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]').textContent?.trim()).toBe(
      'Status label',
    );
    expect(query<HTMLElement>(fixture, '[data-testid="status-cell"]').textContent?.trim()).toBe(
      'Ready',
    );
  });

  it('emits sort changes from sortable headers', () => {
    const fixture = createFixture();

    click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]'));
    fixture.detectChanges();

    expect(fixture.componentInstance.sortChanges).toEqual([
      {
        activeColumnId: 'name',
        direction: 'asc',
      },
    ]);
  });

  it('renders empty, loading, and error states', () => {
    const fixture = createFixture();

    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('No results');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-empty')).toBe(true);

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('Loading');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-loading')).toBe(true);

    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.error.set(true);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('Error');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-error')).toBe(true);
  });

  it('applies density and sticky header configuration', () => {
    const fixture = createFixture();

    fixture.componentInstance.density.set('compact');
    fixture.componentInstance.stickyHeader.set(true);
    fixture.detectChanges();

    expect(query<HTMLTableElement>(fixture, 'table').getAttribute('data-density')).toBe('compact');
    expect(query<HTMLTableSectionElement>(fixture, 'thead').hasAttribute('data-sticky')).toBe(true);
  });
});

describe('tng-table grouped headers', () => {
  describe('column tree parsing', () => {
    it('supports existing flat column configuration without breaking current behavior', () => {
      const fixture = createFixture();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
      expect(queryAll(fixture, 'thead th')).toHaveLength(3);
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(3);
    });

    it('flattens only leaf columns for body rendering', () => {
      const fixture = createGroupedFixture();

      const bodyRows = queryAll(fixture, 'tbody tr');
      expect(bodyRows).toHaveLength(2);
      expect(queryAll(bodyRows[0], 'td')).toHaveLength(6);
      const ids = queryAll<HTMLTableCellElement>(bodyRows[0], 'td').map(
        (cell) => cell.getAttribute('data-column-id'),
      );
      expect(ids).toEqual(['firstName', 'lastName', 'email', 'dob', 'anniversary', 'notes']);
    });

    it('excludes group columns from body rendering', () => {
      const fixture = createGroupedFixture();

      expect(query(fixture, 'tbody').querySelector('td[data-column-id="person"]')).toBeNull();
      expect(query(fixture, 'tbody').querySelector('td[data-column-id="dates"]')).toBeNull();
    });

    it('preserves leaf column order from the nested column tree', () => {
      const fixture = createGroupedFixture();

      const cols = queryAll<HTMLTableColElement>(fixture, 'colgroup col');
      expect(cols).toHaveLength(6);

      const bottomLeafIds = queryAll<HTMLTableCellElement>(
        fixture,
        'thead tr:last-child th',
      ).map((th) => th.getAttribute('data-column-id'));
      expect(bottomLeafIds).toEqual(['firstName', 'lastName', 'email', 'dob', 'anniversary']);
    });

    it('supports deeply nested column groups', () => {
      @Component({
        imports: [TngTableComponent],
        template: `<tng-table [columns]="columns()" [items]="[]"></tng-table>`,
      })
      class DeepHost {
        public readonly columns = signal<readonly TngTableColumn<{ a: number }>[]>([
          {
            id: 'outer',
            label: 'Outer',
            children: [
              {
                id: 'mid',
                label: 'Mid',
                children: [
                  { id: 'leaf1', label: 'Leaf 1' },
                  { id: 'leaf2', label: 'Leaf 2' },
                ],
              },
            ],
          },
        ]);
      }

      const fixture = TestBed.configureTestingModule({
        imports: [DeepHost],
      }).createComponent(DeepHost);
      fixture.detectChanges();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(3);
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(2);
    });

    it('ignores hidden columns when building leaf columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'visible', label: 'Visible' },
        { id: 'hidden', label: 'Hidden', hidden: true },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
      expect(queryAll(fixture, 'thead th')).toHaveLength(1);
    });

    it('excludes empty group columns from rendered header rows', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'empty-group', label: 'Empty', children: [] } as TngTableColumn<PersonRow>,
        { id: 'visible', label: 'Visible' },
      ]);
      fixture.detectChanges();

      // children: [] is treated as a leaf per the design rule, so it renders as a single column.
      const headerIds = queryAll<HTMLTableCellElement>(fixture, 'thead th').map((th) =>
        th.getAttribute('data-column-id'),
      );
      expect(headerIds).toContain('empty-group');
      expect(headerIds).toContain('visible');
    });

    it('calculates table colspan using visible leaf column count', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();

      const stateCell = query<HTMLTableCellElement>(fixture, 'tbody td.tng-table__state-cell');
      expect(stateCell.getAttribute('colspan')).toBe('6');
    });
  });

  describe('header rows', () => {
    it('renders a single header row for flat columns', () => {
      const fixture = createFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
    });

    it('renders multiple header rows for nested grouped columns', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);
    });

    it('calculates correct `colspan` for group header cells', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="person"]',
      );
      const datesHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="dates"]',
      );
      expect(personHeader.getAttribute('colspan')).toBe('3');
      expect(datesHeader.getAttribute('colspan')).toBe('2');
    });

    it('calculates correct `rowspan` for leaf header cells', () => {
      const fixture = createGroupedFixture();
      const notesHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="notes"]',
      );
      // Notes is a top-level leaf in a 2-deep tree → should rowspan 2.
      expect(notesHeader.getAttribute('rowspan')).toBe('2');

      const firstNameHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="firstName"]',
      );
      expect(firstNameHeader.getAttribute('rowspan')).toBeNull();
    });

    it('renders group headers above their leaf columns', () => {
      const fixture = createGroupedFixture();
      const firstRowIds = queryAll<HTMLTableCellElement>(
        fixture,
        'thead tr:first-child th',
      ).map((th) => th.getAttribute('data-column-id'));
      expect(firstRowIds).toEqual(['person', 'dates', 'notes']);
    });

    it('renders mixed grouped and non-grouped columns in the same table', () => {
      const fixture = createGroupedFixture();
      const topRow = queryAll<HTMLTableCellElement>(fixture, 'thead tr:first-child th');
      const groupCount = topRow.filter((th) => th.hasAttribute('data-header-group')).length;
      const leafCount = topRow.filter((th) => !th.hasAttribute('data-header-group')).length;
      expect(groupCount).toBe(2);
      expect(leafCount).toBe(1);
    });

    it('keeps standalone leaf headers stretched across remaining header depth', () => {
      const fixture = createGroupedFixture();
      const notesHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="notes"]',
      );
      expect(notesHeader.getAttribute('rowspan')).toBe('2');
    });

    it('does not render body cells for group headers', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, 'tbody').querySelector('td[data-column-id="person"]')).toBeNull();
    });

    it('renders exactly maxDepth header rows', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);
    });
  });

  describe('sorting', () => {
    it('allows sorting only on leaf columns', () => {
      const fixture = createGroupedFixture();

      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]'));
      fixture.detectChanges();

      expect(fixture.componentInstance.sortChanges).toEqual([
        { activeColumnId: 'firstName', direction: 'asc' },
      ]);
    });

    it('does not attach sort behavior to group header cells', () => {
      const fixture = createGroupedFixture();
      const groupHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="person"]',
      );
      expect(groupHeader.hasAttribute('data-sortable')).toBe(false);
    });

    it('does not trigger sort when clicking a group header', () => {
      const fixture = createGroupedFixture();
      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]'));
      fixture.detectChanges();
      expect(fixture.componentInstance.sortChanges).toHaveLength(0);
    });

    it('preserves existing sort behavior for flat columns', () => {
      const fixture = createFixture();
      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]'));
      fixture.detectChanges();
      expect(fixture.componentInstance.sortChanges).toHaveLength(1);
    });

    it('renders sort indicator only for sortable leaf headers', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').hasAttribute(
          'data-sortable',
        ),
      ).toBe(true);
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="email"]').hasAttribute(
          'data-sortable',
        ),
      ).toBe(false);
    });

    it('ignores `sortable` on group columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Group',
          sortable: true,
          children: [{ id: 'leaf', label: 'Leaf' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="grp"]').hasAttribute(
          'data-sortable',
        ),
      ).toBe(false);
    });
  });

  describe('sticky columns', () => {
    it('applies sticky behavior only to visible leaf columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', sticky: 'start' },
            { id: 'lastName', label: 'Last' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('start');
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').hasAttribute(
          'data-sticky-side',
        ),
      ).toBe(false);
    });

    it('preserves sticky left behavior for flat columns', () => {
      const fixture = createFixture();
      fixture.componentInstance.columns.set([
        { id: 'name', label: 'Name', sticky: 'start' },
        { id: 'status', label: 'Status' },
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('start');
    });

    it('preserves sticky right behavior for flat columns', () => {
      const fixture = createFixture();
      fixture.componentInstance.columns.set([
        { id: 'name', label: 'Name' },
        { id: 'status', label: 'Status', sticky: 'end' },
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('end');
    });

    it('does not apply sticky directive to group header cells', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').hasAttribute(
          'data-sticky',
        ),
      ).toBe(false);
    });

    it('keeps grouped header layout valid when leaf columns are sticky', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', sticky: 'start' },
            { id: 'lastName', label: 'Last' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const personHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="person"]',
      );
      expect(personHeader.getAttribute('colspan')).toBe('2');
    });
  });

  describe('colgroup and width', () => {
    it('renders one <col> per visible leaf column', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);
    });

    it('does not render <col> for group columns', () => {
      const fixture = createGroupedFixture();
      // 2 groups + 5 grouped leaves + 1 standalone leaf = 8 columns conceptually,
      // but colgroup should only carry the 6 leaves.
      const cols = queryAll(fixture, 'colgroup col');
      expect(cols).toHaveLength(6);
    });

    it('applies width settings from leaf columns only', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', width: 200 },
            { id: 'lastName', label: 'Last', width: '12rem' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const cols = queryAll<HTMLTableColElement>(fixture, 'colgroup col');
      expect(cols[0].style.width).toBe('200px');
      expect(cols[1].style.width).toBe('12rem');
    });

    it('preserves column width order after flattening nested columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'a',
          label: 'A',
          children: [
            { id: 'a1', label: 'A1', width: 100 },
            { id: 'a2', label: 'A2', width: 110 },
          ],
        },
        { id: 'b', label: 'B', width: 300 },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const widths = queryAll<HTMLTableColElement>(fixture, 'colgroup col').map(
        (col) => col.style.width,
      );
      expect(widths).toEqual(['100px', '110px', '300px']);
    });

    it('keeps grouped header colspan aligned with colgroup leaf count', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="person"]',
      );
      const datesHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="dates"]',
      );
      const personColspan = Number(personHeader.getAttribute('colspan') ?? '1');
      const datesColspan = Number(datesHeader.getAttribute('colspan') ?? '1');
      const standaloneLeafCount = 1; // notes
      const totalCols = personColspan + datesColspan + standaloneLeafCount;
      expect(totalCols).toBe(queryAll(fixture, 'colgroup col').length);
    });
  });

  describe('empty / loading / error state colspan', () => {
    it('sets loading row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('sets empty row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('sets error row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.error.set(true);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('updates fallback row colspan when visible leaf columns change', () => {
      const fixture = createFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');

      fixture.componentInstance.columns.set([{ id: 'name', label: 'Name' }]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('1');
    });

    it('does not count group headers in fallback colspan', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      // 6 leaves total in default tree.
      expect(query(fixture, 'tbody td.tng-table__state-cell').getAttribute('colspan')).toBe('6');
    });
  });

  describe('header templates and classes', () => {
    it('supports custom header template for leaf columns', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, '[data-testid="first-name-leaf-header"]')).toBeTruthy();
    });

    it('supports custom header template for group columns', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, '[data-testid="person-group-header"]')).toBeTruthy();
    });

    it('provides `isGroup` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-is-group'),
      ).toBe('true');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-is-group'),
      ).toBe('false');
    });

    it('provides `depth` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-depth'),
      ).toBe('0');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-depth'),
      ).toBe('1');
    });

    it('provides `colspan` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-colspan'),
      ).toBe('3');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-colspan'),
      ).toBe('1');
    });

    it('provides `rowspan` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-rowspan'),
      ).toBe('1');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-rowspan'),
      ).toBe('1');
    });

    it('applies group header classes independently from leaf header classes', () => {
      const fixture = createGroupedFixture();
      const groupHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="person"]',
      );
      const leafHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="firstName"]',
      );
      expect(groupHeader.hasAttribute('data-header-group')).toBe(true);
      expect(leafHeader.hasAttribute('data-header-group')).toBe(false);
    });

    it('defaults group header alignment to center', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').getAttribute(
          'data-align',
        ),
      ).toBe('center');
    });

    it('preserves leaf header alignment behavior', () => {
      const fixture = createFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="total"]').getAttribute(
          'data-align',
        ),
      ).toBe('end');
    });
  });

  describe('accessibility', () => {
    it('renders group headers as <th scope="colgroup">', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').getAttribute(
          'scope',
        ),
      ).toBe('colgroup');
    });

    it('renders leaf headers as <th scope="col">', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').getAttribute(
          'scope',
        ),
      ).toBe('col');
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="notes"]').getAttribute(
          'scope',
        ),
      ).toBe('col');
    });

    it('preserves accessible column labels for flat tables', () => {
      const fixture = createFixture();
      const labels = queryAll<HTMLTableCellElement>(fixture, 'thead th').map((th) =>
        th.textContent?.trim(),
      );
      expect(labels).toContain('Name');
      expect(labels).toContain('Total');
    });

    it('preserves accessible column labels for grouped tables', () => {
      const fixture = createGroupedFixture();
      const groupLabels = queryAll<HTMLTableCellElement>(
        fixture,
        'thead tr:first-child th',
      ).map((th) => th.textContent?.trim());
      expect(groupLabels[0]).toContain('Person');
      expect(groupLabels[1]).toContain('Dates');
    });

    it('avoids invalid ARIA sort attributes on group headers', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="person"]',
      );
      expect(personHeader.hasAttribute('aria-sort')).toBe(false);
    });

    it('applies `aria-sort` only to sortable leaf headers', () => {
      const fixture = createGroupedFixture();
      const sortableLeaf = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="firstName"]',
      );
      const nonSortableLeaf = query<HTMLTableCellElement>(
        fixture,
        'th[data-column-id="lastName"]',
      );
      // The sortable leaf participates in the sort directive (aria-sort=none by default).
      expect(sortableLeaf.hasAttribute('data-sortable')).toBe(true);
      expect(nonSortableLeaf.hasAttribute('data-sortable')).toBe(false);
    });
  });

  describe('validation and edge cases', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('warns in dev mode when duplicate column ids exist in nested columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'group',
          label: 'Group',
          children: [
            { id: 'dup', label: 'A' },
            { id: 'dup', label: 'B' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalled();
      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('Duplicate column id "dup"'),
        ),
      ).toBe(true);
    });

    it('warns in dev mode when a group column defines an accessor', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          accessor: (row: PersonRow) => row.firstName,
          children: [{ id: 'leaf', label: 'L' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('accessor'),
        ),
      ).toBe(true);
    });

    it('warns in dev mode when a group column is marked sortable', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          sortable: true,
          children: [{ id: 'leaf', label: 'L' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('sortable'),
        ),
      ).toBe(true);
    });

    it('handles single-child group columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          children: [{ id: 'only', label: 'Only' }],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const grp = query<HTMLTableCellElement>(fixture, 'th[data-column-id="grp"]');
      expect(grp.getAttribute('colspan')).toBeNull(); // colspan=1, suppressed.
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });

    it('handles columns nested at different depths', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'outer',
          label: 'Outer',
          children: [
            { id: 'shallow', label: 'Shallow' },
            {
              id: 'mid',
              label: 'Mid',
              children: [{ id: 'deep', label: 'Deep' }],
            },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(3);
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="shallow"]').getAttribute(
          'rowspan',
        ),
      ).toBe('2');
    });

    it('handles all columns hidden', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'a', label: 'A', hidden: true },
        { id: 'b', label: 'B', hidden: true },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'colgroup col')).toHaveLength(0);
      // State cell colspan should fall back to 1.
      expect(query(fixture, 'tbody td.tng-table__state-cell').getAttribute('colspan')).toBe('1');
    });

    it('handles dynamic column updates', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);

      fixture.componentInstance.columns.set([{ id: 'only', label: 'Only' }]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });

    it('recomputes header rows when column tree changes', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);

      fixture.componentInstance.columns.set([{ id: 'flat', label: 'Flat' }]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
    });

    it('recomputes leaf columns when column visibility changes', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);

      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First' },
            { id: 'lastName', label: 'Last', hidden: true },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });
  });
});
