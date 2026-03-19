import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
  el.focus?.();
}

function pasteText(input: HTMLInputElement, value: string) {
  // jsdom does not implement ClipboardEvent
  input.dispatchEvent(new Event('paste', { bubbles: true, cancelable: true }));

  input.value = value;

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
class PasteHostComponent {
  readonly open = signal(false);
  readonly queries: string[] = [];
}

describe('tng-multi-autocomplete paste behavior', () => {
  it('pasting emits queryChange once with full pasted value', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PasteHostComponent],
    }).createComponent(PasteHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(input);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const baseline = host.queries.length; // open-on-focus emit

    pasteText(input, 'apple banana');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(baseline + 1);
    expect(host.queries.at(-1)).toBe('apple banana');
  });
});