import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteContent } from '../tng-multi-autocomplete.content';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

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
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      [open]="open()"
      (openChange)="open.set($event)"
      [query]="query()"
      (queryChange)="query.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input
        tngMultiAutocompleteTrigger
        [value]="query()"
        [attr.data-testid]="'trigger'"
        type="text"
        autocomplete="off"
      />

      <div tngMultiAutocompleteContent class="contents" [attr.data-testid]="'content'">
        <div tngMultiAutocompleteOverlay [attr.data-testid]="'overlay'">
          <ul tngMultiAutocompleteListbox>
            @for (country of filteredCountries(); track country) {
              <li
                tngMultiAutocompleteOption
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
class MultiAutocompleteEscapeReopenHostComponent {
  readonly countries = signal<readonly string[]>([
    'Canada',
    'Cameroon',
    'Chile',
    'Japan',
  ]);

  readonly open = signal(false);
  readonly query = signal('');
  readonly value = signal<readonly string[]>([]);

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

describe('tng-multi-autocomplete Escape reopen flow', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('reopens the overlay when input changes after Escape closed it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteEscapeReopenHostComponent],
    }).createComponent(MultiAutocompleteEscapeReopenHostComponent);

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
