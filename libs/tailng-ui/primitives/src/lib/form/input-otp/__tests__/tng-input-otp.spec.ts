import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  clampTngOtpValue,
  normalizeTngOtpLength,
  normalizeTngOtpValue,
  resolveTngOtpState,
  TngInputOtp,
} from '../tng-input-otp';

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
  imports: [TngInputOtp],
  template: `
    <div
      tngInputOtp
      data-testid="otp-root"
      [length]="length()"
      [value]="value()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [invalid]="invalid()"
      [focused]="focused()"
      [focusVisible]="focusVisible()"
      [activeIndex]="activeIndex()"
    ></div>
  `,
})
class InputOtpPrimitiveHostComponent {
  public readonly length = signal(6);
  public readonly value = signal('');
  public readonly disabled = signal(false);
  public readonly readonly = signal(false);
  public readonly required = signal(false);
  public readonly invalid = signal(false);
  public readonly focused = signal(false);
  public readonly focusVisible = signal(false);
  public readonly activeIndex = signal<number | null>(null);
}

describe('tng-input-otp primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the input-otp primitive', () => {
    expect(typeof TngInputOtp).toBe('function');
  });

  it('normalizes otp length into safe bounds', () => {
    expect(normalizeTngOtpLength(Number.NaN)).toBe(6);
    expect(normalizeTngOtpLength(0)).toBe(1);
    expect(normalizeTngOtpLength(20)).toBe(12);
  });

  it('normalizes and clamps otp values', () => {
    expect(normalizeTngOtpValue(null)).toBe('');
    expect(normalizeTngOtpValue('123abc')).toBe('123abc');
    expect(clampTngOtpValue('ABCDEFG', 4)).toBe('ABCD');
  });

  it('resolves empty, partial, and complete states', () => {
    expect(resolveTngOtpState(6, '')).toBe('empty');
    expect(resolveTngOtpState(6, '12')).toBe('partial');
    expect(resolveTngOtpState(6, '123456')).toBe('complete');
    expect(resolveTngOtpState(4, '123456')).toBe('complete');
  });

  it('renders group semantics with slot and empty state by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPrimitiveHostComponent],
    }).createComponent(InputOtpPrimitiveHostComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'otp-root');
    expect(root.getAttribute('data-slot')).toBe('input-otp');
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('data-empty')).toBe('');
    expect(root.getAttribute('data-partial')).toBeNull();
    expect(root.getAttribute('data-complete')).toBeNull();
  });

  it('switches state hooks as the combined value changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPrimitiveHostComponent],
    }).createComponent(InputOtpPrimitiveHostComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'otp-root');

    fixture.componentInstance.value.set('12');
    fixture.detectChanges();
    expect(root.getAttribute('data-empty')).toBeNull();
    expect(root.getAttribute('data-partial')).toBe('');
    expect(root.getAttribute('data-complete')).toBeNull();

    fixture.componentInstance.value.set('123456');
    fixture.detectChanges();
    expect(root.getAttribute('data-empty')).toBeNull();
    expect(root.getAttribute('data-partial')).toBeNull();
    expect(root.getAttribute('data-complete')).toBe('');
  });

  it('applies disabled/readonly/required/invalid/focus state hooks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPrimitiveHostComponent],
    }).createComponent(InputOtpPrimitiveHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.readonly.set(true);
    fixture.componentInstance.required.set(true);
    fixture.componentInstance.invalid.set(true);
    fixture.componentInstance.focused.set(true);
    fixture.componentInstance.focusVisible.set(true);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'otp-root');
    expect(root.getAttribute('data-disabled')).toBe('');
    expect(root.getAttribute('data-readonly')).toBe('');
    expect(root.getAttribute('data-required')).toBe('');
    expect(root.getAttribute('data-invalid')).toBe('');
    expect(root.getAttribute('data-focused')).toBe('');
    expect(root.getAttribute('data-focus-visible')).toBe('');
  });

  it('applies active index hook only for valid slot index values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPrimitiveHostComponent],
    }).createComponent(InputOtpPrimitiveHostComponent);
    fixture.detectChanges();

    const root = getByTestId<HTMLElement>(fixture, 'otp-root');
    expect(root.getAttribute('data-active')).toBeNull();

    fixture.componentInstance.activeIndex.set(2);
    fixture.detectChanges();
    expect(root.getAttribute('data-active')).toBe('2');

    fixture.componentInstance.activeIndex.set(9);
    fixture.detectChanges();
    expect(root.getAttribute('data-active')).toBeNull();
  });
});
