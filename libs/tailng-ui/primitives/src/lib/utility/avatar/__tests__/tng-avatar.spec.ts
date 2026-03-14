import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '../tng-avatar';

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
  imports: [TngAvatar, TngAvatarImage, TngAvatarFallback],
  template: `
    <div
      data-testid="avatar-root"
      tngAvatar
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
    >
      <img
        data-testid="avatar-image"
        tngAvatarImage
        [attr.alt]="alt()"
        [attr.src]="src()"
      />
      <span data-testid="avatar-fallback" tngAvatarFallback>{{ fallback() }}</span>
    </div>
  `,
})
class AvatarPrimitivesHostComponent {
  public readonly alt = signal('Taylor Ng');
  public readonly fallback = signal('TN');
  public readonly shape = signal<'circle' | 'square'>('circle');
  public readonly size = signal<'sm' | 'md' | 'lg'>('md');
  public readonly src = signal('/assets/avatar.png');
}

describe('tng-avatar primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports all public avatar directives', () => {
    expect(typeof TngAvatar).toBe('function');
    expect(typeof TngAvatarImage).toBe('function');
    expect(typeof TngAvatarFallback).toBe('function');
  });

  it('applies data-slot hooks on root, image, and fallback', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AvatarPrimitivesHostComponent],
    }).createComponent(AvatarPrimitivesHostComponent);

    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'avatar-root');
    const image = getByTestId<HTMLImageElement>(fixture, 'avatar-image');
    const fallback = getByTestId<HTMLElement>(fixture, 'avatar-fallback');

    expect(root.getAttribute('data-slot')).toBe('avatar');
    expect(image.getAttribute('data-slot')).toBe('avatar-image');
    expect(fallback.getAttribute('data-slot')).toBe('avatar-fallback');
  });

  it('keeps consumer-provided data-size and data-shape attributes on the root', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AvatarPrimitivesHostComponent],
    }).createComponent(AvatarPrimitivesHostComponent);

    fixture.detectChanges();

    let root = getByTestId<HTMLElement>(fixture, 'avatar-root');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-shape')).toBe('circle');

    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.shape.set('square');
    fixture.detectChanges();

    root = getByTestId<HTMLElement>(fixture, 'avatar-root');
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.getAttribute('data-shape')).toBe('square');
  });

  it('does not override native image attributes or fallback text content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AvatarPrimitivesHostComponent],
    }).createComponent(AvatarPrimitivesHostComponent);

    fixture.detectChanges();

    let image = getByTestId<HTMLImageElement>(fixture, 'avatar-image');
    let fallback = getByTestId<HTMLElement>(fixture, 'avatar-fallback');
    expect(image.getAttribute('alt')).toBe('Taylor Ng');
    expect(image.getAttribute('src')).toContain('/assets/avatar.png');
    expect(fallback.textContent?.trim()).toBe('TN');

    fixture.componentInstance.alt.set('Prince Joseph');
    fixture.componentInstance.src.set('/assets/other-avatar.png');
    fixture.componentInstance.fallback.set('PJ');
    fixture.detectChanges();

    image = getByTestId<HTMLImageElement>(fixture, 'avatar-image');
    fallback = getByTestId<HTMLElement>(fixture, 'avatar-fallback');
    expect(image.getAttribute('alt')).toBe('Prince Joseph');
    expect(image.getAttribute('src')).toContain('/assets/other-avatar.png');
    expect(fallback.textContent?.trim()).toBe('PJ');
  });
});
