import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
} from '../index';

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
}

function inputText(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function optionTexts(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll('[data-testid^="opt-"]'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean);
}

@Component({
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
      [query]="query()"
      (queryChange)="query.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input
        tngAutocompleteTrigger
        [value]="query()"
        [attr.data-testid]="'trigger'"
        type="text"
        autocomplete="off"
      />

      <div tngAutocompleteContent [attr.data-testid]="'content'">
        <div tngAutocompleteOverlay [attr.data-testid]="'overlay'">
          <ul tngAutocompleteListbox [value]="value()">
            @for (country of filteredCountries(); track country) {
              <li
                tngAutocompleteOption
                [tngValue]="country"
                [attr.data-testid]="'opt-' + country.toLowerCase()"
              >
                {{ country }}
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
})
class AutocompleteEscapeReopenHostComponent {
  readonly countries = signal<readonly string[]>([
    'Canada',
    'Cameroon',
    'Chile',
    'Japan',
  ]);

  readonly open = signal(false);
  readonly query = signal('');
  readonly value = signal<string | null>(null);

  readonly filteredCountries = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.countries();
    }

    return this.countries().filter((country) =>
      country.toLowerCase().includes(normalizedQuery),
    );
  });
}

describe('tng-autocomplete Escape reopen flow', () => {
  it('reopens the overlay after Escape when Backspace reduces the query', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AutocompleteEscapeReopenHostComponent],
    }).createComponent(AutocompleteEscapeReopenHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const content = root.querySelector('[data-testid="content"]') as HTMLElement;
    const overlay = root.querySelector('[data-testid="overlay"]') as HTMLElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'ca');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(host.query()).toBe('ca');
    expect(optionTexts(document.body)).toEqual(['Canada', 'Cameroon']);

    keydown(trigger, 'Escape');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);

    keydown(trigger, 'Backspace');
    inputText(trigger, 'c');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.query()).toBe('c');
    expect(trigger.value).toBe('c');
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(overlay.parentNode).toBe(document.body);
    expect(optionTexts(document.body)).toEqual(['Canada', 'Cameroon', 'Chile']);
  });
});
