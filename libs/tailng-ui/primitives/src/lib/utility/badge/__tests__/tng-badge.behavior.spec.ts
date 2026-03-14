/* eslint-disable max-lines-per-function */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  type TngBadgePosition,
  TngBadge,
  type TngBadgeSize,
  type TngBadgeTone,
  type TngBadgeVariant,
} from '../tng-badge';

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

function queryBadge(host: HTMLElement): HTMLSpanElement | null {
  const badge = host.querySelector('.tng-badge');
  return badge instanceof HTMLSpanElement ? badge : null;
}

function getBadge(host: HTMLElement): HTMLSpanElement {
  const badge = queryBadge(host);
  if (badge === null) {
    throw new Error('Expected .tng-badge element.');
  }

  return badge;
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <button
      type="button"
      data-testid="host"
      [tngBadge]="badge()"
      [tngBadgeClass]="badgeClass()"
      [tngBadgeDisabled]="disabled()"
      [tngBadgeDot]="dot()"
      [tngBadgeHidden]="hidden()"
      [tngBadgeMax]="max()"
      [tngBadgeOffsetX]="offsetX()"
      [tngBadgeOffsetY]="offsetY()"
      [tngBadgePosition]="position()"
      [tngBadgeSize]="size()"
      [tngBadgeStyle]="badgeStyle()"
      [tngBadgeTone]="tone()"
      [tngBadgeVariant]="variant()"
      [class]="hostClass()"
      [attr.data-extra]="extraAttr()"
    >
      Inbox
    </button>
  `,
})
class BadgeHarnessHostComponent {
  public readonly badge = signal<number | string | null | undefined>(7);
  public readonly badgeClass = signal<string | null | undefined>(null);
  public readonly disabled = signal(false);
  public readonly dot = signal(false);
  public readonly hidden = signal(false);
  public readonly max = signal(99);
  public readonly offsetX = signal<number | string | null | undefined>(null);
  public readonly offsetY = signal<number | string | null | undefined>(null);
  public readonly position = signal<TngBadgePosition>('top-end');
  public readonly size = signal<TngBadgeSize>('md');
  public readonly badgeStyle = signal<Readonly<Record<string, number | string>> | null | undefined>(
    null,
  );
  public readonly tone = signal<TngBadgeTone>('danger');
  public readonly variant = signal<TngBadgeVariant>('solid');
  public readonly hostClass = signal('host-class');
  public readonly extraAttr = signal('extra-value');
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `<button type="button" data-testid="host" [tngBadge]="badge()">Inbox</button>`,
})
class MinimalBadgeHostComponent {
  public readonly badge = signal<number | string | null | undefined>(1);
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <button
      type="button"
      data-testid="host"
      aria-label="Inbox notifications"
      [tngBadge]="badge()"
    >
      Inbox
    </button>
  `,
})
class AccessibleBadgeHostComponent {
  public readonly badge = signal<number | string | null | undefined>(3);
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <span data-testid="inline-host" [tngBadge]="inlineValue()">Inline host</span>
    <div data-testid="block-host" [tngBadge]="blockValue()">Block host</div>
  `,
})
class InlineAndBlockBadgeHostComponent {
  public readonly inlineValue = signal(1);
  public readonly blockValue = signal(2);
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <button type="button" data-testid="host-a" [tngBadge]="first()">A</button>
    <button type="button" data-testid="host-b" [tngBadge]="second()">B</button>
  `,
})
class MultipleBadgeHostComponent {
  public readonly first = signal<number | string>(1);
  public readonly second = signal<number | string>('NEW');
}

type RectSize = Readonly<{
  height: number;
  width: number;
}>;

type MutableRectSize = {
  height: number;
  width: number;
};

function createRect(size: RectSize): DOMRect {
  return {
    bottom: size.height,
    height: size.height,
    left: 0,
    right: size.width,
    toJSON: () => ({}),
    top: 0,
    width: size.width,
    x: 0,
    y: 0,
  } as DOMRect;
}

function mockElementRect(element: Element, sizeRef: MutableRectSize): void {
  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => createRect(sizeRef));
}

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

class MockResizeObserver {
  public static instances: MockResizeObserver[] = [];

  private readonly targets = new Set<Element>();

  public readonly disconnect = vi.fn((): void => {
    this.targets.clear();
  });

  public readonly observe = vi.fn((target: Element): void => {
    this.targets.add(target);
  });

  public readonly unobserve = vi.fn((target: Element): void => {
    this.targets.delete(target);
  });

  public constructor(private readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }

  public trigger(target: Element): void {
    if (!this.targets.has(target)) {
      return;
    }

    const entry = { target } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

describe('tng-badge primitive behavior blocks A-M', () => {
  const globalWithResizeObserver = globalThis as unknown as {
    ResizeObserver?: typeof ResizeObserver;
  };
  const originalResizeObserver = globalWithResizeObserver.ResizeObserver;

  afterEach(() => {
    MockResizeObserver.instances = [];
    globalWithResizeObserver.ResizeObserver = originalResizeObserver;
    TestBed.resetTestingModule();
  });

  describe('A) Smoke / render', () => {
    it('renders the badge primitive without errors with default inputs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('1');
    });

    it('renders with empty content without throwing and safely removes badge node', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);

      fixture.componentInstance.badge.set('');
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(queryBadge(getByTestId<HTMLElement>(fixture, 'host'))).toBeNull();
    });

    it('preserves consumer-provided classes and unrelated attributes on the host', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      expect(host.classList.contains('host-class')).toBe(true);
      expect(host.classList.contains('tng-badge-host')).toBe(true);
      expect(host.getAttribute('data-extra')).toBe('extra-value');
    });
  });

  describe('B) Inputs, defaults & state attributes', () => {
    it('defaults tone/size/variant when not provided', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-tone')).toBe('danger');
      expect(badge.getAttribute('data-size')).toBe('md');
      expect(badge.getAttribute('data-variant')).toBe('solid');
    });

    it('applies tone/size/variant attributes that match input values', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.tone.set('success');
      fixture.componentInstance.size.set('lg');
      fixture.componentInstance.variant.set('outline');
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-tone')).toBe('success');
      expect(badge.getAttribute('data-size')).toBe('lg');
      expect(badge.getAttribute('data-variant')).toBe('outline');
    });

    it('applies data-dot only when dot=true', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.dot.set(false);
      fixture.detectChanges();

      let badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-dot')).toBe(false);

      fixture.componentInstance.dot.set(true);
      fixture.detectChanges();
      badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-dot')).toBe(true);
    });

    it('applies data-disabled only when disabled=true', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();

      let badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-disabled')).toBe(false);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();
      badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-disabled')).toBe(true);
    });
  });

  describe('C) Content rendering (status badge)', () => {
    it('renders string text content as provided when non-empty', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set('  NEW  ');
      fixture.detectChanges();

      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('  NEW  ');
    });

    it('updates rendered content when value input changes', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set('Alpha');
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('Alpha');

      fixture.componentInstance.badge.set('Beta');
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('Beta');
    });
  });

  describe('D) Count badge behavior', () => {
    it('renders numeric values and keeps zero visible', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(12);
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('12');

      fixture.componentInstance.badge.set(0);
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('0');
    });

    it('renders string value input', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set('NEW');
      fixture.detectChanges();

      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('NEW');
    });

    it('caps numeric output when value exceeds max', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.max.set(99);
      fixture.componentInstance.badge.set(120);
      fixture.detectChanges();

      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('99+');
    });

    it('updates rendered value when value changes at runtime', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(3);
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('3');

      fixture.componentInstance.badge.set(8);
      fixture.detectChanges();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('8');
    });
  });

  describe('E) Dot badge behavior', () => {
    it('omits text content when dot=true', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(42);
      fixture.componentInstance.dot.set(true);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-dot')).not.toBeNull();
      expect(badge.textContent).toBe('');
    });

    it('toggles between dot and text modes without stale data-dot attribute', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set('X');
      fixture.componentInstance.dot.set(true);
      fixture.detectChanges();

      let badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-dot')).toBe(true);
      expect(badge.textContent).toBe('');

      fixture.componentInstance.dot.set(false);
      fixture.detectChanges();
      badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-dot')).toBe(false);
      expect(badge.textContent).toBe('X');
    });
  });

  describe('F) Accessibility & ARIA behavior', () => {
    it('marks generated badge as decorative via aria-hidden', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('aria-hidden')).toBe('true');
    });

    it('preserves consumer-provided host accessible labeling', () => {
      const fixture = TestBed.configureTestingModule({ imports: [AccessibleBadgeHostComponent] })
        .createComponent(AccessibleBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      expect(host.getAttribute('aria-label')).toBe('Inbox notifications');
    });

    it('does not add ARIA role or aria-live by default', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('role')).toBeNull();
      expect(badge.getAttribute('aria-live')).toBeNull();
    });
  });

  describe('G) Styling invariants', () => {
    it('badge node is non-focusable by default and ignores pointer events', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('tabindex')).toBeNull();
      expect(badge.style.pointerEvents).toBe('none');
    });

    it('applies size-related min-height and line-height styles consistently', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.style.lineHeight).toBe('1');
      expect(badge.style.height).toBe('var(--tng-badge-size, 1.125rem)');
      expect(badge.style.minWidth).toBe('var(--tng-badge-size, 1.125rem)');
    });
  });

  describe('H) Adornment positioning primitives — anchor behavior', () => {
    it('applies positioning context on the host without wrappers', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      expect(host.style.position).toBe('relative');
      expect(host.hasAttribute('data-tng-badge-host')).toBe(true);
      expect(host.children).toHaveLength(1);
      expect(host.children[0]).toBe(getBadge(host));
    });

    it('works with both inline and block hosts', () => {
      const fixture = TestBed.configureTestingModule({ imports: [InlineAndBlockBadgeHostComponent] })
        .createComponent(InlineAndBlockBadgeHostComponent);
      fixture.detectChanges();

      const inlineHost = getByTestId<HTMLElement>(fixture, 'inline-host');
      const blockHost = getByTestId<HTMLElement>(fixture, 'block-host');

      expect(getBadge(inlineHost).textContent).toBe('1');
      expect(getBadge(blockHost).textContent).toBe('2');
    });

    it('removes badge node when host fixture is destroyed', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      fixture.destroy();
      expect(badge.isConnected).toBe(false);
    });
  });

  describe('I) Adornment positioning primitive behavior', () => {
    it('defaults placement metadata to top-end', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-placement')).toBe('top-end');
      expect(badge.getAttribute('data-position')).toBe('top-end');
      expect(badge.style.top).toBe('0px');
      expect(badge.style.right).toBe('0px');
      expect(badge.style.left).toBe('');
      expect(badge.style.bottom).toBe('');
    });

    it('applies placement metadata and offsets from inputs', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.position.set('bottom-start');
      fixture.componentInstance.offsetX.set(6);
      fixture.componentInstance.offsetY.set('0.25rem');
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-placement')).toBe('bottom-start');
      expect(badge.style.bottom).toBe('0px');
      expect(badge.style.left).toBe('0px');
      expect(badge.style.top).toBe('');
      expect(badge.style.right).toBe('');
      expect(badge.style.transform).toBe('translate(-50%, 50%) translate(6px, 0.25rem)');
    });

    it('updates position metadata when position input changes at runtime', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.position.set('top-end');
      fixture.detectChanges();

      let badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-placement')).toBe('top-end');

      fixture.componentInstance.position.set('top-start');
      fixture.detectChanges();

      badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.getAttribute('data-placement')).toBe('top-start');
      expect(badge.style.transform).toBe('translate(-50%, -50%) translate(0px, 0px)');
    });
  });

  describe('J) Visibility & hidden behavior', () => {
    it('renders badge when count is positive and hidden=false', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(5);
      fixture.componentInstance.hidden.set(false);
      fixture.detectChanges();

      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent).toBe('5');
    });

    it('renders dot badge when dot=true even if value is null', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(null);
      fixture.componentInstance.dot.set(true);
      fixture.componentInstance.hidden.set(false);
      fixture.detectChanges();

      const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
      expect(badge.hasAttribute('data-dot')).toBe(true);
      expect(badge.textContent).toBe('');
    });

    it('removes badge when hidden=true and restores it when hidden toggles back to false', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      const host = getByTestId<HTMLElement>(fixture, 'host');

      fixture.componentInstance.badge.set(7);
      fixture.componentInstance.hidden.set(false);
      fixture.detectChanges();
      expect(getBadge(host).textContent).toBe('7');

      fixture.componentInstance.hidden.set(true);
      fixture.detectChanges();
      expect(queryBadge(host)).toBeNull();

      fixture.componentInstance.hidden.set(false);
      fixture.detectChanges();
      expect(getBadge(host).textContent).toBe('7');
    });
  });

  describe('K) Multiple badges and isolation', () => {
    it('keeps badges isolated across multiple hosts on the same page', () => {
      const fixture = TestBed.configureTestingModule({ imports: [MultipleBadgeHostComponent] })
        .createComponent(MultipleBadgeHostComponent);
      fixture.detectChanges();

      const hostA = getByTestId<HTMLElement>(fixture, 'host-a');
      const hostB = getByTestId<HTMLElement>(fixture, 'host-b');
      expect(getBadge(hostA).textContent).toBe('1');
      expect(getBadge(hostB).textContent).toBe('NEW');

      fixture.componentInstance.first.set(9);
      fixture.componentInstance.second.set(4);
      fixture.detectChanges();

      expect(getBadge(hostA).textContent).toBe('9');
      expect(getBadge(hostB).textContent).toBe('4');
    });
  });

  describe('L) Edge cases', () => {
    it('handles very long text content without throwing', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set('VeryLongBadgeText_'.repeat(20));
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(getBadge(getByTestId<HTMLElement>(fixture, 'host')).textContent?.length).toBeGreaterThan(0);
    });

    it('handles null and undefined values safely by removing badge node', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.componentInstance.badge.set(null);
      fixture.detectChanges();
      expect(queryBadge(getByTestId<HTMLElement>(fixture, 'host'))).toBeNull();

      fixture.componentInstance.badge.set(undefined);
      fixture.detectChanges();
      expect(queryBadge(getByTestId<HTMLElement>(fixture, 'host'))).toBeNull();
    });

    it('toggles count/text/dot modes without stale DOM attributes', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      const host = getByTestId<HTMLElement>(fixture, 'host');

      fixture.componentInstance.badge.set(5);
      fixture.componentInstance.dot.set(false);
      fixture.detectChanges();
      expect(getBadge(host).textContent).toBe('5');

      fixture.componentInstance.badge.set('NEW');
      fixture.detectChanges();
      expect(getBadge(host).textContent).toBe('NEW');

      fixture.componentInstance.dot.set(true);
      fixture.detectChanges();
      expect(getBadge(host).textContent).toBe('');
      expect(getBadge(host).hasAttribute('data-dot')).toBe(true);

      fixture.componentInstance.dot.set(false);
      fixture.detectChanges();
      expect(getBadge(host).hasAttribute('data-dot')).toBe(false);
      expect(getBadge(host).textContent).toBe('NEW');
    });

    it('does not throw when fixture is destroyed after runtime updates', () => {
      const fixture = TestBed.configureTestingModule({ imports: [BadgeHarnessHostComponent] })
        .createComponent(BadgeHarnessHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.badge.set(99);
      fixture.componentInstance.dot.set(true);
      fixture.componentInstance.position.set('bottom-end');
      fixture.componentInstance.badgeStyle.set({ '--custom-badge': '1' });
      fixture.detectChanges();

      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('M) Positioning runtime behavior (optional)', () => {
    it('repositions badge metrics when the anchor host resizes (ResizeObserver path)', () => {
      globalWithResizeObserver.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      const badge = getBadge(host);
      const hostRect: MutableRectSize = { width: 120, height: 32 };
      const badgeRect: MutableRectSize = { width: 18, height: 18 };
      mockElementRect(host, hostRect);
      mockElementRect(badge, badgeRect);

      const observer = MockResizeObserver.instances.at(-1);
      if (observer === undefined) {
        throw new Error('Expected ResizeObserver instance.');
      }

      hostRect.width = 240;
      hostRect.height = 56;
      observer.trigger(host);

      expect(badge.style.getPropertyValue('--tng-badge-anchor-width')).toBe('240px');
      expect(badge.style.getPropertyValue('--tng-badge-anchor-height')).toBe('56px');
    });

    it('repositions badge metrics when the badge element resizes (ResizeObserver path)', () => {
      globalWithResizeObserver.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      const badge = getBadge(host);
      const hostRect: MutableRectSize = { width: 100, height: 30 };
      const badgeRect: MutableRectSize = { width: 16, height: 16 };
      mockElementRect(host, hostRect);
      mockElementRect(badge, badgeRect);

      const observer = MockResizeObserver.instances.at(-1);
      if (observer === undefined) {
        throw new Error('Expected ResizeObserver instance.');
      }

      badgeRect.width = 28;
      badgeRect.height = 24;
      observer.trigger(badge);

      expect(badge.style.getPropertyValue('--tng-badge-self-width')).toBe('28px');
      expect(badge.style.getPropertyValue('--tng-badge-self-height')).toBe('24px');
    });

    it('repositions badge metrics on window resize when ResizeObserver is unavailable', () => {
      globalWithResizeObserver.ResizeObserver = undefined;

      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      const badge = getBadge(host);
      const hostRect: MutableRectSize = { width: 110, height: 26 };
      const badgeRect: MutableRectSize = { width: 14, height: 14 };
      mockElementRect(host, hostRect);
      mockElementRect(badge, badgeRect);

      hostRect.width = 188;
      hostRect.height = 44;
      window.dispatchEvent(new Event('resize'));

      expect(badge.style.getPropertyValue('--tng-badge-anchor-width')).toBe('188px');
      expect(badge.style.getPropertyValue('--tng-badge-anchor-height')).toBe('44px');
    });

    it('disconnects runtime observers and stops repositioning after destroy', () => {
      globalWithResizeObserver.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

      const fixture = TestBed.configureTestingModule({ imports: [MinimalBadgeHostComponent] })
        .createComponent(MinimalBadgeHostComponent);
      fixture.detectChanges();

      const host = getByTestId<HTMLElement>(fixture, 'host');
      const badge = getBadge(host);
      const hostRect: MutableRectSize = { width: 128, height: 30 };
      const badgeRect: MutableRectSize = { width: 17, height: 17 };
      mockElementRect(host, hostRect);
      mockElementRect(badge, badgeRect);

      const observer = MockResizeObserver.instances.at(-1);
      if (observer === undefined) {
        throw new Error('Expected ResizeObserver instance.');
      }

      observer.trigger(host);
      const beforeDestroyWidth = badge.style.getPropertyValue('--tng-badge-anchor-width');
      expect(beforeDestroyWidth).toBe('128px');

      fixture.destroy();
      expect(observer.disconnect).toHaveBeenCalledTimes(1);

      hostRect.width = 222;
      observer.trigger(host);
      expect(badge.style.getPropertyValue('--tng-badge-anchor-width')).toBe('128px');
    });
  });
});
