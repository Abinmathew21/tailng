import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteOverlay,
} from '@tailng-ui/primitives';

import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
  el.focus?.();
}

function blur(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('blur'));
  (el as any).blur?.();
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
  ],
  template: `
    <section
      tngMultiAutocomplete
      #m="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" />
      <div tngMultiAutocompleteContent>
        <div tngMultiAutocompleteOverlay>
          <div [attr.data-testid]="'overlay'">overlay</div>
        </div>
      </div>
    </section>
  `,
})
class AriaHostComponent {
  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly value = signal<readonly string[]>(['a']);
}

describe('tng-multi-autocomplete ARIA', () => {
  function setup(listboxOverrides?: Partial<TngMultiAutocompleteListboxApi<string>>) {
    const listbox: TngMultiAutocompleteListboxApi<string> = {
      getHostId: vi.fn(() => 'lb-1'),
      activeId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
      ...listboxOverrides,
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;

    return { fixture, trigger, listbox };
  }

  it('trigger has combobox role + haspopup=listbox', () => {
    const { trigger } = setup();

    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('aria-expanded reflects open state', async () => {
    const { fixture, trigger } = setup();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('aria-disabled reflects disabled', () => {
    const { fixture, trigger } = setup();

    const host = fixture.componentInstance;
    host.disabled.set(true);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-disabled')).toBe('true');

    host.disabled.set(false);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-disabled')).toBeNull();
  });

  it('aria-controls is null when closed, set when open', async () => {
    const { fixture, trigger } = setup();

    expect(trigger.getAttribute('aria-controls')).toBeNull();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
  });

  it('aria-activedescendant uses listbox active id when open', async () => {
    const { fixture, trigger } = setup({
      activeId: vi.fn(() => 'opt-active-123'),
    });

    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBe('opt-active-123');
  });

  it('aria-activedescendant clears when closed', async () => {
    const { fixture, trigger } = setup();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

    // close by toggling open input binding (simplest)
    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

    // (optional) blur should not re-open
    blur(trigger);
    fixture.detectChanges();
  });

  it('aria-activedescendant is null when closed, uses listbox id when open', async () => {
    const { fixture, trigger, listbox } = setup();
  
    expect(trigger.getAttribute('aria-activedescendant')).toBe(null);
  
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.activeId).toHaveBeenCalled();
    expect(trigger.getAttribute('aria-activedescendant')).toBe('opt-1');
  });

  it('aria-controls is set when open', async () => {
    const { fixture, trigger } = setup();
  
    expect(trigger.getAttribute('aria-controls')).toBe(null);
  
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // either contentId or listbox id depending on your current implementation
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
  });
});