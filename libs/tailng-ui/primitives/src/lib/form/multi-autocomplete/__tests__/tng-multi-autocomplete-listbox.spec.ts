import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
}

function inputText(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function keydown(el: HTMLElement, key: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
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
    >
      <input
        tngMultiAutocompleteTrigger
        data-testid="trigger"
        type="text"
        autocomplete="off"
      />

      <ul tngMultiAutocompleteListbox data-testid="listbox">
        <li tngMultiAutocompleteOption [tngValue]="'Apple'" data-testid="opt-a">Apple</li>
        <li tngMultiAutocompleteOption [tngValue]="'Banana'" data-testid="opt-b">Banana</li>
        <li tngMultiAutocompleteOption [tngValue]="'Cherry'" data-testid="opt-c">Cherry</li>
      </ul>
    </section>
  `,
})
class MultiListboxHostComponent {
  readonly open = signal(true);
  readonly value = signal<readonly string[]>([]);
  // grab the primitive instance so we can inspect query/value if needed
  readonly multiRef = viewChild.required<TngMultiAutocomplete<string>>('m');
}

describe('tng-multi-autocomplete listbox bridge', () => {
  it('listbox selection updates multi.value (click)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiListboxHostComponent],
    }).createComponent(MultiListboxHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;

    // click is handled via option.directive pointerdown
    optA.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['Apple']);
  });

  it('commitActive toggles selection and clears query', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiListboxHostComponent],
    }).createComponent(MultiListboxHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // type a query
    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.multiRef().query()).toBe('ap');

    // move active and commit via listbox keyboard (through input delegation in later step)
    // For now, just focus listbox and use its built-in keydown to set active + selection
    const listbox = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;

    // focus listbox so it owns keydown for this test
    focus(listbox);
    fixture.detectChanges();

    keydown(listbox, 'Home'); // ensure first active
    fixture.detectChanges();

    keydown(listbox, 'Enter'); // listbox should select active, then bridge should clear query
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // selection changed
    expect(host.value().length).toBe(1);

    // query cleared by bridge after commit/selection change
    expect(host.multiRef().query()).toBe('');
  });

  it('external multi.value syncs into listbox selection UI', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiListboxHostComponent],
    }).createComponent(MultiListboxHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    // set external value
    host.value.set(['Banana', 'Cherry']);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // check option aria-selected driven by listbox selection
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    expect(optB.getAttribute('aria-selected')).toBe('true');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  });
});