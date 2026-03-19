import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '@tailng-ui/primitives';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
}

function inputText(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function pointerDown(el: HTMLElement) {
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
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
      <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

      <ul tngMultiAutocompleteListbox data-testid="listbox">
        <li tngMultiAutocompleteOption [tngValue]="'Apple'" data-testid="opt-a">Apple</li>
        <li tngMultiAutocompleteOption [tngValue]="'Banana'" data-testid="opt-b">Banana</li>
        <li tngMultiAutocompleteOption [tngValue]="'Cherry'" data-testid="opt-c">Cherry</li>
      </ul>
    </section>
  `,
})
class MultiBridgeHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
  readonly multiRef = viewChild<TngMultiAutocomplete<string>>('m');
}

describe('tng-multi-autocomplete listbox bridge', () => {
  it('focus opens', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiBridgeHostComponent],
    }).createComponent(MultiBridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(host.open()).toBe(false);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
  });

  it('clicking an option updates selection array and keeps open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiBridgeHostComponent],
    }).createComponent(MultiBridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    pointerDown(optB);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['Banana']);
    expect(host.open()).toBe(true);
  });

  it('selecting clears query', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiBridgeHostComponent],
    }).createComponent(MultiBridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // type something first
    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const m = host.multiRef();
    expect(m).toBeTruthy();
    expect(m!.query()).toBe('ap');

    // select
    pointerDown(optA);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(m!.query()).toBe('');
  });

  it('clicking the same option again toggles it off (listbox multiple)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiBridgeHostComponent],
    }).createComponent(MultiBridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    pointerDown(optB);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(host.value()).toEqual(['Banana']);

    pointerDown(optB);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(host.value()).toEqual([]);
  });
});