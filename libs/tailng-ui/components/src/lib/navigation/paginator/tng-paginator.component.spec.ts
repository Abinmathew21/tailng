import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TngPaginationChangeEvent } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngPaginator, TngPaginatorComponent } from './tng-paginator.component';

@Component({
  imports: [TngPaginatorComponent],
  template: `
    <tng-paginator
      data-testid="paginator"
      [ariaLabel]="ariaLabel()"
      [defaultPageIndex]="defaultPageIndex()"
      [defaultPageSize]="defaultPageSize()"
      [disabled]="disabled()"
      [maxPageButtons]="maxPageButtons()"
      [mode]="mode()"
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [showFirstLast]="showFirstLast()"
      [showPageSize]="showPageSize()"
      [showRange]="showRange()"
      [totalItems]="totalItems()"
      (pageChange)="onPageChange($event)"
      (pageIndexChange)="onPageIndexChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    />
  `,
})
class PaginatorHostComponent {
  public readonly ariaLabel = signal<string | null>('Results pages');
  public readonly defaultPageIndex = signal(0);
  public readonly defaultPageSize = signal(10);
  public readonly disabled = signal(false);
  public readonly maxPageButtons = signal(5);
  public readonly mode = signal<'client' | 'server'>('client');
  public readonly pageIndex = signal<number | undefined>(undefined);
  public readonly pageSize = signal<number | undefined>(undefined);
  public readonly pageSizeOptions = signal<readonly number[] | null>([5, 10, 20]);
  public readonly showFirstLast = signal(true);
  public readonly showPageSize = signal(true);
  public readonly showRange = signal(true);
  public readonly totalItems = signal(25);

  public readonly pageChanges: TngPaginationChangeEvent[] = [];
  public readonly pageIndexChanges: number[] = [];
  public readonly pageSizeChanges: number[] = [];

  public onPageChange(event: TngPaginationChangeEvent): void {
    this.pageChanges.push(event);
  }

  public onPageIndexChange(pageIndex: number): void {
    this.pageIndexChanges.push(pageIndex);
  }

  public onPageSizeChange(pageSize: number): void {
    this.pageSizeChanges.push(pageSize);
  }
}

function createFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [PaginatorHostComponent],
  }).createComponent(PaginatorHostComponent);

  fixture.detectChanges();
  return fixture;
}

function getBySelector<TElement extends Element>(
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

function getAllBySelector<TElement extends Element>(
  fixture: ReturnType<typeof createFixture>,
  selector: string,
): readonly TElement[] {
  const host = fixture.nativeElement as HTMLElement;
  return Array.from(host.querySelectorAll(selector)) as readonly TElement[];
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function changeSelectValue(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('tng-paginator component', () => {
  it('exports the component alias', () => {
    expect(TngPaginator).toBe(TngPaginatorComponent);
  });

  it('renders range, numbered pages, movement controls, and page-size options', () => {
    const fixture = createFixture();

    const nav = getBySelector<HTMLElement>(fixture, 'nav.tng-paginator');
    expect(nav.getAttribute('aria-label')).toBe('Results pages');
    expect(getBySelector<HTMLElement>(fixture, '[data-testid="range"]').textContent?.trim()).toBe(
      '1-10 of 25',
    );
    expect(getAllBySelector<HTMLButtonElement>(fixture, 'button[tngPaginationPage]')).toHaveLength(3);
    expect(getAllBySelector<HTMLOptionElement>(fixture, 'option').map((option) => option.value)).toEqual([
      '5',
      '10',
      '20',
    ]);
  });

  it('navigates with next and emits primitive-compatible events', () => {
    const fixture = createFixture();

    click(getBySelector<HTMLButtonElement>(fixture, 'button[aria-label="Next page"]'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([1]);
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageIndex: 1,
      previousPageIndex: 0,
      trigger: 'next',
    });
    expect(getBySelector<HTMLElement>(fixture, '[data-testid="range"]').textContent?.trim()).toBe(
      '11-20 of 25',
    );
  });

  it('updates page size from the select', () => {
    const fixture = createFixture();

    changeSelectValue(getBySelector<HTMLSelectElement>(fixture, 'select[tngPaginationPageSize]'), '20');
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSizeChanges).toEqual([20]);
    expect(fixture.componentInstance.pageChanges.at(-1)).toMatchObject({
      pageSize: 20,
      trigger: 'size',
    });
  });

  it('supports controlled page index without mutating until the host syncs', () => {
    const fixture = createFixture();

    fixture.componentInstance.pageIndex.set(0);
    fixture.detectChanges();
    click(getBySelector<HTMLButtonElement>(fixture, 'button[aria-label="Next page"]'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pageIndexChanges).toEqual([1]);
    expect(getBySelector<HTMLElement>(fixture, '[data-testid="range"]').textContent?.trim()).toBe(
      '1-10 of 25',
    );

    fixture.componentInstance.pageIndex.set(1);
    fixture.detectChanges();
    expect(getBySelector<HTMLElement>(fixture, '[data-testid="range"]').textContent?.trim()).toBe(
      '11-20 of 25',
    );
  });

  it('hides optional sections when configured', () => {
    const fixture = createFixture();

    fixture.componentInstance.showFirstLast.set(false);
    fixture.componentInstance.showPageSize.set(false);
    fixture.componentInstance.showRange.set(false);
    fixture.detectChanges();

    expect(getAllBySelector(fixture, '[data-testid="range"]')).toHaveLength(0);
    expect(getAllBySelector(fixture, 'select[tngPaginationPageSize]')).toHaveLength(0);
    expect(getAllBySelector(fixture, 'button[aria-label="First page"]')).toHaveLength(0);
    expect(getAllBySelector(fixture, 'button[aria-label="Last page"]')).toHaveLength(0);
  });

  it('disables controls when disabled', () => {
    const fixture = createFixture();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(getBySelector<HTMLButtonElement>(fixture, 'button[aria-label="Next page"]').disabled).toBe(
      true,
    );
    expect(getBySelector<HTMLSelectElement>(fixture, 'select[tngPaginationPageSize]').disabled).toBe(
      true,
    );
  });
});
