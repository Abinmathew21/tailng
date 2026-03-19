import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  resolveTngSkeletonDataAnimated,
  resolveTngSkeletonDataRounded,
  TngSkeleton,
} from '../tng-skeleton';

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
  imports: [TngSkeleton],
  template: `
    <span
      tngSkeleton
      data-testid="skeleton"
      [animated]="animated()"
      [rounded]="rounded()"
    ></span>
  `,
})
class SkeletonPrimitiveHostComponent {
  public readonly animated = signal(true);
  public readonly rounded = signal(true);
}

describe('tng-skeleton primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports skeleton directive', () => {
    expect(typeof TngSkeleton).toBe('function');
  });

  it('resolves skeleton data attributes', () => {
    expect(resolveTngSkeletonDataAnimated(true)).toBe('true');
    expect(resolveTngSkeletonDataAnimated(false)).toBe('false');
    expect(resolveTngSkeletonDataRounded(true)).toBe('true');
    expect(resolveTngSkeletonDataRounded(false)).toBe('false');
  });

  it('applies decorative accessibility semantics and slot hook', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonPrimitiveHostComponent],
    }).createComponent(SkeletonPrimitiveHostComponent);
    fixture.detectChanges();

    const skeleton = getByTestId<HTMLElement>(fixture, 'skeleton');
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.getAttribute('role')).toBe('presentation');
    expect(skeleton.getAttribute('data-slot')).toBe('skeleton');
  });

  it('reflects animated and rounded state attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonPrimitiveHostComponent],
    }).createComponent(SkeletonPrimitiveHostComponent);
    fixture.detectChanges();

    const skeleton = getByTestId<HTMLElement>(fixture, 'skeleton');
    expect(skeleton.getAttribute('data-animated')).toBe('true');
    expect(skeleton.getAttribute('data-rounded')).toBe('true');

    fixture.componentInstance.animated.set(false);
    fixture.componentInstance.rounded.set(false);
    fixture.detectChanges();

    expect(skeleton.getAttribute('data-animated')).toBe('false');
    expect(skeleton.getAttribute('data-rounded')).toBe('false');
  });
});
