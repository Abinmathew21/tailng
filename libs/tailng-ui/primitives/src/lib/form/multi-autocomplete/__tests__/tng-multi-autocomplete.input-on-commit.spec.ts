// tng-multi-autocomplete.input-on-commit.spec.ts
// Tests for "what happens to input text on commit" (multi + tagging)

import { Component, ViewChild, signal, computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import {
  TngMultiAutocompleteContent,
  TngMultiAutocompleteTrigger,
} from '../tng-multi-autocomplete.parts';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import {
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '../tng-multi-autocomplete.listbox';

function keydown(
  el: HTMLElement,
  init: Partial<KeyboardEventInit> & { key: string }
): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
}

function inputValue(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function focus(el: HTMLElement): void {
  el.focus();
}

function pointerdown(el: HTMLElement | null, init: Partial<PointerEventInit> = {}): void {
  expect(el, 'pointerdown target was null').toBeTruthy();
  (el as HTMLElement).dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

function findOptionInBody(testId: string): HTMLElement | null {
  return document.body.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
}

async function openMultiAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  trigger.focus();
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <div
      tngMultiAutocomplete
      #api="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-autocomplete"
    >
      <input
        tngMultiAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="open() ? api.query() : ''"
      />

      <div tngMultiAutocompleteContent data-testid="content">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox [multiple]="true" data-testid="listbox">
            <li tngMultiAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngMultiAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngMultiAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiAutocomplete<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <div
      tngMultiAutocomplete
      #api="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="onValueChange($event)"
      [allowCreate]="true"
      [strict]="false"
      (create)="onCreate($event)"
      data-testid="multi-autocomplete"
    >
      <input
        tngMultiAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="open() ? api.query() : ''"
      />

      <div tngMultiAutocompleteContent data-testid="content">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox [multiple]="true" data-testid="listbox">
            @for (opt of filteredOptions(); track opt) {
              <li tngMultiAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">
                {{ opt.toUpperCase() }}
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class TaggingHostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiAutocomplete<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
  createCalls: { query: string }[] = [];

  readonly filteredOptions = computed(() => {
    const api = this.api;
    const q = (api ? api.query() : '').toLowerCase();
    if (!q) return ['a', 'b', 'c'];
    return ['a', 'b', 'c'].filter((opt) => opt.startsWith(q));
  });

  onValueChange(v: readonly string[]): void {
    this.value.set(v);
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
    const arr = [...this.value()];
    if (!arr.includes(ev.query)) {
      arr.push(ev.query);
      this.value.set(arr);
    }
  }
}

/** Empty listbox – always no active option, so Enter emits create.
 * Uses host-managed query (like single autocomplete EmptyListboxHostComponent) so inputValue
 * is preserved: [value] and (input) keep the input in sync regardless of primitive's query. */
@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <div
      tngMultiAutocomplete
      #api="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      [allowCreate]="true"
      [strict]="false"
      (create)="onCreate($event)"
      data-testid="multi-autocomplete"
    >
      <input
        tngMultiAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="query()"
        (input)="onInput($event)"
      />

      <div tngMultiAutocompleteContent data-testid="content">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox [multiple]="true" data-testid="listbox">
            <!-- No options – always no active, Enter emits create -->
          </ul>
        </div>
      </div>
    </div>
  `,
})
class EmptyListboxTaggingHostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiAutocomplete<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
  query = signal('');
  createCalls: { query: string }[] = [];

  onInput(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
    const arr = [...this.value()];
    if (!arr.includes(ev.query)) {
      arr.push(ev.query);
      this.value.set(arr);
    }
    this.query.set(''); // Clear input after create (host-managed query; primitive clears api.query on close)
  }
}

describe('tng-multi-autocomplete input-on-commit', () => {
  describe('Multi Autocomplete (tagging behavior)', () => {
    describe('Typed text appears in input when overlay is open', () => {
      it('inputValue updates query and [value] binding displays typed text in input', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openMultiAutocomplete(fixture, trigger);
        inputValue(trigger, 'i');
        fixture.detectChanges();
        inputValue(trigger, 'in');
        fixture.detectChanges();
        inputValue(trigger, 'ind');
        fixture.detectChanges();

        expect(trigger.value).toBe('ind');
        expect(host.api.query()).toBe('ind');
      });
    });

    describe('Enter on active option adds it and clears input', () => {
      it('after Enter commit, selectedValues includes option; input becomes empty; overlay stays open', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;
        const content = fixture.nativeElement.querySelector(
          '[data-testid="content"]'
        ) as HTMLElement;

        await openMultiAutocomplete(fixture, trigger);
        inputValue(trigger, 'b');
        fixture.detectChanges();

        keydown(trigger, { key: 'ArrowDown' });
        fixture.detectChanges();
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();

        expect(host.value()).toEqual(['b']);
        expect(host.api.query()).toBe('');
        expect(trigger.value).toBe('');
        expect(host.open()).toBe(true);
        expect(content.hasAttribute('hidden')).toBe(false);
      });
    });

    describe('Click on option adds it and clears input', () => {
      it('click option → value includes it; input becomes empty; overlay stays open', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;
        const content = fixture.nativeElement.querySelector(
          '[data-testid="content"]'
        ) as HTMLElement;

        await openMultiAutocomplete(fixture, trigger);
        inputValue(trigger, 'c');
        fixture.detectChanges();

        const optC = findOptionInBody('opt-c');
        pointerdown(optC);
        fixture.detectChanges();

        expect(host.value()).toEqual(['c']);
        expect(host.api.query()).toBe('');
        expect(trigger.value).toBe('');
        expect(host.open()).toBe(true);
        expect(content.hasAttribute('hidden')).toBe(false);
      });
    });

    describe('Enter with no active option (free-form create) adds typed text and clears input', () => {
      it('allowCreate=true, strict=false: Enter with empty listbox emits create; consumer adds; input clears on close', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [EmptyListboxTaggingHostComponent],
        }).createComponent(EmptyListboxTaggingHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        inputValue(trigger, 'tag1');
        fixture.detectChanges();
        focus(trigger);
        fixture.detectChanges();
        keydown(trigger, { key: 'ArrowDown' });
        fixture.detectChanges();
        await Promise.resolve();
        fixture.detectChanges();

        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        await Promise.resolve();
        fixture.detectChanges();

        expect(host.createCalls).toHaveLength(1);
        expect(host.createCalls[0]).toEqual({ query: 'tag1' });
        expect(host.value()).toContain('tag1');
        expect(host.open()).toBe(false);
        expect(host.api.query()).toBe('');
        expect(trigger.value).toBe('');
      });
    });

    describe('Prevent duplicates', () => {
      it('select "a" twice via Enter → second Enter toggles off (array empty)', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openMultiAutocomplete(fixture, trigger);
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toEqual(['a']);

        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toEqual([]);
      });

      it('select "a", ArrowDown to b Enter, ArrowUp to a Enter → value is [b] (toggle a off)', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openMultiAutocomplete(fixture, trigger);
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toEqual(['a']);

        keydown(trigger, { key: 'ArrowDown' });
        fixture.detectChanges();
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toEqual(['a', 'b']);

        keydown(trigger, { key: 'ArrowUp' });
        fixture.detectChanges();
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toEqual(['b']);
      });
    });

    describe('Remove API updates value and does not affect input text', () => {
      it('toggleValue to remove item: value updates, input stays empty', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [HostComponent],
        }).createComponent(HostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        host.value.set(['a', 'b']);
        fixture.detectChanges();

        host.api.toggleValue('a');
        fixture.detectChanges();

        expect(host.value()).toEqual(['b']);
        expect(host.api.query()).toBe('');
        expect(trigger.value).toBe('');
      });
    });
  });

  describe('Accessibility + correctness', () => {
    it('aria-activedescendant present while overlay open (multi stays open after commit)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openMultiAutocomplete(fixture, trigger);
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();

        expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
      });

    it('when overlay closes, aria-activedescendant clears', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openMultiAutocomplete(fixture, trigger);
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('Space key inserts into input (does NOT select)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openMultiAutocomplete(fixture, trigger);
      keydown(trigger, { key: ' ' });
      inputValue(trigger, ' ');
      fixture.detectChanges();

      expect(host.value()).toEqual([]);
      expect(host.open()).toBe(true);
      expect(host.api.query()).toBe(' ');
    });
  });

  describe('Backspace on empty input', () => {
    it.todo('Backspace on empty input removes last selected chip (if UX planned)');
  });
});
