import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  resolveTngToastAriaLive,
  resolveTngToastDataState,
  resolveTngToastHidden,
  resolveTngToastRole,
  TngToastItem,
  TngToastViewport,
  type TngToastTone,
} from '../tng-toast';

function getByTestId<TElement extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): TElement {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (!(element instanceof Element)) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as TElement;
}

@Component({
  imports: [TngToastViewport, TngToastItem],
  template: `
    <section tngToastViewport data-testid="viewport">
      <article tngToastItem data-testid="toast-item" [open]="open()" [tone]="tone()">
        Message
      </article>
    </section>
  `,
})
class ToastPrimitiveHostComponent {
  public readonly open = signal(true);
  public readonly tone = signal<TngToastTone>('neutral');
}

describe('tng-toast primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports toast primitives', () => {
    expect(typeof TngToastViewport).toBe('function');
    expect(typeof TngToastItem).toBe('function');
  });

  it('maps tone to aria role and live politeness', () => {
    expect(resolveTngToastRole('neutral')).toBe('status');
    expect(resolveTngToastRole('success')).toBe('status');
    expect(resolveTngToastRole('warning')).toBe('alert');
    expect(resolveTngToastRole('danger')).toBe('alert');
    expect(resolveTngToastAriaLive('neutral')).toBe('polite');
    expect(resolveTngToastAriaLive('danger')).toBe('assertive');
  });

  it('maps open state to visibility attributes', () => {
    expect(resolveTngToastDataState(true)).toBe('open');
    expect(resolveTngToastDataState(false)).toBe('closed');
    expect(resolveTngToastHidden(true)).toBeNull();
    expect(resolveTngToastHidden(false)).toBe('');
  });

  it('applies viewport and item slot hooks with default semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastPrimitiveHostComponent],
    }).createComponent(ToastPrimitiveHostComponent);
    fixture.detectChanges();

    const viewport = getByTestId<HTMLElement>(fixture, 'viewport');
    const item = getByTestId<HTMLElement>(fixture, 'toast-item');

    expect(viewport.getAttribute('data-slot')).toBe('toast-viewport');
    expect(item.getAttribute('data-slot')).toBe('toast-item');
    expect(item.getAttribute('data-tone')).toBe('neutral');
    expect(item.getAttribute('data-state')).toBe('open');
    expect(item.getAttribute('hidden')).toBeNull();
    expect(item.getAttribute('role')).toBe('status');
    expect(item.getAttribute('aria-live')).toBe('polite');
    expect(item.getAttribute('aria-atomic')).toBe('true');
  });

  it('updates tone-driven semantics when tone changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastPrimitiveHostComponent],
    }).createComponent(ToastPrimitiveHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.tone.set('warning');
    fixture.detectChanges();

    const item = getByTestId<HTMLElement>(fixture, 'toast-item');
    expect(item.getAttribute('data-tone')).toBe('warning');
    expect(item.getAttribute('role')).toBe('alert');
    expect(item.getAttribute('aria-live')).toBe('assertive');
  });

  it('reflects closed visibility state when open=false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastPrimitiveHostComponent],
    }).createComponent(ToastPrimitiveHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();

    const item = getByTestId<HTMLElement>(fixture, 'toast-item');
    expect(item.getAttribute('data-state')).toBe('closed');
    expect(item.getAttribute('hidden')).toBe('');
  });
});
