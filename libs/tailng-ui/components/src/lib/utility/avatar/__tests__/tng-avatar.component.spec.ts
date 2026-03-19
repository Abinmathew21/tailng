import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { toTngAvatarFallbackText, TngAvatarComponent } from '../tng-avatar.component';

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

function queryRoot(avatarHost: HTMLElement): HTMLSpanElement {
  const root = avatarHost.querySelector('.tng-avatar');
  if (!(root instanceof HTMLSpanElement)) {
    throw new Error('Expected .tng-avatar root element.');
  }

  return root;
}

function queryImage(avatarHost: HTMLElement): HTMLImageElement {
  const image = avatarHost.querySelector('.tng-avatar-image');
  if (!(image instanceof HTMLImageElement)) {
    throw new Error('Expected .tng-avatar-image element.');
  }

  return image;
}

function queryFallback(avatarHost: HTMLElement): HTMLSpanElement {
  const fallback = avatarHost.querySelector('.tng-avatar-fallback');
  if (!(fallback instanceof HTMLSpanElement)) {
    throw new Error('Expected .tng-avatar-fallback element.');
  }

  return fallback;
}

function dispatchEvent(target: EventTarget, type: string): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngAvatarComponent],
  template: `
    <tng-avatar
      data-testid="avatar"
      [src]="src()"
      [alt]="alt()"
      [fallback]="fallback()"
      [size]="size()"
      [shape]="shape()"
      [attr.tabindex]="tabIndex()"
      [attr.aria-label]="ariaLabel()"
    ></tng-avatar>
  `,
})
class AvatarComponentHost {
  public readonly alt = signal<string | null>('Taylor Ng');
  public readonly ariaLabel = signal<string | null>(null);
  public readonly fallback = signal<string | null>('Taylor Ng');
  public readonly shape = signal<'circle' | 'square'>('circle');
  public readonly size = signal<'sm' | 'md' | 'lg'>('md');
  public readonly src = signal<string | null>('https://cdn.tailng.dev/taylor.png');
  public readonly tabIndex = signal<number | null>(null);
}

describe('tng-avatar component behavior blocks A-F', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Public surface and fallback text helper', () => {
    it('exports the public TngAvatarComponent symbol', () => {
      expect(typeof TngAvatarComponent).toBe('function');
    });

    it('derives fallback text from single and multi-word names', () => {
      expect(toTngAvatarFallbackText('Taylor Ng')).toBe('TN');
      expect(toTngAvatarFallbackText('Tailng')).toBe('TA');
      expect(toTngAvatarFallbackText('Prince Joseph Kurian')).toBe('PJ');
      expect(toTngAvatarFallbackText('')).toBe('?');
      expect(toTngAvatarFallbackText(undefined)).toBe('?');
    });
  });

  describe('B) Rendering and data attributes', () => {
    it('renders root, image, and fallback slots with expected data hooks', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.detectChanges();

      const avatarHost = getByTestId<HTMLElement>(fixture, 'avatar');
      const root = queryRoot(avatarHost);
      const image = queryImage(avatarHost);
      const fallback = queryFallback(avatarHost);

      expect(root.getAttribute('data-slot')).toBe('avatar');
      expect(root.getAttribute('data-size')).toBe('md');
      expect(root.getAttribute('data-shape')).toBe('circle');
      expect(image.getAttribute('data-slot')).toBe('avatar-image');
      expect(fallback.getAttribute('data-slot')).toBe('avatar-fallback');
    });

    it('updates data-size and data-shape when component inputs change', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.detectChanges();

      fixture.componentInstance.size.set('lg');
      fixture.componentInstance.shape.set('square');
      fixture.detectChanges();

      const root = queryRoot(getByTestId<HTMLElement>(fixture, 'avatar'));
      expect(root.getAttribute('data-size')).toBe('lg');
      expect(root.getAttribute('data-shape')).toBe('square');
    });
  });

  describe('C) Image and fallback visibility behavior', () => {
    it('shows image and hides fallback when src is present and no error occurred', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.detectChanges();

      const avatarHost = getByTestId<HTMLElement>(fixture, 'avatar');
      const image = queryImage(avatarHost);
      const fallback = queryFallback(avatarHost);

      expect(image.getAttribute('hidden')).toBeNull();
      expect(fallback.getAttribute('hidden')).toBe('');
    });

    it('shows fallback and hides image when src is missing', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.src.set(null);
      fixture.detectChanges();

      const avatarHost = getByTestId<HTMLElement>(fixture, 'avatar');
      const image = queryImage(avatarHost);
      const fallback = queryFallback(avatarHost);

      expect(image.getAttribute('hidden')).toBe('');
      expect(image.getAttribute('src')).toBeNull();
      expect(fallback.getAttribute('hidden')).toBeNull();
    });

    it('shows fallback on image error and hides fallback again on image load', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.detectChanges();

      const avatarHost = getByTestId<HTMLElement>(fixture, 'avatar');
      const image = queryImage(avatarHost);
      const fallback = queryFallback(avatarHost);

      dispatchEvent(image, 'error');
      fixture.detectChanges();
      expect(image.getAttribute('hidden')).toBe('');
      expect(fallback.getAttribute('hidden')).toBeNull();

      dispatchEvent(image, 'load');
      fixture.detectChanges();
      expect(image.getAttribute('hidden')).toBeNull();
      expect(fallback.getAttribute('hidden')).toBe('');
    });
  });

  describe('D) Accessibility-related attributes', () => {
    it('forwards meaningful alt text to the avatar image', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.alt.set('Taylor Ng profile picture');
      fixture.detectChanges();

      const image = queryImage(getByTestId<HTMLElement>(fixture, 'avatar'));
      expect(image.getAttribute('alt')).toBe('Taylor Ng profile picture');
    });

    it('supports decorative image alt by preserving an empty alt string', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.alt.set('');
      fixture.detectChanges();

      const image = queryImage(getByTestId<HTMLElement>(fixture, 'avatar'));
      expect(image.getAttribute('alt')).toBe('');
    });

    it('retains focusability and accessible name when host is made focusable', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.tabIndex.set(0);
      fixture.componentInstance.ariaLabel.set('Taylor Ng avatar');
      fixture.detectChanges();

      const avatarHost = getByTestId<HTMLElement>(fixture, 'avatar');
      expect(avatarHost.getAttribute('tabindex')).toBe('0');
      expect(avatarHost.getAttribute('aria-label')).toBe('Taylor Ng avatar');
    });
  });

  describe('E) Fallback content behavior', () => {
    it('renders initials in fallback slot when fallback text is provided', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.src.set(null);
      fixture.componentInstance.fallback.set('Prince Joseph');
      fixture.detectChanges();

      const fallback = queryFallback(getByTestId<HTMLElement>(fixture, 'avatar'));
      expect(fallback.textContent?.trim()).toBe('PJ');
      expect(fallback.getAttribute('hidden')).toBeNull();
    });

    it('falls back to "?" when fallback input is empty', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AvatarComponentHost] }).createComponent(
        AvatarComponentHost,
      );
      fixture.componentInstance.src.set(null);
      fixture.componentInstance.fallback.set('');
      fixture.detectChanges();

      const fallback = queryFallback(getByTestId<HTMLElement>(fixture, 'avatar'));
      expect(fallback.textContent?.trim()).toBe('?');
    });
  });
});
