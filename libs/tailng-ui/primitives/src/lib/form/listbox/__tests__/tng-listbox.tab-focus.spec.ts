import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngListboxDirective } from '../listbox.directive';
import { TngOptionDirective } from '../option.directive';

@Component({
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <div class="stack">
      <div
        tngListbox
        [multiple]="false"
        [value]="valueA()"
        (valueChange)="valueA.set($event)"
        tabindex="0"
        data-testid="lb-a"
      >
        <div tngOption [tngValue]="'a1'" data-testid="opt-a1">A1</div>
        <div tngOption [tngValue]="'a2'" data-testid="opt-a2">A2</div>
        <div tngOption [tngValue]="'a3'" data-testid="opt-a3">A3</div>
      </div>

      <div
        tngListbox
        [multiple]="false"
        [value]="valueB()"
        (valueChange)="valueB.set($event)"
        tabindex="0"
        data-testid="lb-b"
      >
        <div tngOption [tngValue]="'b1'" data-testid="opt-b1">B1</div>
        <div tngOption [tngValue]="'b2'" data-testid="opt-b2">B2</div>
        <div tngOption [tngValue]="'b3'" data-testid="opt-b3">B3</div>
      </div>
    </div>
  `,
})
class HostTwoListboxesTabFocusComponent {
  valueA = signal<string | null>(null);
  valueB = signal<string | null>(null);
}

function keydown(
  el: HTMLElement,
  key: string,
  opts: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...opts,
  });
  el.dispatchEvent(event);
  return event;
}

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
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

describe('tng-listbox tab focus handoff', () => {
  it('clears active state in the first listbox when Tab moves focus to the second listbox', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostTwoListboxesTabFocusComponent],
    }).createComponent(HostTwoListboxesTabFocusComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    const listboxA = fixture.nativeElement.querySelector('[data-testid="lb-a"]') as HTMLElement;
    const listboxB = fixture.nativeElement.querySelector('[data-testid="lb-b"]') as HTMLElement;
    const optionA2 = fixture.nativeElement.querySelector('[data-testid="opt-a2"]') as HTMLElement;

    listboxA.focus();
    listboxA.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    keydown(listboxA, 'ArrowDown');
    fixture.detectChanges();

    keydown(listboxA, 'Enter');
    fixture.detectChanges();

    expect(hostCmp.valueA()).toBe('a2');
    expect(listboxA.getAttribute('aria-activedescendant')).toBe(optionA2.id);
    expect(optionA2.hasAttribute('data-active')).toBe(true);

    const tabEvent = dispatchTabAndSimulateBrowserFocus(listboxA, listboxB);
    fixture.detectChanges();

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(listboxB);
    expect(listboxA.getAttribute('aria-activedescendant')).toBeNull();
    expect(optionA2.hasAttribute('data-active')).toBe(false);
  });

  it('moves active to the next option on ArrowDown after selecting an item by click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostTwoListboxesTabFocusComponent],
    }).createComponent(HostTwoListboxesTabFocusComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    const listboxA = fixture.nativeElement.querySelector('[data-testid="lb-a"]') as HTMLElement;
    const optionA1 = fixture.nativeElement.querySelector('[data-testid="opt-a1"]') as HTMLElement;
    const optionA2 = fixture.nativeElement.querySelector('[data-testid="opt-a2"]') as HTMLElement;

    pointerdown(optionA1, { button: 0 });
    fixture.detectChanges();

    expect(hostCmp.valueA()).toBe('a1');

    listboxA.focus();
    listboxA.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    keydown(listboxA, 'ArrowDown');
    fixture.detectChanges();

    expect(listboxA.getAttribute('aria-activedescendant')).toBe(optionA2.id);
    expect(optionA2.hasAttribute('data-active')).toBe(true);
  });

  it('moves keyboard focus to clicked listbox so next ArrowDown affects that listbox', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostTwoListboxesTabFocusComponent],
    }).createComponent(HostTwoListboxesTabFocusComponent);

    fixture.detectChanges();

    const listboxA = fixture.nativeElement.querySelector('[data-testid="lb-a"]') as HTMLElement;
    const listboxB = fixture.nativeElement.querySelector('[data-testid="lb-b"]') as HTMLElement;
    const optionA1 = fixture.nativeElement.querySelector('[data-testid="opt-a1"]') as HTMLElement;
    const optionA2 = fixture.nativeElement.querySelector('[data-testid="opt-a2"]') as HTMLElement;

    listboxB.focus();
    listboxB.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    pointerdown(optionA1, { button: 0 });
    fixture.detectChanges();

    const activeBeforeArrow = document.activeElement as HTMLElement | null;
    expect(activeBeforeArrow).toBe(listboxA);

    keydown(activeBeforeArrow!, 'ArrowDown');
    fixture.detectChanges();

    expect(listboxA.getAttribute('aria-activedescendant')).toBe(optionA2.id);
    expect(optionA2.hasAttribute('data-active')).toBe(true);
  });
});
