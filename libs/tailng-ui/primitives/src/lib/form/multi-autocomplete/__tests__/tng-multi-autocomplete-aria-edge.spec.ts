import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';

function dispatchFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus?.();
}

@Component({
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
  template: `
    <section tngMultiAutocomplete #m="tngMultiAutocomplete" [open]="open()" (openChange)="open.set($event)">
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" />
    </section>
  `,
})
class AriaEdgeHostComponent {
  readonly open = signal(false);
  readonly multiRef = viewChild<TngMultiAutocomplete<unknown>>('m');
}

describe('tng-multi-autocomplete ARIA edge behavior', () => {
  it('aria-controls prefers contentId when both contentId and listboxId exist', async () => {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    multi.setListboxId('lb-x');
    multi.setContentId('content-x');

    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBe('content-x');
  });

  it('aria-controls uses listboxId when contentId is null', async () => {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    multi.setContentId(null);
    multi.setListboxId('lb-only');

    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBe('lb-only');
  });

  it('aria-controls clears on close (becomes null)', async () => {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    multi.setListboxId('lb-only');

    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBe('lb-only');

    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBeNull();
  });

  it('aria-activedescendant falls back to cached activeId when listbox returns null', async () => {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => null),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // open and set cached active id
    multi.setActiveDescendantId('cached-active');
    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBe('cached-active');
  });

  it('aria-activedescendant updates when listbox active id changes while open', async () => {
    let active = 'opt-1';

    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      activeId: vi.fn(() => active),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBe('opt-1');

    active = 'opt-2';

    // Option A (imperative listbox API) isn't reactive.
    // Force a re-read by toggling open (signal) to re-run HostBindings.
    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    host.open.set(true);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-activedescendant')).toBe('opt-2');
  });

  it('focus opening still works with aria bindings present (sanity)', async () => {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [AriaEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(AriaEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(host.open()).toBe(false);

    dispatchFocus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
  });
});