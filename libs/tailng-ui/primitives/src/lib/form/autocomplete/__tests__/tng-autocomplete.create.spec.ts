import { Component, ViewChild, signal, computed } from '@angular/core';
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

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
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
      (valueChange)="value.set($event)"
      [allowCreate]="allowCreate()"
      [strict]="strict()"
      (create)="onCreate($event)"
      data-testid="autocomplete"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="displayText()"
        (input)="onInput($event)"
      />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="value.set($event)"
            data-testid="listbox"
          >
            @for (opt of filteredOptions(); track opt) {
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">{{ opt.toUpperCase() }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class FreeFormHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  allowCreate = signal(true);
  strict = signal(false);
  createCalls: { query: string }[] = [];

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return ['a', 'b', 'c'];
    return ['a', 'b', 'c'].filter((opt) => opt.startsWith(q));
  });

  readonly displayText = computed(() => (this.open() ? this.query() : (this.value() ?? '')));

  onInput(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
    this.value.set(ev.query);
  }
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
      (valueChange)="value.set($event)"
      [allowCreate]="true"
      [strict]="true"
      (create)="onCreate($event)"
      data-testid="autocomplete"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="displayText()"
        (input)="onInput($event)"
      />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="value.set($event)"
            data-testid="listbox"
          >
            @for (opt of filteredOptions(); track opt) {
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">{{ opt.toUpperCase() }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class StrictModeHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  createCalls: { query: string }[] = [];

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return ['a', 'b', 'c'];
    return ['a', 'b', 'c'].filter((opt) => opt.startsWith(q));
  });

  readonly displayText = computed(() => (this.open() ? this.query() : (this.value() ?? '')));

  onInput(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
  }
}

/** Empty listbox – always no active option. */
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
      (valueChange)="value.set($event)"
      [allowCreate]="true"
      [strict]="false"
      (create)="onCreate($event)"
      data-testid="autocomplete"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="query()"
        (input)="onInput($event)"
      />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="value.set($event)"
            data-testid="listbox"
          >
            <!-- No options – always no active -->
          </ul>
        </div>
      </div>
    </div>
  `,
})
class EmptyListboxHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  createCalls: { query: string }[] = [];

  onInput(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
    this.value.set(ev.query);
  }
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  focus(trigger);
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete.create (free-form mode)', () => {
  describe('Enter with no active option emits create event', () => {
    it('emits create when Enter with no options (filtered empty)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      focus(trigger);
      fixture.detectChanges();
      inputValue(trigger, 'z');
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.filteredOptions()).toHaveLength(0);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.createCalls).toHaveLength(1);
      expect(host.createCalls[0]).toEqual({ query: 'z' });
    });

    it('emits create when Enter with empty listbox', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [EmptyListboxHostComponent],
      }).createComponent(EmptyListboxHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      inputValue(trigger, 'new item');
      fixture.detectChanges();

      focus(trigger);
      fixture.detectChanges();
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.createCalls).toHaveLength(1);
      expect(host.createCalls[0]).toEqual({ query: 'new item' });
    });
  });

  describe('Created value becomes selection', () => {
    it('create emits query; consumer may set value in handler', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      focus(trigger);
      inputValue(trigger, 'newval');
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.filteredOptions()).toHaveLength(0);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.createCalls).toHaveLength(1);
      expect(host.createCalls[0]).toEqual({ query: 'newval' });
    });
  });

  describe('Space does NOT emit create (inserts into input for typing)', () => {
    it('Space with no active option inserts into input, does NOT emit create', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      inputValue(trigger, 'z');
      fixture.detectChanges();
      focus(trigger);
      fixture.detectChanges();
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);
      expect(host.api.getListboxApi()?.getActiveId()).toBeNull();

      keydown(trigger, { key: ' ' });
      fixture.detectChanges();

      // Space does NOT emit create (we allow it to pass through to input for typing)
      expect(host.createCalls).toHaveLength(0);
    });
  });

  describe('Strict mode blocks free-form create', () => {
    it('create is NOT emitted when strict=true', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictModeHostComponent],
      }).createComponent(StrictModeHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      focus(trigger);
      inputValue(trigger, 'x');
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.filteredOptions()).toHaveLength(0);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.createCalls).toHaveLength(0);
    });
  });

  describe('When active option exists → option commit wins over create', () => {
    it('Enter selects option, does NOT emit create', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      expect(host.filteredOptions()).toContain('a');
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.createCalls).toHaveLength(0);
      expect(host.open()).toBe(false);
    });
  });

  describe('Free-form commit closes overlay', () => {
    it('overlay closes when create is emitted', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      focus(trigger);
      inputValue(trigger, 'z');
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('Multi-select free-form (future)', () => {
    it.todo('Enter adds value to array');
    it.todo('Prevent duplicate values');
  });
});
