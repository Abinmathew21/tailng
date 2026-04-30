import { describe, expect, it } from 'vitest';

import { click, createPaginationFixture, getByTestId } from './tng-pagination.test-harness';

describe('tngPagination client mode navigation', () => {
  it('clamps navigation within the known client page range', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
    expect(fixture.componentInstance.pageChanges).toHaveLength(1);
  });

  it('updates controls after totalItems changes', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    fixture.componentInstance.totalItems.set(100);
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'next').disabled).toBe(false);
    expect(getByTestId<HTMLButtonElement>(fixture, 'last').disabled).toBe(false);
  });

  it('moves to the last valid page when current page becomes out of range', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'last'));
    fixture.detectChanges();
    fixture.componentInstance.totalItems.set(15);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '1',
    );
  });

  it('emits events with client mode', () => {
    const fixture = createPaginationFixture();

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)?.mode).toBe('client');
  });

  it('handles single-page client pagination with movement controls disabled', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.totalItems.set(5);
    fixture.detectChanges();

    expect(getByTestId<HTMLButtonElement>(fixture, 'first').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'previous').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'next').disabled).toBe(true);
    expect(getByTestId<HTMLButtonElement>(fixture, 'last').disabled).toBe(true);
  });
});

describe('tngPagination server mode navigation', () => {
  it('allows next navigation beyond the known client page count', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.mode.set('server');
    fixture.componentInstance.totalItems.set(10);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-index')).toBe(
      '2',
    );
  });

  it('emits events with server mode and does not clamp to totalItems', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.mode.set('server');
    fixture.componentInstance.totalItems.set(10);
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      mode: 'server',
      pageIndex: 2,
      trigger: 'next',
    });
  });

  it('preserves previous behavior and prevents navigation below page 0', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.mode.set('server');
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();
    expect(fixture.componentInstance.pageChanges).toEqual([]);

    click(getByTestId<HTMLButtonElement>(fixture, 'next'));
    fixture.detectChanges();
    click(getByTestId<HTMLButtonElement>(fixture, 'previous'));
    fixture.detectChanges();
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 0,
      trigger: 'previous',
    });
  });

  it('updates page count display when server total changes', () => {
    const fixture = createPaginationFixture();

    fixture.componentInstance.mode.set('server');
    fixture.componentInstance.totalItems.set(100);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'pagination').getAttribute('data-page-count')).toBe(
      '10',
    );
  });
});
