import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteChip,
} from '@tailng-ui/primitives';

import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
  el.focus?.();
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
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section
      tngMultiAutocomplete
      [disabled]="true"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      (queryChange)="onQuery($event)"
    >
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="'chip-' + item"
        >
          {{ item }}
        </span>
      }

      <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" />
    </section>
  `,
})
class DisabledHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>(['a', 'b']);
  readonly queries: string[] = [];
  onQuery(q: string) {
    this.queries.push(q);
  }
}

describe('tng-multi-autocomplete disabled behavior', () => {
  function setup() {
    const listbox: TngMultiAutocompleteListboxApi<string> = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [DisabledHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(DisabledHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    return { fixture, trigger, listbox };
  }

  it('focus does not open', async () => {
    const { fixture, trigger } = setup();
    const host = fixture.componentInstance;

    expect(host.open()).toBe(false);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('ArrowDown does not open', async () => {
    const { fixture, trigger } = setup();
    const host = fixture.componentInstance;

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('typing does not emit queryChange', async () => {
    const { fixture, trigger } = setup();
    const host = fixture.componentInstance;

    inputText(trigger, 'ap');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.queries.length).toBe(0);
  });

  it('Backspace does not remove last chip', async () => {
    const { fixture, trigger } = setup();
    const host = fixture.componentInstance;

    trigger.value = ''; // empty input
    keydown(trigger, 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'b']);
  });

  it('Enter does not commitActive', async () => {
    const { fixture, trigger, listbox } = setup();

    // even if you "open" by binding, disabled should keep behavior inert
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(listbox.commitActive).not.toHaveBeenCalled();
  });

  it('chip Delete does not remove', async () => {
    const { fixture } = setup();
    const host = fixture.componentInstance;

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    expect(chipB).toBeTruthy();

    keydown(chipB, 'Delete');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'b']);
  });
});