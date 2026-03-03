import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import {
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '../tng-multi-autocomplete.listbox';

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
  el.focus?.();
}

function inputText(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function optionTexts(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('[data-testid^="opt-"]'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean);
}

function activeOptionText(root: HTMLElement): string | null {
  const active = root.querySelector('[data-testid^="opt-"][data-active]') as HTMLElement | null;
  return active?.textContent?.trim() ?? null;
}

function chipTexts(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('[data-testid^="chip-"]'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean);
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      [open]="open()"
      (openChange)="onOpenChange($event)"
      [query]="query()"
      (queryChange)="onQueryChange($event)"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    >
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="chipTestId(item)"
        >
          {{ item }}
        </span>
      }

      <input
        tngMultiAutocompleteTrigger
        [attr.data-testid]="'trigger'"
        type="text"
        autocomplete="off"
        [value]="query()"
      />

      <ul tngMultiAutocompleteListbox [attr.data-testid]="'listbox'">
        @for (country of filteredOptions(); track country) {
          <li
            tngMultiAutocompleteOption
            [tngValue]="country"
            [attr.data-testid]="'opt-' + country.toLowerCase()"
          >
            {{ country }}
          </li>
        }
        @if (filteredOptions().length === 0) {
          <li data-slot="multi-autocomplete-empty" [attr.data-testid]="'empty'">
            No matches
          </li>
        }
      </ul>
    </section>
  `,
})
class ControlledQueryHostComponent {
  readonly countries = signal<readonly string[]>(['India', 'Indonesia', 'Canada']);
  readonly open = signal(true);
  readonly query = signal('');
  readonly value = signal<readonly string[]>([]);

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase().trim();
    const all = this.countries();
    if (!q) return all;
    return all.filter((country) => country.toLowerCase().includes(q));
  });

  onOpenChange(open: boolean): void {
    this.open.set(open);
  }

  onQueryChange(query: string): void {
    this.query.set(query);
  }

  onValueChange(value: readonly string[]): void {
    this.value.set(value);
  }

  chipTestId(item: unknown): string {
    return typeof item === 'string'
      ? `chip-${item.toLowerCase()}`
      : 'chip-non-string';
  }
}

describe('tng-multi-autocomplete controlled query integration', () => {
  it('typing updates the controlled host query and keeps the typed text in the trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.query()).toBe('Ind');
    expect(trigger.value).toBe('Ind');
  });

  it('typing filters rendered options when query is controlled by the host', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;
    const root = fixture.nativeElement as HTMLElement;

    expect(optionTexts(root)).toEqual(['India', 'Indonesia', 'Canada']);

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['India', 'Indonesia']);
  });

  it('clicking a filtered option adds it to the controlled selected value list', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['India', 'Indonesia']);

    const india = root.querySelector('[data-testid="opt-india"]') as HTMLElement;
    india.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(host.query()).toBe('');
    expect(chipTexts(root)).toEqual(['India']);
  });

  it('pressing Enter on the active filtered option adds it to the controlled selected value list', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['India', 'Indonesia']);

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(host.query()).toBe('');
    expect(chipTexts(root)).toEqual(['India']);
  });

  it('pressing Enter after filtering selects the first filtered option when the previous active option no longer exists', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.open.set(false);
    host.countries.set(['Canada', 'India', 'Indonesia']);
    fixture.detectChanges();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['India', 'Indonesia']);

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(chipTexts(root)).toEqual(['India']);
  });

  it('typing a new query does not clear previously selected values when their option nodes are filtered out', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const india = root.querySelector('[data-testid="opt-india"]') as HTMLElement;
    india.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(chipTexts(root)).toEqual(['India']);

    inputText(trigger, 'Can');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(chipTexts(root)).toEqual(['India']);
  });

  it('a previously selected option is rendered as selected again when it re-enters the filtered list after backspace', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const indonesia = root.querySelector('[data-testid="opt-indonesia"]') as HTMLElement;
    indonesia.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['Indonesia']);

    inputText(trigger, 'Indi');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['India']);

    keydown(trigger, 'Backspace');
    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const indonesiaAgain = root.querySelector('[data-testid="opt-indonesia"]') as HTMLElement;

    expect(host.value()).toEqual(['Indonesia']);
    expect(indonesiaAgain.getAttribute('aria-selected')).toBe('true');
    expect(indonesiaAgain.hasAttribute('data-selected')).toBe(true);
  });

  it('pressing Enter while only the empty state is shown does not add anything to the selected value list', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    inputText(trigger, 'xxx');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual([]);

    const empty = root.querySelector('[data-testid="empty"]') as HTMLElement;
    expect(empty.textContent?.trim()).toBe('No matches');

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
    expect(chipTexts(root)).toEqual([]);
    expect(root.querySelector('[data-testid="empty"]')).toBeTruthy();
  });

  it('keeps existing selections while selecting a different filtered option via ArrowDown and Enter', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.countries.set(['India', 'Indonesia', 'Canada', 'Zimbabwe']);
    fixture.detectChanges();

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const india = root.querySelector('[data-testid="opt-india"]') as HTMLElement;
    india.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India']);
    expect(chipTexts(root)).toEqual(['India']);

    inputText(trigger, 'Z');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(optionTexts(root)).toEqual(['Zimbabwe']);

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['India', 'Zimbabwe']);
    expect(chipTexts(root)).toEqual(['India', 'Zimbabwe']);
  });

  it('ArrowDown moves through the first three selected countries in order without skipping the third one', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledQueryHostComponent],
    }).createComponent(ControlledQueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.countries.set(['Argentina', 'India', 'Spain', 'Zimbabwe', 'Canada']);
    fixture.detectChanges();

    inputText(trigger, 'Arg');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const argentina = root.querySelector('[data-testid="opt-argentina"]') as HTMLElement;
    argentina.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'Ind');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const india = root.querySelector('[data-testid="opt-india"]') as HTMLElement;
    india.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'Spa');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const spain = root.querySelector('[data-testid="opt-spain"]') as HTMLElement;
    spain.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
    );
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['Argentina', 'India', 'Spain']);
    expect(optionTexts(root).slice(0, 3)).toEqual(['Argentina', 'India', 'Spain']);

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(activeOptionText(root)).toBe('Argentina');

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(activeOptionText(root)).toBe('India');

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(activeOptionText(root)).toBe('Spain');
  });
});
