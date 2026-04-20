import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';
import { TngMultiAutocompleteContent } from '../tng-multi-autocomplete.content';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
}

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
  );
}

function getOpenOverlay(): HTMLElement | null {
  return (
    Array.from(document.body.querySelectorAll('[data-slot="multi-autocomplete-overlay"]')).find(
      (overlay) => overlay.getAttribute('hidden') === null,
    ) ?? null
  ) as HTMLElement | null;
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      data-testid="multi"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      @for (chip of value(); track chip) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="chip"
          [attr.data-testid]="'chip-' + chip"
        >
          <span>{{ chip }}</span>
          <button
            type="button"
            [attr.data-testid]="'remove-' + chip"
            (click)="removed.set(chip)"
          >
            ×
          </button>
        </span>
      }

      <input
        tngMultiAutocompleteTrigger
        data-testid="trigger"
        type="text"
        autocomplete="off"
      />

      <div tngMultiAutocompleteContent>
        <div tngMultiAutocompleteOverlay>
          <ul tngMultiAutocompleteListbox>
            <li tngMultiAutocompleteOption [tngValue]="'ca'">Canada</li>
            <li tngMultiAutocompleteOption [tngValue]="'jp'">Japan</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
class ClickFocusHostComponent {
  readonly value = signal<readonly string[]>(['de']);
  readonly removed = signal<string | null>(null);
}

describe('tng-multi-autocomplete click-to-focus behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body
      .querySelectorAll('[data-slot="multi-autocomplete-overlay"]')
      .forEach((overlay) => overlay.remove());
  });

  it('clicking the host surface focuses the trigger and opens the overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ClickFocusHostComponent],
    }).createComponent(ClickFocusHostComponent);

    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[data-testid="multi"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    click(hostEl);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    expect(getOpenOverlay()).toBeTruthy();
  });

  it('clicking an interactive descendant does not steal its behavior for trigger focus', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ClickFocusHostComponent],
    }).createComponent(ClickFocusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const removeButton = fixture.nativeElement.querySelector('[data-testid="remove-de"]') as HTMLButtonElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    click(removeButton);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.removed()).toBe('de');
    expect(document.activeElement).not.toBe(trigger);
  });

  it('keeps focus on the trigger after pointer-selecting an option', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ClickFocusHostComponent],
    }).createComponent(ClickFocusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const listbox = document.body.querySelector(
      '[data-slot="multi-autocomplete-listbox"]',
    ) as HTMLElement;
    const listboxFocusSpy = vi.spyOn(listbox, 'focus');

    const canadaOption = document.body.querySelector('[data-slot="multi-autocomplete-option"]') as HTMLElement;
    pointerdown(canadaOption);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['de', 'ca']);
    expect(document.activeElement).toBe(trigger);
    expect(listboxFocusSpy).not.toHaveBeenCalled();
  });
});
