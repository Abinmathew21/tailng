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
      #a="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      (queryChange)="onQueryChange($event)"
    >
      <input
        tngAutocompleteTrigger
        data-testid="trigger"
        type="text"
        autocomplete="off"
      />

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
class OpenQueryHostComponent {
  readonly open = signal(false);
  readonly value = signal<string | null>(null);

  // track queryChange calls
  readonly queries: string[] = [];

  onQueryChange(q: string) {
    this.queries.push(q);
  }
}

describe('tng-autocomplete open/query behavior', () => {
  it('focus opens and emits queryChange with empty string', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // precondition
    expect(host.open()).toBe(false);
    expect(host.queries.length).toBe(0);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    // ✅ key expectation: queryChange fired even when empty
    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('');
  });

  it('typing updates query and emits queryChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.at(-1)).toBe('ap');
  });

  it('query changes do NOT clear selection', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // select a value first
    host.value.set('Banana');
    fixture.detectChanges();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // user types
    inputText(trigger, 'ba');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // ✅ selection remains
    expect(host.value()).toBe('Banana');
  });

  it('ArrowDown then Enter commits active option and closes', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // move active, then commit
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