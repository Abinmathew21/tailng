import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngSeparatorComponent } from '../tng-separator.component';

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

function getInnerSeparator(host: HTMLElement): HTMLElement {
  const separator = host.querySelector('.tng-separator');
  if (!(separator instanceof HTMLElement)) {
    throw new Error('Expected inner .tng-separator element.');
  }

  return separator;
}

@Component({
  standalone: true,
  imports: [TngSeparatorComponent],
  template: `
    <tng-separator
      #separatorRef
      data-testid="separator-host"
      [orientation]="orientation()"
      [decorative]="decorative()"
    ></tng-separator>
  `,
})
class SeparatorComponentHostComponent {
  public readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  public readonly decorative = signal(true);

  @ViewChild('separatorRef', { static: true })
  public separatorRef?: TngSeparatorComponent;
}

describe('tng-separator component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngSeparatorComponent symbol', () => {
    expect(typeof TngSeparatorComponent).toBe('function');
  });

  it('renders inner separator with default decorative horizontal semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorComponentHostComponent],
    }).createComponent(SeparatorComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'separator-host');
    const separator = getInnerSeparator(host);
    expect(separator.getAttribute('data-slot')).toBe('separator');
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
    expect(separator.getAttribute('aria-orientation')).toBeNull();
  });

  it('forwards orientation to vertical and keeps decorative behavior', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorComponentHostComponent],
    }).createComponent(SeparatorComponentHostComponent);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    const separator = getInnerSeparator(getByTestId<HTMLElement>(fixture, 'separator-host'));
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBeNull();
  });

  it('renders semantic separator when decorative=false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorComponentHostComponent],
    }).createComponent(SeparatorComponentHostComponent);
    fixture.componentInstance.decorative.set(false);
    fixture.detectChanges();

    const separator = getInnerSeparator(getByTestId<HTMLElement>(fixture, 'separator-host'));
    expect(separator.getAttribute('aria-hidden')).toBeNull();
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('updates forwarded inputs at runtime', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SeparatorComponentHostComponent],
    }).createComponent(SeparatorComponentHostComponent);
    fixture.detectChanges();

    const separator = getInnerSeparator(getByTestId<HTMLElement>(fixture, 'separator-host'));
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('data-orientation')).toBe('horizontal');

    fixture.componentInstance.decorative.set(false);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    expect(separator.getAttribute('aria-hidden')).toBeNull();
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    expect(separator.getAttribute('data-orientation')).toBe('vertical');
  });
});
