import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteContent,
  TngAutocompleteOverlay,
  TngAutocompleteListbox,
  TngAutocompleteOption,
} from '@tailng-ui/primitives';

import { TngListboxDirective } from '../../listbox/listbox.directive';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
}

function keydown(el: HTMLElement, key: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <section
      tngAutocomplete
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

      <div tngAutocompleteContent>
        <div tngAutocompleteOverlay>
          <ul tngAutocompleteListbox data-testid="listbox">
            <li tngAutocompleteOption [tngValue]="'Apple'" data-testid="opt-a">Apple</li>
            <li tngAutocompleteOption [tngValue]="'Banana'" data-testid="opt-b">Banana</li>
            <li tngAutocompleteOption [tngValue]="'Cherry'" data-testid="opt-c">Cherry</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
class BridgeHostComponent {
  readonly open = signal(false);
  readonly value = signal<string | null>(null);
}

describe('tng-autocomplete listbox bridge', () => {
  it('disables listbox typeahead (printable key does not jump active)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BridgeHostComponent],
    }).createComponent(BridgeHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const listboxEl = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;

    // open
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // establish an active option using ArrowDown
    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const activeBefore =
      (listboxEl.querySelector('[data-active]') as HTMLElement | null)?.getAttribute('data-testid') ??
      null;

    // printable key would normally invoke listbox typeahead ("b" -> Banana)
    keydown(listboxEl, 'b');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const activeAfter =
      (listboxEl.querySelector('[data-active]') as HTMLElement | null)?.getAttribute('data-testid') ??
      null;

    expect(activeAfter).toBe(activeBefore);
  });

  it('syncs external value into listbox selection when closed', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BridgeHostComponent],
    }).createComponent(BridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    // closed by default
    expect(host.open()).toBe(false);

    // external controlled set while closed
    host.value.set('Banana');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // option should reflect selected
    expect(optB.hasAttribute('data-selected')).toBe(true);
  });

  it('when open and listbox emits null, selection is preserved', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BridgeHostComponent],
    }).createComponent(BridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const listboxEl = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;

    // set an existing selection
    host.value.set('Banana');
    fixture.detectChanges();

    // open
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // get underlying listbox directive instance
    const listbox = fixture.debugElement
      .query((de) => de.nativeElement === listboxEl)
      .injector.get(TngListboxDirective<string>);

    // simulate "filtered out" => listbox value becomes null while open
    listbox.value.set(null);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.value()).toBe('Banana');
  });

  it('ArrowDown then Enter commits active option and closes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [BridgeHostComponent],
    }).createComponent(BridgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // open
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // move active and commit
    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).not.toBeNull();
    expect(host.open()).toBe(false);
  });
});