import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngTag, TngTagClose, TngTagIcon } from '../tng-tag';

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

function queryByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
  ctor: new (...args: unknown[]) => T,
): T | null {
  const el = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  return el instanceof ctor ? el : null;
}

function dispatchEvent(target: EventTarget, type: string): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

function dispatchKeyboard(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  target.dispatchEvent(event);
  return event;
}

@Component({
  standalone: true,
  imports: [TngTag, TngTagIcon, TngTagClose],
  template: `
    <span
      data-testid="tag-root"
      tngTag
      [tngTagDisabled]="disabled()"
      [tngTagRemovable]="removable()"
      [tngTagLabel]="label()"
      (tngTagRemoved)="onRemoved()"
    >
      <span data-testid="tag-icon" tngTagIcon aria-hidden="true">#</span>
      <span data-testid="tag-content">{{ label() }}</span>
      @if (showClose()) {
        <button
          data-testid="tag-close"
          tngTagClose
          [tngTagCloseAriaLabel]="closeAriaLabel()"
        >
          ×
        </button>
      }
    </span>
  `,
})
class TagPrimitiveHostComponent {
  public readonly closeAriaLabel = signal<string | null>(null);
  public readonly disabled = signal(false);
  public readonly label = signal('Release');
  public readonly removable = signal(true);
  public readonly removedCount = signal(0);
  public readonly showClose = signal(true);

  public onRemoved(): void {
    this.removedCount.update((value) => value + 1);
  }
}

describe('tng-tag primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports all public tag primitive directives', () => {
    expect(typeof TngTag).toBe('function');
    expect(typeof TngTagIcon).toBe('function');
    expect(typeof TngTagClose).toBe('function');
  });

  it('renders root, icon, and close slot hooks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'tag-root');
    const icon = getByTestId<HTMLElement>(fixture, 'tag-icon');
    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');

    expect(root.getAttribute('data-slot')).toBe('tag');
    expect(icon.getAttribute('data-slot')).toBe('tag-icon');
    expect(close.getAttribute('data-slot')).toBe('tag-close');
  });

  it('applies data-removable and data-disabled state hooks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.detectChanges();

    let root = getByTestId<HTMLElement>(fixture, 'tag-root');
    expect(root.getAttribute('data-removable')).toBe('');
    expect(root.getAttribute('data-disabled')).toBeNull();
    expect(root.getAttribute('aria-disabled')).toBeNull();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    root = getByTestId<HTMLElement>(fixture, 'tag-root');
    expect(root.getAttribute('data-disabled')).toBe('');
    expect(root.getAttribute('aria-disabled')).toBe('true');
  });

  it('omits close button when host template does not render a close control', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.componentInstance.showClose.set(false);
    fixture.detectChanges();

    expect(queryByTestId(fixture, 'tag-close', HTMLButtonElement)).toBeNull();
  });

  it('uses default accessible label on close button when explicit label is not provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.componentInstance.label.set('Draft');
    fixture.detectChanges();

    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    expect(close.getAttribute('aria-label')).toBe('Remove Draft');
  });

  it('respects explicit close aria label when provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.componentInstance.closeAriaLabel.set('Remove status chip');
    fixture.detectChanges();

    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    expect(close.getAttribute('aria-label')).toBe('Remove status chip');
  });

  it('emits tag removed when close button is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.detectChanges();

    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    dispatchEvent(close, 'click');
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount()).toBe(1);
  });

  it('supports keyboard activation (Enter and Space) on close button', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.detectChanges();

    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    dispatchKeyboard(close, 'Enter');
    dispatchKeyboard(close, ' ');
    fixture.detectChanges();

    expect(fixture.componentInstance.removedCount()).toBe(2);
  });

  it('prevents removal when tag is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    dispatchEvent(close, 'click');
    dispatchKeyboard(close, 'Enter');
    fixture.detectChanges();

    expect(close.getAttribute('data-disabled')).toBe('');
    expect(close.hasAttribute('disabled')).toBe(true);
    expect(fixture.componentInstance.removedCount()).toBe(0);
  });

  it('prevents removal when tag is not removable', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TagPrimitiveHostComponent],
    }).createComponent(TagPrimitiveHostComponent);
    fixture.componentInstance.removable.set(false);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'tag-root');
    const close = getByTestId<HTMLButtonElement>(fixture, 'tag-close');
    dispatchEvent(close, 'click');
    fixture.detectChanges();

    expect(root.getAttribute('data-removable')).toBeNull();
    expect(close.getAttribute('data-disabled')).toBe('');
    expect(fixture.componentInstance.removedCount()).toBe(0);
  });
});
