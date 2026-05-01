import { Component, signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import {
  TngPagination,
  type TngPaginationChangeEvent,
  TngPaginationFirst,
  TngPaginationLast,
  TngPaginationNext,
  TngPaginationPage,
  TngPaginationPageSize,
  TngPaginationPrevious,
} from '../tng-pagination';

export const paginationImports = [
  TngPagination,
  TngPaginationFirst,
  TngPaginationPrevious,
  TngPaginationNext,
  TngPaginationLast,
  TngPaginationPage,
  TngPaginationPageSize,
] as const;

@Component({
  imports: [...paginationImports],
  template: `
    <nav
      tngPagination
      data-testid="pagination"
      [ariaLabel]="ariaLabel()"
      [defaultPageIndex]="defaultPageIndex()"
      [defaultPageSize]="defaultPageSize()"
      [disabled]="disabled()"
      [mode]="mode()"
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [totalItems]="totalItems()"
      (pageChange)="onPageChange($event)"
      (pageIndexChange)="onPageIndexChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    >
      <button tngPaginationFirst data-testid="first">First</button>
      <button tngPaginationPrevious data-testid="previous">Previous</button>
      <button tngPaginationPage data-testid="page-1" [tngPaginationPage]="pageOne()">One</button>
      <button tngPaginationPage data-testid="page-2" [tngPaginationPage]="pageTwo()">Two</button>
      <button tngPaginationPage data-testid="page-outside" [tngPaginationPage]="outsidePage()">Outside</button>
      <button tngPaginationNext data-testid="next">Next</button>
      <button tngPaginationLast data-testid="last">Last</button>
      <select tngPaginationPageSize data-testid="size">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="bad">Bad</option>
      </select>
    </nav>
  `,
})
export class PaginationHarnessComponent {
  public readonly ariaLabel = signal<string | null>('Results pages');
  public readonly defaultPageIndex = signal(0);
  public readonly defaultPageSize = signal(10);
  public readonly disabled = signal(false);
  public readonly mode = signal<'client' | 'server'>('client');
  public readonly pageIndex = signal<number | undefined>(undefined);
  public readonly pageSize = signal<number | undefined>(undefined);
  public readonly totalItems = signal(25);
  public readonly pageOne = signal(0);
  public readonly pageTwo = signal(1);
  public readonly outsidePage = signal(99);

  public readonly events: string[] = [];
  public readonly pageChanges: TngPaginationChangeEvent[] = [];
  public readonly pageIndexChanges: number[] = [];
  public readonly pageSizeChanges: number[] = [];
  public autoSync = false;

  public onPageChange(event: TngPaginationChangeEvent): void {
    this.events.push(`pageChange:${event.trigger}:${event.pageIndex}:${event.pageSize}`);
    this.pageChanges.push(event);
  }

  public onPageIndexChange(pageIndex: number): void {
    this.events.push(`pageIndexChange:${pageIndex}`);
    this.pageIndexChanges.push(pageIndex);
    if (this.autoSync) {
      this.pageIndex.set(pageIndex);
    }
  }

  public onPageSizeChange(pageSize: number): void {
    this.events.push(`pageSizeChange:${pageSize}`);
    this.pageSizeChanges.push(pageSize);
    if (this.autoSync) {
      this.pageSize.set(pageSize);
    }
  }
}

@Component({
  imports: [TngPagination],
  template: `
    <nav
      tngPagination
      data-testid="pagination"
      [ariaLabel]="ariaLabel()"
      [totalItems]="totalItems()"
    ></nav>
  `,
})
export class PaginationRootOnlyComponent {
  public readonly ariaLabel = signal<string | null>('Pages');
  public readonly totalItems = signal(0);
}

@Component({
  imports: [TngPagination],
  template: `
    <div tngPagination data-testid="pagination" [totalItems]="totalItems()"></div>
  `,
})
export class PaginationDivRootComponent {
  public readonly totalItems = signal(0);
}

export function createPaginationFixture(): ComponentFixture<PaginationHarnessComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [PaginationHarnessComponent],
  }).createComponent(PaginationHarnessComponent);

  fixture.detectChanges();
  return fixture;
}

export function createFixture<TComponent>(component: new () => TComponent): ComponentFixture<TComponent> {
  const fixture = TestBed.configureTestingModule({
    imports: [component],
  }).createComponent(component);

  fixture.detectChanges();
  return fixture;
}

export function getByTestId<TElement extends Element>(
  fixture: ComponentFixture<unknown>,
  testId: string,
): TElement {
  const host = fixture.nativeElement as HTMLElement;
  const element = host.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as TElement;
}

export function click(element: HTMLElement): void {
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
}

export function changeSelectValue(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}
