import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TngTableSortChange } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

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

function createFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [TableHostComponent],
  }).createComponent(TableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function query<TElement extends Element>(
  fixture: ReturnType<typeof createFixture>,
  selector: string,
): TElement {
  const host = fixture.nativeElement as HTMLElement;
  const element = host.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected element for selector "${selector}".`);
  }

  return element as TElement;
}

function queryAll<TElement extends Element>(
  fixture: ReturnType<typeof createFixture>,
  selector: string,
): readonly TElement[] {
  const host = fixture.nativeElement as HTMLElement;
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
