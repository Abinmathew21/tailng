import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function dispatchFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus?.();
}

function dispatchCompositionStart(input: HTMLInputElement) {
  // CompositionEvent may not exist in some jsdom envs; Event is enough for HostListener wiring.
  input.dispatchEvent(new Event('compositionstart', { bubbles: true, cancelable: true }));
}

function dispatchCompositionUpdate(input: HTMLInputElement) {
  input.dispatchEvent(new Event('compositionupdate', { bubbles: true, cancelable: true }));
}

function dispatchCompositionEnd(input: HTMLInputElement) {
  input.dispatchEvent(new Event('compositionend', { bubbles: true, cancelable: true }));
}

function dispatchInput(input: HTMLInputElement) {
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

@Component({
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
  template: `
    <section
      tngMultiAutocomplete
      [open]="open()"
      (openChange)="open.set($event)"
      (queryChange)="queries.push($event)"
    >
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" type="text" />
    </section>
  `,
})
class ImeHostComponent {
  readonly open = signal(false);
  readonly queries: string[] = [];
}

describe('tng-multi-autocomplete IME composition (Policy A)', () => {
  it('during composition: input updates do NOT emit queryChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ImeHostComponent],
    }).createComponent(ImeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    dispatchFocus(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const baseline = host.queries.length; // open-on-focus emits (likely '')

    dispatchCompositionStart(input);
    fixture.detectChanges();

    // simulate intermediate IME text changes
    input.value = 'a';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    input.value = 'ab';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // Policy A: no emissions while composing
    expect(host.queries.length).toBe(baseline);
  });

  it('compositionend emits queryChange once with final value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ImeHostComponent],
    }).createComponent(ImeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    dispatchFocus(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const baseline = host.queries.length; // open-on-focus emit

    dispatchCompositionStart(input);
    fixture.detectChanges();

    // composing changes
    input.value = 'に';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    input.value = '日本';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // still no emit during composition
    expect(host.queries.length).toBe(baseline);

    // commit composition
    dispatchCompositionEnd(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // Policy A: exactly one emit with final committed value
    expect(host.queries.length).toBe(baseline + 1);
    expect(host.queries.at(-1)).toBe('日本');
  });

  it('compositionend followed by input should NOT double-emit the same value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ImeHostComponent],
    }).createComponent(ImeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    dispatchFocus(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const baseline = host.queries.length;

    dispatchCompositionStart(input);
    fixture.detectChanges();

    input.value = '한';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    input.value = '한국';
    dispatchCompositionUpdate(input);
    dispatchInput(input);

    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(baseline);

    // In real browsers: compositionend often happens, then an input event fires after.
    dispatchCompositionEnd(input);
    fixture.detectChanges();

    dispatchInput(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // We want ONE emission total for the committed value.
    // If your implementation chooses "emit on compositionend only", this must be 1.
    // If you choose "emit on the final input after compositionend", still must be 1.
    const newEmits = host.queries.slice(baseline);
    expect(newEmits).toEqual(['한국']);
  });
});