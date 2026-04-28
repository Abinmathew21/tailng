import { Component, ViewChild, computed, signal } from '@angular/core';
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

function inputValue(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

async function flush(fixture: { detectChanges: () => void }): Promise<void> {
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
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
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="onValueChange($event)"
      data-testid="autocomplete"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        [value]="displayText()"
        (input)="onInput($event)"
        data-testid="trigger"
      />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class ProgrammaticPrimitiveHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;

  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');

  readonly displayText = computed(() => (this.open() ? this.query() : this.value() ?? ''));

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onValueChange(value: string | readonly string[] | null): void {
    const single = value === null ? null : Array.isArray(value) ? (value[0] ?? null) : value;

    this.value.set(single);
    this.query.set(single ?? '');
  }
}

describe('tng-autocomplete.programmatic-selection', () => {
  describe('external value updates', () => {
    it('updates primitive value when host signal value changes programmatically', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ProgrammaticPrimitiveHostComponent],
      }).createComponent(ProgrammaticPrimitiveHostComponent);

      await flush(fixture);

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      expect(host.api.value()).toBeNull();
      expect(trigger.value).toBe('');

      host.value.set('b');
      await flush(fixture);

      expect(host.api.value()).toBe('b');
      expect(trigger.value).toBe('b');
    });

    it('updates displayed input text when host value changes programmatically while overlay is closed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ProgrammaticPrimitiveHostComponent],
      }).createComponent(ProgrammaticPrimitiveHostComponent);

      await flush(fixture);

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      expect(host.open()).toBe(false);
      expect(host.api.value()).toBeNull();
      expect(trigger.value).toBe('');

      host.value.set('a');
      await flush(fixture);

      expect(host.open()).toBe(false);
      expect(host.api.value()).toBe('a');
      expect(trigger.value).toBe('a');

      host.value.set('c');
      await flush(fixture);

      expect(host.open()).toBe(false);
      expect(host.api.value()).toBe('c');
      expect(trigger.value).toBe('c');
    });

    it('clears primitive value and displayed text when host signal is set to null', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ProgrammaticPrimitiveHostComponent],
      }).createComponent(ProgrammaticPrimitiveHostComponent);

      await flush(fixture);

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      host.value.set('c');
      await flush(fixture);

      expect(host.api.value()).toBe('c');
      expect(trigger.value).toBe('c');

      host.value.set(null);
      await flush(fixture);

      expect(host.api.value()).toBeNull();
      expect(trigger.value).toBe('');
    });
  });

  describe('typing protection', () => {
    it('does not overwrite query while user is typing and value has not changed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ProgrammaticPrimitiveHostComponent],
      }).createComponent(ProgrammaticPrimitiveHostComponent);

      await flush(fixture);

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      host.value.set('b');
      await flush(fixture);

      trigger.focus();
      await flush(fixture);

      inputValue(trigger, 'custom query');
      await flush(fixture);

      expect(host.open()).toBe(true);
      expect(host.query()).toBe('custom query');
      expect(trigger.value).toBe('custom query');

      host.value.set('b');
      await flush(fixture);

      expect(host.query()).toBe('custom query');
      expect(trigger.value).toBe('custom query');
    });

    it('keeps the active query visible when external value changes while autocomplete is open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ProgrammaticPrimitiveHostComponent],
      }).createComponent(ProgrammaticPrimitiveHostComponent);

      await flush(fixture);

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]',
      ) as HTMLInputElement;

      trigger.focus();
      await flush(fixture);

      inputValue(trigger, 'query');
      await flush(fixture);

      expect(host.open()).toBe(true);
      expect(trigger.value).toBe('query');

      host.value.set('c');
      await flush(fixture);

      expect(host.api.value()).toBe('c');
      expect(host.query()).toBe('query');
      expect(trigger.value).toBe('query');
    });
  });
});
