// tng-autocomplete.input-on-commit.spec.ts
// Tests for "what happens to input text on commit" (single + strict/free-form)

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
  el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
}

function inputValue(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function focus(el: HTMLElement): void {
  el.focus();
}

function pointerdown(el: HTMLElement | null): void {
  expect(el, 'pointerdown target was null').toBeTruthy();
  (el as HTMLElement).dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })
  );
}

function pointerdownElsewhere(): void {
  document.body.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })
  );
}

function findOptionInBody(testId: string): HTMLElement | null {
  return document.body.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
}

const LABEL_MAP: Record<string, string> = { a: 'A', b: 'B', c: 'C' };
function getLabel(value: string | null): string {
  return value === null ? '' : LABEL_MAP[value] ?? value;
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
      (openChange)="onOpenChange($event)"
      [value]="value()"
      (valueChange)="onValueChange($event)"
      [strict]="strict()"
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
            (valueChange)="onValueChange($event)"
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
class StrictHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  strict = signal(true);

  readonly displayText = computed(() => (this.open() ? this.query() : getLabel(this.value())));

  onInput(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  onValueChange(v: string | readonly string[] | null): void {
    const single = v === null ? null : Array.isArray(v) ? (v[0] ?? null) : v;
    this.value.set(single);
    this.query.set(getLabel(single));
  }

  onOpenChange(open: boolean): void {
    this.open.set(open);
    if (this.strict() && !open) {
      this.query.set(getLabel(this.value()));
    }
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
      (valueChange)="onValueChange($event)"
      [allowCreate]="true"
      [strict]="false"
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
            data-testid="listbox"
          >
            @for (opt of filteredOptions(); track opt) {
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">
                {{ opt.toUpperCase() }}
              </li>
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

  onValueChange(v: string | readonly string[] | null): void {
    const single = v === null ? null : Array.isArray(v) ? (v[0] ?? null) : v;
    this.value.set(single);
    this.query.set(single ?? '');
  }

  onCreate(ev: { query: string }): void {
    this.createCalls.push(ev);
    this.value.set(ev.query);
    this.query.set(ev.query);
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

describe('tng-autocomplete input-on-commit', () => {
  describe('Single Autocomplete (default = strict)', () => {
    describe('Enter commits → input shows selected label', () => {
      it('type query, ArrowDown to option, Enter → value updates, overlay closes, input value becomes getOptionLabel(selected)', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [StrictHostComponent],
        }).createComponent(StrictHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openAutocomplete(fixture, trigger);
        inputValue(trigger, 'b');
        fixture.detectChanges();

        keydown(trigger, { key: 'ArrowDown' });
        fixture.detectChanges();
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();

        expect(host.value()).toBe('b');
        expect(host.open()).toBe(false);
        expect(trigger.value).toBe('B');
      });

      it('click option → value updates, overlay closes, input shows selected label', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [StrictHostComponent],
        }).createComponent(StrictHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openAutocomplete(fixture, trigger);
        const optB = findOptionInBody('opt-b');
        pointerdown(optB);
        fixture.detectChanges();

        expect(host.value()).toBe('b');
        expect(host.open()).toBe(false);
        expect(trigger.value).toBe('B');
      });
    });

    describe('Reopen after selection → input still shows selected label', () => {
      it('after commit + close, focus/open again → input value remains label (not query)', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [StrictHostComponent],
        }).createComponent(StrictHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openAutocomplete(fixture, trigger);
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toBe('a');
        expect(trigger.value).toBe('A');

        await openAutocomplete(fixture, trigger);
        fixture.detectChanges();
        expect(trigger.value).toBe('A');
      });
    });

    describe('Typing after selection does NOT clear selection', () => {
      it('after selection, type "x" → value remains selected until new commit/unselect', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [StrictHostComponent],
        }).createComponent(StrictHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openAutocomplete(fixture, trigger);
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
        expect(host.value()).toBe('a');

        inputValue(trigger, 'x');
        fixture.detectChanges();
        expect(host.value()).toBe('a');
        expect(host.query()).toBe('x');
      });
    });

    describe('Escape closes without changing input', () => {
      it('while open, type some text, Escape → overlay closes; strict mode resets input to empty', async () => {
        const fixture = TestBed.configureTestingModule({
          imports: [StrictHostComponent],
        }).createComponent(StrictHostComponent);

        fixture.detectChanges();
        const host = fixture.componentInstance;
        const trigger = fixture.nativeElement.querySelector(
          '[data-testid="trigger"]'
        ) as HTMLInputElement;

        await openAutocomplete(fixture, trigger);
        inputValue(trigger, 'xyz');
        fixture.detectChanges();
        expect(trigger.value).toBe('xyz');

        keydown(trigger, { key: 'Escape' });
        fixture.detectChanges();

        expect(host.open()).toBe(false);
        expect(host.value()).toBeNull();
        // Strict mode: close without commit resets input to empty (same as blur)
        expect(trigger.value).toBe('');
      });
    });
  });

  describe('Single Autocomplete (strict blur behavior)', () => {
    it('strict mode: blur without commit resets input to selected label', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.value.set('b');
      host.query.set('B');
      fixture.detectChanges();

      focus(trigger);
      fixture.detectChanges();
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      inputValue(trigger, 'Bx');
      fixture.detectChanges();
      expect(trigger.value).toBe('Bx');

      pointerdownElsewhere();
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(trigger.value).toBe('B');
    });

    it('strict mode: blur with no selection resets input to empty', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      inputValue(trigger, 'abc');
      fixture.detectChanges();
      expect(host.value()).toBeNull();
      expect(trigger.value).toBe('abc');

      pointerdownElsewhere();
      fixture.detectChanges();

      expect(host.value()).toBeNull();
      expect(trigger.value).toBe('');
    });
  });

  describe('Single Autocomplete (free-form create mode)', () => {
    it('Enter with no active option emits create + input shows committed text', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

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
      expect(host.value()).toBe('newval');
      expect(trigger.value).toBe('newval');
    });

    it('Enter when an option is active → commits option, does NOT emit create', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.filteredOptions()).toContain('a');

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.createCalls).toHaveLength(0);
      expect(host.open()).toBe(false);
    });

    it('Create closes overlay and prevents immediate reopen-on-focus restore', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FreeFormHostComponent],
      }).createComponent(FreeFormHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      focus(trigger);
      inputValue(trigger, 'z');
      fixture.detectChanges();
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('Options array changes after selection', () => {
    it.todo(
      'If selected option still exists: input stays correct label. If removed: decide behavior and test'
    );
  });

  describe('Input text reflects selection label after commit', () => {
    it('switching selection replaces input text: select A, then select B → input becomes label(B)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      expect(host.value()).toBe('a');
      expect(trigger.value).toBe('A');

      await openAutocomplete(fixture, trigger);
      const optB = findOptionInBody('opt-b');
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(trigger.value).toBe('B');
    });
  });

  describe('Accessibility + correctness', () => {
    it('after commit, aria-activedescendant clears when closed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('after commit, reopen highlights selected option (aria-selected="true")', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.value.set('b');
      fixture.detectChanges();

      await openAutocomplete(fixture, trigger);

      const optB = findOptionInBody('opt-b');
      expect(optB?.getAttribute('aria-selected')).toBe('true');
    });

    it('Space key inserts into input (does NOT select)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [StrictHostComponent],
      }).createComponent(StrictHostComponent);

      fixture.detectChanges();
      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: ' ' });
      inputValue(trigger, ' ');
      fixture.detectChanges();

      expect(host.value()).toBeNull();
      expect(host.open()).toBe(true);
      expect(host.query()).toBe(' ');
    });
  });
});
