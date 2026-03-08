import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngBadgeComponent } from '../tng-badge.component';

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

function getBadge(host: HTMLElement): HTMLSpanElement {
  const badge = host.querySelector('.tng-badge');
  if (!(badge instanceof HTMLSpanElement)) {
    throw new Error('Expected generated .tng-badge element.');
  }

  return badge;
}

@Component({
  standalone: true,
  imports: [TngBadgeComponent],
  template: `
    <button
      type="button"
      data-testid="host"
      [tngBadge]="value()"
      [tngBadgeTone]="tone()"
      [tngBadgeSize]="size()"
      [tngBadgeVariant]="variant()"
      [tngBadgeDisabled]="disabled()"
    >
      Inbox
    </button>
  `,
})
class BadgeWrapperHostComponent {
  public readonly value = signal<number | string | null | undefined>(8);
  public readonly tone = signal<'danger' | 'success'>('danger');
  public readonly size = signal<'md' | 'lg'>('md');
  public readonly variant = signal<'solid' | 'outline'>('solid');
  public readonly disabled = signal(false);
}

describe('tng-badge component wrapper', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngBadgeComponent symbol', () => {
    expect(typeof TngBadgeComponent).toBe('function');
  });

  it('forwards primitive badge behavior on [tngBadge] hosts', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'host');
    const badge = getBadge(host);

    expect(host.classList.contains('tng-badge-host')).toBe(true);
    expect(badge.textContent).toBe('8');
    expect(badge.getAttribute('data-tone')).toBe('danger');
    expect(badge.getAttribute('data-size')).toBe('md');
    expect(badge.getAttribute('data-variant')).toBe('solid');
    expect(badge.hasAttribute('data-disabled')).toBe(false);
  });

  it('updates generated badge state when wrapper host bindings change', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BadgeWrapperHostComponent] }).createComponent(
      BadgeWrapperHostComponent,
    );
    fixture.detectChanges();

    fixture.componentInstance.value.set('NEW');
    fixture.componentInstance.tone.set('success');
    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.variant.set('outline');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const badge = getBadge(getByTestId<HTMLElement>(fixture, 'host'));
    expect(badge.textContent).toBe('NEW');
    expect(badge.getAttribute('data-tone')).toBe('success');
    expect(badge.getAttribute('data-size')).toBe('lg');
    expect(badge.getAttribute('data-variant')).toBe('outline');
    expect(badge.hasAttribute('data-disabled')).toBe(true);
  });
});
