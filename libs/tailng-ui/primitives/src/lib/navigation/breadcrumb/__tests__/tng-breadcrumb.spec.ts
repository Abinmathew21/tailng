import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngBreadcrumb,
  TngBreadcrumbItem,
  TngBreadcrumbLink,
  TngBreadcrumbList,
  TngBreadcrumbSeparator,
} from '../tng-breadcrumb';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

@Component({
  imports: [TngBreadcrumb, TngBreadcrumbList, TngBreadcrumbItem, TngBreadcrumbLink, TngBreadcrumbSeparator],
  template: `
    <nav tngBreadcrumb #breadcrumbRef="tngBreadcrumb" data-testid="breadcrumb-root" aria-label="Breadcrumb">
      <ol tngBreadcrumbList #listRef="tngBreadcrumbList" data-testid="breadcrumb-list">
        <li tngBreadcrumbItem #itemRef="tngBreadcrumbItem" data-testid="breadcrumb-item">
          <a tngBreadcrumbLink #linkRef="tngBreadcrumbLink" data-testid="breadcrumb-link" href="/home">
            Home
          </a>
        </li>
        <li tngBreadcrumbSeparator #separatorRef="tngBreadcrumbSeparator" data-testid="breadcrumb-separator">
          /
        </li>
      </ol>
    </nav>
  `,
})
class BreadcrumbPrimitiveHostComponent {
  @ViewChild('breadcrumbRef', { static: true })
  public breadcrumbRef?: TngBreadcrumb;

  @ViewChild('listRef', { static: true })
  public listRef?: TngBreadcrumbList;

  @ViewChild('itemRef', { static: true })
  public itemRef?: TngBreadcrumbItem;

  @ViewChild('linkRef', { static: true })
  public linkRef?: TngBreadcrumbLink;

  @ViewChild('separatorRef', { static: true })
  public separatorRef?: TngBreadcrumbSeparator;
}

describe('tng-breadcrumb primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports breadcrumb directives', () => {
    expect(typeof TngBreadcrumb).toBe('function');
    expect(typeof TngBreadcrumbList).toBe('function');
    expect(typeof TngBreadcrumbItem).toBe('function');
    expect(typeof TngBreadcrumbLink).toBe('function');
    expect(typeof TngBreadcrumbSeparator).toBe('function');
  });

  it('supports exportAs references for all breadcrumb directives', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BreadcrumbPrimitiveHostComponent],
    }).createComponent(BreadcrumbPrimitiveHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.breadcrumbRef).toBeInstanceOf(TngBreadcrumb);
    expect(fixture.componentInstance.listRef).toBeInstanceOf(TngBreadcrumbList);
    expect(fixture.componentInstance.itemRef).toBeInstanceOf(TngBreadcrumbItem);
    expect(fixture.componentInstance.linkRef).toBeInstanceOf(TngBreadcrumbLink);
    expect(fixture.componentInstance.separatorRef).toBeInstanceOf(TngBreadcrumbSeparator);
  });

  it('applies slot hooks without changing native landmark/list semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BreadcrumbPrimitiveHostComponent],
    }).createComponent(BreadcrumbPrimitiveHostComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'breadcrumb-root');
    const list = getByTestId<HTMLElement>(fixture, 'breadcrumb-list');
    const item = getByTestId<HTMLElement>(fixture, 'breadcrumb-item');
    const link = getByTestId<HTMLElement>(fixture, 'breadcrumb-link');

    expect(root.tagName.toLowerCase()).toBe('nav');
    expect(root.getAttribute('data-slot')).toBe('breadcrumb');

    expect(list.tagName.toLowerCase()).toBe('ol');
    expect(list.getAttribute('data-slot')).toBe('breadcrumb-list');

    expect(item.tagName.toLowerCase()).toBe('li');
    expect(item.getAttribute('data-slot')).toBe('breadcrumb-item');

    expect(link.tagName.toLowerCase()).toBe('a');
    expect(link.getAttribute('data-slot')).toBe('breadcrumb-link');
    expect(link.getAttribute('href')).toBe('/home');
  });

  it('marks separator as decorative and non-announced', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BreadcrumbPrimitiveHostComponent],
    }).createComponent(BreadcrumbPrimitiveHostComponent);
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'breadcrumb-separator');
    expect(separator.getAttribute('data-slot')).toBe('breadcrumb-separator');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });
});
