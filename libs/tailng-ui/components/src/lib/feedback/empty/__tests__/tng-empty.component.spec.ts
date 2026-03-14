import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngEmptyActionsComponent,
  TngEmptyComponent,
  TngEmptyDescriptionComponent,
  TngEmptyIconComponent,
  TngEmptyTitleComponent,
} from '../tng-empty.component';

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

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!(element instanceof Element)) {
    throw new Error(`Expected selector "${selector}" to resolve.`);
  }

  return element as T;
}

function getSlotValue(partHost: ParentNode, expectedSlotSelector: string): string | null {
  return getRequired<HTMLElement>(partHost, expectedSlotSelector).getAttribute('data-slot');
}

@Component({
  standalone: true,
  imports: [
    TngEmptyComponent,
    TngEmptyIconComponent,
    TngEmptyTitleComponent,
    TngEmptyDescriptionComponent,
    TngEmptyActionsComponent,
  ],
  template: `
    <tng-empty #emptyRef data-testid="empty-host" [align]="align()">
      <tng-empty-icon data-testid="empty-icon">BOX</tng-empty-icon>
      <tng-empty-title data-testid="empty-title">No projects found</tng-empty-title>
      <tng-empty-description data-testid="empty-description">
        Create your first project to start tracking releases.
      </tng-empty-description>
      <tng-empty-actions data-testid="empty-actions">
        <button type="button" data-testid="empty-primary-action">Create project</button>
        <button type="button" data-testid="empty-secondary-action">Learn more</button>
      </tng-empty-actions>
    </tng-empty>
  `,
})
class EmptyComponentsHostComponent {
  public readonly align = signal<'center' | 'start'>('center');

  @ViewChild('emptyRef', { static: true })
  public emptyRef?: TngEmptyComponent;
}

describe('tng-empty component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports all public empty components', () => {
    expect(typeof TngEmptyComponent).toBe('function');
    expect(typeof TngEmptyIconComponent).toBe('function');
    expect(typeof TngEmptyTitleComponent).toBe('function');
    expect(typeof TngEmptyDescriptionComponent).toBe('function');
    expect(typeof TngEmptyActionsComponent).toBe('function');
  });

  it('renders root slot with default center alignment', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyComponentsHostComponent],
    }).createComponent(EmptyComponentsHostComponent);
    fixture.detectChanges();

    const emptyHost = getByTestId<HTMLElement>(fixture, 'empty-host');
    const root = getRequired<HTMLElement>(emptyHost, '[data-slot="empty"]');
    expect(root.classList.contains('tng-empty')).toBe(true);
    expect(root.getAttribute('data-align')).toBe('center');
  });

  it('updates root alignment hook when align input changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyComponentsHostComponent],
    }).createComponent(EmptyComponentsHostComponent);
    fixture.detectChanges();

    const emptyHost = getByTestId<HTMLElement>(fixture, 'empty-host');
    const root = getRequired<HTMLElement>(emptyHost, '[data-slot="empty"]');
    expect(root.getAttribute('data-align')).toBe('center');

    fixture.componentInstance.align.set('start');
    fixture.detectChanges();
    expect(root.getAttribute('data-align')).toBe('start');
  });

  it('projects icon/title/description/actions parts with slot hooks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyComponentsHostComponent],
    }).createComponent(EmptyComponentsHostComponent);
    fixture.detectChanges();

    const emptyHost = getByTestId<HTMLElement>(fixture, 'empty-host');
    const iconHost = getRequired<HTMLElement>(emptyHost, '[data-testid="empty-icon"]');
    const titleHost = getRequired<HTMLElement>(emptyHost, '[data-testid="empty-title"]');
    const descriptionHost = getRequired<HTMLElement>(emptyHost, '[data-testid="empty-description"]');
    const actionsHost = getRequired<HTMLElement>(emptyHost, '[data-testid="empty-actions"]');

    expect(getSlotValue(iconHost, '[data-slot="empty-icon"]')).toBe('empty-icon');
    expect(getSlotValue(titleHost, '[data-slot="empty-title"]')).toBe('empty-title');
    expect(getSlotValue(descriptionHost, '[data-slot="empty-description"]')).toBe(
      'empty-description',
    );
    expect(getSlotValue(actionsHost, '[data-slot="empty-actions"]')).toBe('empty-actions');
  });

  it('keeps projected interactive controls inside empty actions content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [EmptyComponentsHostComponent],
    }).createComponent(EmptyComponentsHostComponent);
    fixture.detectChanges();

    const emptyHost = getByTestId<HTMLElement>(fixture, 'empty-host');
    const actions = getRequired<HTMLElement>(emptyHost, '[data-testid="empty-actions"]');
    const buttons = actions.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(getByTestId<HTMLButtonElement>(fixture, 'empty-primary-action').textContent?.trim()).toBe(
      'Create project',
    );
    expect(
      getByTestId<HTMLButtonElement>(fixture, 'empty-secondary-action').textContent?.trim(),
    ).toBe('Learn more');
  });
});
