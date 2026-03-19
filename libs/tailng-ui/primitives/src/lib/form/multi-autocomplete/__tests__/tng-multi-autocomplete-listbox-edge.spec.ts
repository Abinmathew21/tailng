import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
  el.focus?.();
}

function inputText(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      #m="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      (queryChange)="queries.push($event)"
    >
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" type="text" />

      <ul tngMultiAutocompleteListbox [attr.data-testid]="'listbox'">
        <li tngMultiAutocompleteOption [tngValue]="'A'" [attr.data-testid]="'opt-a'">A</li>
        <li tngMultiAutocompleteOption [tngValue]="'B'" [attr.data-testid]="'opt-b'">B</li>
        <li tngMultiAutocompleteOption [tngValue]="'C'" [attr.data-testid]="'opt-c'">C</li>
      </ul>
    </section>
  `,
})
class ListboxEdgeHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
  readonly queries: string[] = [];
  readonly multi = viewChild<TngMultiAutocomplete<string>>('m');
}

describe('tng-multi-autocomplete listbox edge/polish', () => {
  it('valueChange clears query even when CLOSED (selection resets filtering state)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ListboxEdgeHostComponent],
    }).createComponent(ListboxEdgeHostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
  
    // ensure CLOSED
    host.open.set(false);
    fixture.detectChanges();
  
    // type while closed
    inputText(input, 'abc');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(host.multi()!.query()).toBe('abc');
  
    // simulate external selection update while closed
    host.value.set(['B']);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(host.value()).toEqual(['B']);
  
    // ✅ Standard behavior: selection resets query
    expect(host.multi()!.query()).toBe('');
  
    // and it emits exactly one empty queryChange
    expect(host.queries.at(-1)).toBe('');
  });

  it('external multi.value with duplicates is preserved (controlled input is not mutated)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ListboxEdgeHostComponent],
    }).createComponent(ListboxEdgeHostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    host.value.set(['A', 'A', 'B']);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // Controlled contract: we do NOT mutate/dedupe external value
    expect(host.value()).toEqual(['A', 'A', 'B']);
  });

  it('external multi.value sync preserves order (no reordering)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ListboxEdgeHostComponent],
    }).createComponent(ListboxEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    host.value.set(['C', 'A']);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['C', 'A']);
  });
});