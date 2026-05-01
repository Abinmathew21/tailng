import { describe, expect, it } from 'vitest';

import {
  changeSelectValue,
  click,
  createPaginationFixture,
  getByTestId,
} from './tng-pagination.test-harness';

describe('tngPagination event payloads', () => {
  it('emits complete pageChange payloads for page index changes', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)).toEqual({
      mode: 'client',
      pageCount: 3,
      pageIndex: 1,
      pageSize: 10,
      previousPageIndex: 0,
      previousPageSize: 10,
      totalItems: 25,
      trigger: 'next',
    });
  });

  it('emits complete pageChange payloads for page size changes', () => {
    const fixture = createPaginationFixture();

    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)).toEqual({
      mode: 'client',
      pageCount: 2,
      pageIndex: 0,
      pageSize: 20,
      previousPageIndex: 0,
      previousPageSize: 10,
      totalItems: 25,
      trigger: 'size',
    });
  });

  it('emits documented triggers for navigation controls', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'first'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'page-2'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.map((event) => event.trigger)).toEqual([
      'next',
      'previous',
      'last',
      'first',
      'page',
    ]);
  });

  it('emits pageIndexChange and pageSizeChange before pageChange', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.events).toEqual([
      'pageIndexChange:1',
      'pageChange:next:1:10',
      'pageIndexChange:0',
      'pageSizeChange:20',
      'pageChange:size:0:20',
    ]);
  });

  it('does not emit partial events when navigation is ignored', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    changeSelectValue(getByTestId<HTMLSelectElement>(fixture, 'size'), '10');
    fixture.detectChanges();

    expect(fixture.componentInstance.events).toEqual([]);
  });
});
