import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TableHarnessComponent, getByTestId } from './tng-table.test-harness';

describe('tng-table DOM contract', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('applies the table and slot data-slot markers to semantic table elements', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    const header = getByTestId<HTMLTableSectionElement>(fixture, 'header');
    const body = getByTestId<HTMLTableSectionElement>(fixture, 'body');
    const footer = getByTestId<HTMLTableSectionElement>(fixture, 'footer');

    expect(table.getAttribute('data-slot')).toBe('table');
    expect(header.getAttribute('data-slot')).toBe('table-header');
    expect(body.getAttribute('data-slot')).toBe('table-body');
    expect(footer.getAttribute('data-slot')).toBe('table-footer');
  });

  it('reflects header presence on the host table', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-has-header')).toBe('');

    fixture.componentInstance.showHeader.set(false);
    fixture.detectChanges();

    expect(table.getAttribute('data-has-header')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="header"]')).toBeNull();
  });

  it('reflects footer presence on the host table', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const table = getByTestId<HTMLTableElement>(fixture, 'table');
    expect(table.getAttribute('data-has-footer')).toBe('');

    fixture.componentInstance.showFooter.set(false);
    fixture.detectChanges();

    expect(table.getAttribute('data-has-footer')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="footer"]')).toBeNull();
  });

  it('keeps toolbar, table, and pagination in the documented DOM order', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TableHarnessComponent],
    }).createComponent(TableHarnessComponent);
    fixture.detectChanges();

    const children = Array.from(fixture.nativeElement.children as HTMLCollectionOf<HTMLElement>).map((child) =>
      child.getAttribute('data-testid'),
    );

    expect(children).toEqual(['toolbar', 'table', 'pagination']);
  });
});
