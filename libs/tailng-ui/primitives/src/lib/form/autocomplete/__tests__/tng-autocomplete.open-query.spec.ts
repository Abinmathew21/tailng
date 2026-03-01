// libs/tailng-ui/primitives/src/lib/form/autocomplete/__tests__/tng-autocomplete.open-query.spec.ts
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
      [disabled]="disabled()"
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
  readonly disabled = signal(false);

  // track queryChange calls
  readonly queries: string[] = [];

  onQueryChange(q: string) {
    this.queries.push(q);
  }
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
        value="Prefilled"
      />

      <div tngAutocompleteContent>
        <div tngAutocompleteOverlay>
          <ul tngAutocompleteListbox data-testid="listbox">
            <li tngAutocompleteOption [tngValue]="'Apple'">Apple</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
class PrefilledHostComponent {
  readonly open = signal(false);
  readonly value = signal<string | null>(null);
  readonly queries: string[] = [];
  onQueryChange(q: string) {
    this.queries.push(q);
  }
}

describe('tng-autocomplete open/query behavior', () => {
  // ------------------------------------------------------------
  // A) Focus → open behavior
  // ------------------------------------------------------------

  it('focus opens when closed and enabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    expect(host.open()).toBe(false);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
  });

  it('focus does NOT open when disabled=true', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.disabled.set(true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('focus does NOT re-open if already open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    // open first
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    const calls = host.queries.length;

    // focus again while already open
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    // (queryChange rules tested below; here we just ensure no close/flip)
    expect(host.queries.length).toBeGreaterThanOrEqual(calls);
  });

  // ------------------------------------------------------------
  // B) Focus → queryChange contract
  // ------------------------------------------------------------

  it('focus opens and emits queryChange with empty string', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

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

  it('focus opens and emits queryChange with current input value (prefilled)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PrefilledHostComponent],
    }).createComponent(PrefilledHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    expect(host.open()).toBe(false);
    expect(host.queries.length).toBe(0);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.queries.length).toBe(1);
    expect(host.queries[0]).toBe('Prefilled');
  });

  it('focus emits queryChange exactly once per open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.queries.length).toBe(1);

    // focus again while still open -> should not emit "open query" again
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.queries.length).toBe(1);
  });

  // ------------------------------------------------------------
  // C) Input typing → queryChange contract
  // ------------------------------------------------------------

  it('typing emits queryChange for each input event', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // first call from open: ''
    expect(host.queries).toEqual(['']);

    inputText(trigger, 'a');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries).toEqual(['', 'a', 'ap']);
  });

  it('typing updates query and emits queryChange', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

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

  // ------------------------------------------------------------
  // D) Regression / interaction sanity
  // ------------------------------------------------------------

  it('query changes do NOT clear selection', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [OpenQueryHostComponent],
    }).createComponent(OpenQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

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
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

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