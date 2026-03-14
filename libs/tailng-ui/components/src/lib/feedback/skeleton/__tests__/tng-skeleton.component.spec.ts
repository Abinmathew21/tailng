import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveTngSkeletonCssSize, TngSkeletonComponent } from '../tng-skeleton.component';

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

@Component({
  standalone: true,
  imports: [TngSkeletonComponent],
  template: `
    <tng-skeleton
      data-testid="skeleton-host"
      [animated]="animated()"
      [height]="height()"
      [rounded]="rounded()"
      [width]="width()"
    ></tng-skeleton>
  `,
})
class SkeletonComponentHostComponent {
  public readonly animated = signal(true);
  public readonly height = signal('1.25rem');
  public readonly rounded = signal(true);
  public readonly width = signal('75%');
}

describe('tng-skeleton component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports skeleton component', () => {
    expect(typeof TngSkeletonComponent).toBe('function');
  });

  it('resolves css size values', () => {
    expect(resolveTngSkeletonCssSize('2rem', '1rem')).toBe('2rem');
    expect(resolveTngSkeletonCssSize('  ', '1rem')).toBe('1rem');
  });

  it('renders skeleton root with decorative semantics and resolved size styles', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const skeleton = getRequired<HTMLElement>(host, '[data-slot="skeleton"]');

    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.getAttribute('role')).toBe('presentation');
    expect(skeleton.getAttribute('data-animated')).toBe('true');
    expect(skeleton.getAttribute('data-rounded')).toBe('true');
    expect(skeleton.style.width).toBe('75%');
    expect(skeleton.style.height).toBe('1.25rem');
  });

  it('updates state and falls back to default size when empty values are provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.animated.set(false);
    fixture.componentInstance.rounded.set(false);
    fixture.componentInstance.width.set('  ');
    fixture.componentInstance.height.set('');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const skeleton = getRequired<HTMLElement>(host, '[data-slot="skeleton"]');

    expect(skeleton.getAttribute('data-animated')).toBe('false');
    expect(skeleton.getAttribute('data-rounded')).toBe('false');
    expect(skeleton.style.width).toBe('100%');
    expect(skeleton.style.height).toBe('1rem');
  });
});
