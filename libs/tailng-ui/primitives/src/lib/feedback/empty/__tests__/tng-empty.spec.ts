import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngEmpty,
  TngEmptyActions,
  TngEmptyDescription,
  TngEmptyIcon,
  TngEmptyTitle,
} from '../tng-empty';

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
  standalone: true,
  imports: [TngEmpty, TngEmptyIcon, TngEmptyTitle, TngEmptyDescription, TngEmptyActions],
  template: `
    <section tngEmpty #emptyRef="tngEmpty" data-testid="empty">Root</section>
    <div tngEmptyIcon #iconRef="tngEmptyIcon" data-testid="icon">ICON</div>
    <h3 tngEmptyTitle #titleRef="tngEmptyTitle" data-testid="title">Title</h3>
    <p tngEmptyDescription #descriptionRef="tngEmptyDescription" data-testid="description">
      Description
    </p>
    <footer tngEmptyActions #actionsRef="tngEmptyActions" data-testid="actions">Actions</footer>
  `,
})
class EmptyPrimitivesHostComponent {
  @ViewChild('emptyRef', { static: true }) public emptyRef?: TngEmpty;
  @ViewChild('iconRef', { static: true }) public iconRef?: TngEmptyIcon;
  @ViewChild('titleRef', { static: true }) public titleRef?: TngEmptyTitle;
  @ViewChild('descriptionRef', { static: true }) public descriptionRef?: TngEmptyDescription;
  @ViewChild('actionsRef', { static: true }) public actionsRef?: TngEmptyActions;
}

describe('tng-empty primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports all public empty directives', () => {
    expect(typeof TngEmpty).toBe('function');
    expect(typeof TngEmptyIcon).toBe('function');
    expect(typeof TngEmptyTitle).toBe('function');
    expect(typeof TngEmptyDescription).toBe('function');
    expect(typeof TngEmptyActions).toBe('function');
  });

  it('supports exportAs handles for all directives', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyPrimitivesHostComponent],
    }).createComponent(EmptyPrimitivesHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.emptyRef).toBeInstanceOf(TngEmpty);
    expect(fixture.componentInstance.iconRef).toBeInstanceOf(TngEmptyIcon);
    expect(fixture.componentInstance.titleRef).toBeInstanceOf(TngEmptyTitle);
    expect(fixture.componentInstance.descriptionRef).toBeInstanceOf(TngEmptyDescription);
    expect(fixture.componentInstance.actionsRef).toBeInstanceOf(TngEmptyActions);
  });

  it('applies expected data-slot hooks to each primitive part', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyPrimitivesHostComponent],
    }).createComponent(EmptyPrimitivesHostComponent);
    fixture.detectChanges();

    expect(getByTestId<HTMLElement>(fixture, 'empty').getAttribute('data-slot')).toBe('empty');
    expect(getByTestId<HTMLElement>(fixture, 'icon').getAttribute('data-slot')).toBe('empty-icon');
    expect(getByTestId<HTMLElement>(fixture, 'title').getAttribute('data-slot')).toBe('empty-title');
    expect(getByTestId<HTMLElement>(fixture, 'description').getAttribute('data-slot')).toBe(
      'empty-description',
    );
    expect(getByTestId<HTMLElement>(fixture, 'actions').getAttribute('data-slot')).toBe(
      'empty-actions',
    );
  });
});
