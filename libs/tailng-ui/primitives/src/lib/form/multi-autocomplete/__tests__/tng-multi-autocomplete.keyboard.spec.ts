// libs/tailng-ui/primitives/src/lib/form/multi-autocomplete/__tests__/tng-multi-autocomplete.keyboard.spec.ts
import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TNG_MULTI_AUTOCOMPLETE_LISTBOX } from '../tng-multi-autocomplete.listbox.tokens';
import type { TngMultiAutocompleteListboxApi } from '../tng-multi-autocomplete.listbox.types';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
}

function keydown(el: HTMLElement, key: string, init?: Partial<KeyboardEventInit>) {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(ev);
  return ev;
}

function setInputValue(el: HTMLInputElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

describe('tng-multi-autocomplete keyboard', () => {
  let listbox: TngMultiAutocompleteListboxApi<string>;

  @Component({
    standalone: true,
    imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
    template: `
      <section
        tngMultiAutocomplete
        #m="tngMultiAutocomplete"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
      >
        <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />
      </section>
    `,
  })
  class HostComponent {
    readonly open = signal(false);
    readonly value = signal<readonly string[]>([]);
  }

  @Component({
    standalone: true,
    imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
    template: `
      <section
        tngMultiAutocomplete
        #m="tngMultiAutocomplete"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
      >
        <input
          tngMultiAutocompleteTrigger
          data-testid="trigger"
          type="text"
          autocomplete="off"
        />
      </section>
    `,
  })
  class MultiKeyboardHostComponent {
    readonly open = signal(false);
    readonly value = signal<readonly string[]>([]);
    readonly multiRef = viewChild<TngMultiAutocomplete<string>>('m');
  }

  beforeEach(() => {
    listbox = {
      getHostId: () => 'lb',
      getActiveId: vi.fn(() => null),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };
  });

  function setup() {
    const listbox: TngMultiAutocompleteListboxApi = {
      getHostId: () => null,
      getActiveId: vi.fn(() => null),
      ensureActive: vi.fn(),
      handleKey: vi.fn(() => true),
      commitActive: vi.fn(),
    };
  
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: TNG_MULTI_AUTOCOMPLETE_LISTBOX, useValue: listbox }],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLInputElement;
  
    return { fixture, host, trigger, listbox };
  }

  it('focus opens and ensuresActive(first)', async () => {
    const { fixture, host, trigger, listbox } = setup();

    expect(host.open()).toBe(false);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(listbox.ensureActive).toHaveBeenCalledWith('first');
  });

  it('ArrowDown when closed opens and ensuresActive(first)', async () => {
    const { fixture, host, trigger, listbox } = setup();

    expect(host.open()).toBe(false);

    const ev = keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(true);
    expect(host.open()).toBe(true);
    expect(listbox.ensureActive).toHaveBeenCalledWith('first');
  });

  it('ArrowUp when closed opens and ensuresActive(last)', async () => {
    const { fixture, host, trigger, listbox } = setup();

    expect(host.open()).toBe(false);

    const ev = keydown(trigger, 'ArrowUp');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(true);
    expect(host.open()).toBe(true);
    expect(listbox.ensureActive).toHaveBeenCalledWith('last');
  });

  it('ArrowDown when open delegates to listbox.handleKey', async () => {
    const { fixture, host, trigger, listbox } = setup();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    const ev = keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(listbox.handleKey).toHaveBeenCalledWith('ArrowDown', false);
    expect(ev.defaultPrevented).toBe(true);
  });

  it('Home/End when open delegate to listbox.handleKey', async () => {
    const { fixture, trigger, listbox } = setup();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    keydown(trigger, 'Home');
    keydown(trigger, 'End');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(listbox.handleKey).toHaveBeenCalledWith('Home', false);
    expect(listbox.handleKey).toHaveBeenCalledWith('End', false);
  });

  it('Enter when open calls commitActive and stays open', async () => {
    const { fixture, host, trigger, listbox } = setup();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    const ev = keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(true);
    expect(listbox.commitActive).toHaveBeenCalled();
    expect(host.open()).toBe(true);
  });

  it('Escape closes when open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiKeyboardHostComponent],
    }).createComponent(MultiKeyboardHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.open.set(true);
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    keydown(trigger, 'Escape');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('Escape does NOT clear selection', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiKeyboardHostComponent],
    }).createComponent(MultiKeyboardHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.value.set(['Banana']);
    host.open.set(true);
    fixture.detectChanges();

    keydown(trigger, 'Escape');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(host.value()).toEqual(['Banana']);
  });

  it('Escape does NOT clear query', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiKeyboardHostComponent],
    }).createComponent(MultiKeyboardHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

    host.open.set(true);
    fixture.detectChanges();

    // Set internal query directly (source of truth for filtering)
    host.multiRef()?.query.set('Prefilled');
    fixture.detectChanges();

    keydown(trigger, 'Escape');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(host.multiRef()?.query()).toBe('Prefilled');
  });

  it('typing does not preventDefault (input remains editable)', async () => {
    const { fixture, trigger } = setup();

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const ev = keydown(trigger, 'a');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(false);
  });

  it('Backspace with text does not removeLast', async () => {
    const { fixture, host, trigger } = setup();

    host.value.set(['A', 'B', 'C']);
    fixture.detectChanges();

    setInputValue(trigger, 'x');
    fixture.detectChanges();

    const ev = keydown(trigger, 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(false);
    expect(host.value()).toEqual(['A', 'B', 'C']);
  });

  it('Backspace when input empty removes last chip and prevents default', async () => {
    const { fixture, host, trigger } = setup();

    host.value.set(['A', 'B', 'C']);
    fixture.detectChanges();

    setInputValue(trigger, '');
    fixture.detectChanges();

    const ev = keydown(trigger, 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(ev.defaultPrevented).toBe(true);
    expect(host.value()).toEqual(['A', 'B']);
  });

  it('Home when closed does NOT delegate to listbox.handleKey', async () => {
    const { fixture, trigger, listbox } = setup();
  
    // closed
    expect(fixture.componentInstance.open()).toBe(false);
  
    // Home should be caret behavior when closed (no listbox delegation)
    keydown(trigger, 'Home');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.handleKey).not.toHaveBeenCalled();
  });
  
  it('End when closed does NOT delegate to listbox.handleKey', async () => {
    const { fixture, trigger, listbox } = setup();
  
    expect(fixture.componentInstance.open()).toBe(false);
  
    keydown(trigger, 'End');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.handleKey).not.toHaveBeenCalled();
  });
  
  it('Home when open delegates to listbox.handleKey (priority over chip focus)', async () => {
    const { fixture, trigger, listbox } = setup();
  
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // open -> listbox navigation
    keydown(trigger, 'Home');
    keydown(trigger, 'End');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.handleKey).toHaveBeenCalledTimes(2);
    expect(listbox.handleKey).toHaveBeenCalledWith('Home', false);
    expect(listbox.handleKey).toHaveBeenCalledWith('End', false);
  });
  
  it('Enter when closed does nothing (no commitActive)', async () => {
    const { fixture, trigger, listbox } = setup();
  
    expect(fixture.componentInstance.open()).toBe(false);
  
    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.commitActive).not.toHaveBeenCalled();
  });
  
  it('Escape when closed does not preventDefault and does not change open', async () => {
    const { fixture, trigger } = setup();
  
    expect(fixture.componentInstance.open()).toBe(false);
  
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const preventSpy = vi.spyOn(ev, 'preventDefault');
    trigger.dispatchEvent(ev);
  
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(fixture.componentInstance.open()).toBe(false);
    expect(preventSpy).not.toHaveBeenCalled();
  });

  it('Home at caret-start prioritizes chip boundary over listbox navigation (when closed)', async () => {
    const { fixture, host, trigger, listbox } = setup();
  
    // Focus opens overlay in your implementation → close it back for this test
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // caret at start
    trigger.value = 'x';
    trigger.setSelectionRange(0, 0);
    fixture.detectChanges();
  
    keydown(trigger, 'Home');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    // listbox must NOT receive Home when closed (chip boundary case)
    expect(listbox.handleKey).not.toHaveBeenCalled();
  });

  it('Home when open delegates to listbox.handleKey (even if caret-start)', async () => {
    const { fixture, trigger, listbox } = setup();
  
    focus(trigger); // opens
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    trigger.value = 'x';
    trigger.setSelectionRange(0, 0);
    fixture.detectChanges();
  
    keydown(trigger, 'Home');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.handleKey).toHaveBeenCalledWith('Home', false);
  });

  it('Enter when closed does nothing (no commitActive)', async () => {
    const { fixture, trigger, listbox } = setup();
  
    expect(fixture.componentInstance.open()).toBe(false);
  
    keydown(trigger, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.commitActive).not.toHaveBeenCalled();
  });
  
  it('Home/End when open delegate to listbox.handleKey', async () => {
    const { fixture, trigger, listbox } = setup();
  
    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    keydown(trigger, 'Home');
    keydown(trigger, 'End');
  
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  
    expect(listbox.handleKey).toHaveBeenCalledWith('Home', false);
    expect(listbox.handleKey).toHaveBeenCalledWith('End', false);
  });
});