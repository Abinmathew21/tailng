import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  clampTngOtpValue,
  normalizeTngOtpLength,
  normalizeTngOtpValue,
  resolveTngOtpEntryIndex,
  resolveTngOtpBackspaceResult,
  resolveTngOtpState,
  TngInputOtp,
  TngInputOtpSlot,
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

@Component({
  imports: [TngInputOtp, TngInputOtpSlot],
  template: `
    <div
      tngInputOtp
      data-testid="headless-root"
      [length]="length()"
      [value]="value()"
      (valueChange)="value.set($event)"
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
    >
      @for (slot of slotIndexes(); track slot) {
        <input
          [tngInputOtpSlot]="slot"
          [attr.data-testid]="'slot-' + slot"
          maxlength="1"
          inputmode="numeric"
        />
      }
    </div>
  `,
})
class InputOtpHeadlessHostComponent {
  public readonly length = signal(4);
  public readonly value = signal('');
  public readonly activeIndex = signal<number | null>(null);

  protected readonly slotIndexes = computed(() =>
    Array.from({ length: this.length() }, (_, index) => index),
  );
}

@Component({
  imports: [TngInputOtp, TngInputOtpSlot],
  template: `
    <button type="button" data-testid="before">Before</button>
    <div
      tngInputOtp
      data-testid="tab-root"
      [length]="length()"
      [value]="value()"
      (valueChange)="value.set($event)"
      [activeIndex]="activeIndex()"
      (activeIndexChange)="activeIndex.set($event)"
    >
      @for (slot of slotIndexes(); track slot) {
        <input
          [tngInputOtpSlot]="slot"
          [attr.data-testid]="'tab-slot-' + slot"
          maxlength="1"
          inputmode="numeric"
        />
      }
    </div>
    <button type="button" data-testid="after">After</button>
  `,
})
class InputOtpTabEntryHostComponent {
  public readonly length = signal(6);
  public readonly value = signal('1234');
  public readonly activeIndex = signal<number | null>(null);

  protected readonly slotIndexes = computed(() =>
    Array.from({ length: this.length() }, (_, index) => index),
  );
}

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  target: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  source.dispatchEvent(event);
  source.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: target,
    }),
  );

  target.focus();
  target.dispatchEvent(
    new FocusEvent('focusin', {
      bubbles: true,
      relatedTarget: source,
    }),
  );

  return event;
}

function getCurrentTabbableOtpSlot(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
  const slot = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLInputElement>('[data-testid^="tab-slot-"]'),
  ).find((candidate) => candidate.tabIndex === 0);

  if (!slot) {
    throw new Error('Expected a tabbable OTP slot.');
  }

  return slot;
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

  it('resolves backspace updates for filled and empty slots', () => {
    expect(resolveTngOtpBackspaceResult('123', 2, 6)).toEqual({
      value: '12',
      focusIndex: 1,
    });
    expect(resolveTngOtpBackspaceResult('12', 2, 6)).toEqual({
      value: '1',
      focusIndex: 1,
    });
    expect(resolveTngOtpBackspaceResult('', 0, 6)).toBeNull();
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

  it('types one character, updates value, and moves focus to the next slot', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpHeadlessHostComponent],
    }).createComponent(InputOtpHeadlessHostComponent);
    fixture.detectChanges();

    const firstSlot = getByTestId<HTMLInputElement>(fixture, 'slot-0');
    const secondSlot = getByTestId<HTMLInputElement>(fixture, 'slot-1');

    firstSlot.focus();
    fixture.detectChanges();

    firstSlot.value = '1';
    firstSlot.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('1');
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(document.activeElement).toBe(secondSlot);
  });

  it('backspace on a filled slot clears it and moves focus backward', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpHeadlessHostComponent],
    }).createComponent(InputOtpHeadlessHostComponent);

    fixture.componentInstance.value.set('123');
    fixture.componentInstance.activeIndex.set(resolveTngOtpEntryIndex('123', 4));
    fixture.detectChanges();

    const thirdSlot = getByTestId<HTMLInputElement>(fixture, 'slot-2');
    const secondSlot = getByTestId<HTMLInputElement>(fixture, 'slot-1');

    thirdSlot.focus();
    fixture.detectChanges();

    thirdSlot.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Backspace' }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('12');
    expect(fixture.componentInstance.activeIndex()).toBe(1);
    expect(document.activeElement).toBe(secondSlot);
  });

  it('tabs into a partially filled otp at the next empty slot', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpTabEntryHostComponent],
    }).createComponent(InputOtpTabEntryHostComponent);
    fixture.detectChanges();

    const beforeButton = getByTestId<HTMLButtonElement>(fixture, 'before');
    const fifthSlot = getByTestId<HTMLInputElement>(fixture, 'tab-slot-4');

    for (let index = 0; index < 6; index += 1) {
      const slot = getByTestId<HTMLInputElement>(fixture, `tab-slot-${index}`);
      expect(slot.tabIndex).toBe(index === 4 ? 0 : -1);
    }

    beforeButton.focus();
    fixture.detectChanges();

    const tabEvent = dispatchTabAndSimulateBrowserFocus(beforeButton, fifthSlot);
    fixture.detectChanges();

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.activeIndex()).toBe(4);
    expect(document.activeElement).toBe(fifthSlot);
  });

  it('returns to the next empty slot after clicking an earlier slot, Shift+Tabbing out, and tabbing back in', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpTabEntryHostComponent],
    }).createComponent(InputOtpTabEntryHostComponent);

    fixture.componentInstance.value.set('246');
    fixture.detectChanges();

    const beforeButton = getByTestId<HTMLButtonElement>(fixture, 'before');
    const firstSlot = getByTestId<HTMLInputElement>(fixture, 'tab-slot-0');

    firstSlot.focus();
    firstSlot.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.activeIndex()).toBe(0);

    const shiftTabEvent = dispatchTabAndSimulateBrowserFocus(firstSlot, beforeButton, true);
    fixture.detectChanges();

    expect(shiftTabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(beforeButton);

    const tabbableSlot = getCurrentTabbableOtpSlot(fixture);
    const tabEvent = dispatchTabAndSimulateBrowserFocus(beforeButton, tabbableSlot);
    fixture.detectChanges();

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.activeIndex()).toBe(3);
    expect(document.activeElement).toBe(tabbableSlot);
    expect(tabbableSlot).toBe(getByTestId<HTMLInputElement>(fixture, 'tab-slot-3'));
  });
});
