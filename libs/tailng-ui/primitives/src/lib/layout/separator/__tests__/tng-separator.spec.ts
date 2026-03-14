import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngSeparator } from '../tng-separator';

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
  imports: [TngSeparator],
  template: `
    <div
      tngSeparator
      #separatorRef="tngSeparator"
      data-testid="separator"
      [orientation]="orientation()"
      [decorative]="decorative()"
    ></div>
  `,
})
class SeparatorHostComponent {
  public readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  public readonly decorative = signal(true);

  @ViewChild('separatorRef', { static: true })
  public separatorRef?: TngSeparator;
}

describe('tng-separator primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngSeparator symbol', () => {
    expect(typeof TngSeparator).toBe('function');
  });

  it('supports exportAs=tngSeparator', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.separatorRef).toBeInstanceOf(TngSeparator);
  });

  it('renders horizontal decorative separator by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'separator');
    expect(separator.getAttribute('data-slot')).toBe('separator');
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
    expect(separator.getAttribute('aria-orientation')).toBeNull();
  });

  it('applies vertical orientation in decorative mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'separator');
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
  });

  it('renders semantic horizontal separator when decorative=false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.componentInstance.decorative.set(false);
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'separator');
    expect(separator.getAttribute('aria-hidden')).toBeNull();
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('renders semantic vertical separator with matching aria-orientation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.componentInstance.decorative.set(false);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'separator');
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
  });

  it('updates ARIA and orientation attributes when inputs change at runtime', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorHostComponent],
    }).createComponent(SeparatorHostComponent);
    fixture.detectChanges();

    const separator = getByTestId<HTMLElement>(fixture, 'separator');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');

    fixture.componentInstance.decorative.set(false);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    expect(separator.getAttribute('aria-hidden')).toBeNull();
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.getAttribute('data-orientation')).toBe('vertical');

    fixture.componentInstance.decorative.set(true);
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
    expect(separator.getAttribute('aria-orientation')).toBeNull();
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  });
});
