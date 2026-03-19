import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';

function dispatchKeydown(el: HTMLElement, key: string, init: Partial<KeyboardEventInit> = {}) {
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init });
  el.dispatchEvent(e);
  return e;
}

function dispatchFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus?.();
}

@Component({
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section tngMultiAutocomplete #m="tngMultiAutocomplete" [value]="value()" (valueChange)="value.set($event)">
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="'chip-' + item"
        >
          {{ item }}
        </span>
      }
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'trigger'" type="text" />
    </section>
  `,
})
class TriggerEdgeHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
  readonly multiRef = viewChild<TngMultiAutocomplete<string>>('m');
}

describe('tng-multi-autocomplete trigger edge behavior', () => {
  it('ArrowLeft at caret-start does NOT focus chips when selection range exists (start=0,end>0)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerEdgeHostComponent],
    }).createComponent(TriggerEdgeHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;

    dispatchFocus(trigger);
    trigger.value = 'hello';
    trigger.setSelectionRange(0, 2); // selection range, not caret-only
    fixture.detectChanges();

    dispatchKeydown(trigger, 'ArrowLeft');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    // stays on input; should NOT jump to last chip
    expect(document.activeElement).toBe(trigger);
    expect(document.activeElement).not.toBe(chipC);
  });

  it('ArrowDown when closed opens and preventsDefault', async () => {
    const listbox: TngMultiAutocompleteListboxApi<string> = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [TriggerEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(TriggerEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(multi.open()).toBe(false);

    // keydown on a focused input
    dispatchFocus(trigger);
    fixture.detectChanges();

    // close again to isolate the ArrowDown open path
    multi.open.set(false);
    fixture.detectChanges();

    const e = dispatchKeydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(multi.open()).toBe(true);
    expect(e.defaultPrevented).toBe(true);
    expect(listbox.ensureActive).toHaveBeenCalledWith('first');
  });

  it('ArrowUp when closed opens and preventsDefault (ensureActive last)', async () => {
    const listbox: TngMultiAutocompleteListboxApi<string> = {
      getHostId: vi.fn(() => 'lb-1'),
      getActiveId: vi.fn(() => 'opt-1'),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };

    const fixture = TestBed.configureTestingModule({
      imports: [TriggerEdgeHostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(TriggerEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    expect(multi.open()).toBe(false);

    dispatchFocus(trigger);
    fixture.detectChanges();

    // close again to isolate ArrowUp open path
    multi.open.set(false);
    fixture.detectChanges();

    const e = dispatchKeydown(trigger, 'ArrowUp');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(multi.open()).toBe(true);
    expect(e.defaultPrevented).toBe(true);
    expect(listbox.ensureActive).toHaveBeenCalledWith('last');
  });

  it('When listbox provider is missing: ArrowDown still opens and does not throw', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerEdgeHostComponent],
    }).createComponent(TriggerEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    // ensure closed
    multi.open.set(false);
    fixture.detectChanges();

    dispatchFocus(trigger);
    fixture.detectChanges();

    const e = dispatchKeydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(multi.open()).toBe(true);
    expect(e.defaultPrevented).toBe(false);
  });

  it('Enter when open but listbox provider missing: does nothing and does not preventDefault', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerEdgeHostComponent],
    }).createComponent(TriggerEdgeHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multi = host.multiRef()!;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    dispatchFocus(trigger);
    fixture.detectChanges();

    // open
    multi.open.set(true);
    fixture.detectChanges();

    const e = dispatchKeydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(multi.open()).toBe(true);
    expect(e.defaultPrevented).toBe(false);
  });
});