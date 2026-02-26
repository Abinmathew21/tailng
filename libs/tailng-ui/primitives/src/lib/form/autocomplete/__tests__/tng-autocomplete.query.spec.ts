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

function pointerdownElsewhere(): void {
  document.body.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
  );
}

function pointerdown(el: HTMLElement | null): void {
  expect(el, 'pointerdown target was null').toBeTruthy();
  (el as HTMLElement).dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
  );
}

function findOptionInBody(testId: string): HTMLElement | null {
  return document.body.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
}

function findOverlay(): HTMLElement | null {
  return document.body.querySelector('[data-testid="overlay"]') as HTMLElement | null;
}

const LABEL_MAP: Record<string, string> = { a: 'A', b: 'B', c: 'C' };
function getLabel(value: string | null): string {
  return value === null ? '' : LABEL_MAP[value] ?? value;
}

@Component({
  standalone: true,
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
class QueryHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  queryChangeCalls: string[] = [];
  strict = true;

  readonly displayText = computed(() => {
    return this.open() ? this.query() : getLabel(this.value());
  });

  onInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.query.set(val);
    this.queryChangeCalls.push(val);
  }

  onValueChange(v: string | readonly string[] | null): void {
    const single = v === null ? null : Array.isArray(v) ? (v[0] ?? null) : v;
    this.value.set(single);
    this.query.set(getLabel(single));
  }

  onOpenChange(open: boolean): void {
    this.open.set(open);
    if (this.strict && !open) {
      this.query.set(getLabel(this.value()));
    }
  }
}

@Component({
  standalone: true,
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
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">{{ opt }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class FilteredQueryHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  query = signal('');
  strict = true;
  readonly allOptions = [
    'Australia',
    'Austria',
    'India',
    'Indonesia',
    'Italy',
    'United States',
    'United Kingdom',
  ];

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.allOptions;
    return this.allOptions.filter((o) => o.toLowerCase().includes(q));
  });

  readonly displayText = computed(() => {
    return this.open() ? this.query() : (this.value() ?? '');
  });

  onInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.query.set(val);
  }

  onValueChange(v: string | readonly string[] | null): void {
    const single = v === null ? null : Array.isArray(v) ? (v[0] ?? null) : v;
    this.value.set(single);
    this.query.set(single ?? '');
  }

  onOpenChange(open: boolean): void {
    this.open.set(open);
    if (this.strict && !open) {
      this.query.set(this.value() ?? '');
    }
  }
}

@Component({
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div>
      <input type="text" data-testid="prev" placeholder="Before" />
      <div
        tngAutocomplete
        #api="tngAutocomplete"
        [open]="open()"
        (openChange)="open.set($event)"
        [value]="value()"
        (valueChange)="value.set($event)"
        data-testid="autocomplete"
      >
        <input
          tngAutocompleteTrigger
          type="text"
          data-testid="trigger"
          [value]="value() ?? ''"
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
      <input type="text" data-testid="next" placeholder="After" />
    </div>
  `,
})
class TabFocusHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
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

describe('tng-autocomplete query (Autocomplete-specific)', () => {
  describe('typing updates query signal', () => {
    it('input events update query signal', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      expect(host.query()).toBe('');

      inputValue(trigger, 'x');
      fixture.detectChanges();
      expect(host.query()).toBe('x');

      inputValue(trigger, 'xy');
      fixture.detectChanges();
      expect(host.query()).toBe('xy');
    });
  });

  describe('emits queryChange', () => {
    it('queryChange callback invoked when typing', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      inputValue(trigger, 'a');
      fixture.detectChanges();
      expect(host.queryChangeCalls).toContain('a');

      inputValue(trigger, 'ab');
      fixture.detectChanges();
      expect(host.queryChangeCalls).toContain('ab');
    });
  });

  describe('typing does NOT clear selection', () => {
    it('value stays when user types after selection', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      expect(host.value()).toBe('a');

      inputValue(trigger, 'xyz');
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.query()).toBe('xyz');
    });
  });

  describe('after commit', () => {
    it('input displays selected label', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
      expect(trigger.value).toBe('A');
    });
  });

  describe('blur without commit (strict mode)', () => {
    it('input resets to selected label when blur without selecting', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

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

      inputValue(trigger, 'xyz');
      fixture.detectChanges();
      expect(trigger.value).toBe('xyz');

      pointerdownElsewhere();
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.query()).toBe('B');
      expect(trigger.value).toBe('B');
    });
  });

  describe('Space key inserts into input for filtering', () => {
    it('query "United St" (with space) filters to United States', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FilteredQueryHostComponent],
      }).createComponent(FilteredQueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      inputValue(trigger, 'United St');
      fixture.detectChanges();

      expect(host.query()).toBe('United St');
      expect(host.value()).toBe(null);

      const optUnitedStates = findOptionInBody('opt-United States');
      expect(optUnitedStates).toBeTruthy();
      expect(optUnitedStates?.textContent?.trim()).toBe('United States');
    });
  });

  describe('clearing query does NOT clear selection', () => {
    it('value stays when query is cleared', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      expect(host.value()).toBe('a');

      focus(trigger);
      fixture.detectChanges();
      inputValue(trigger, '');
      fixture.detectChanges();

      expect(host.query()).toBe('');
      expect(host.value()).toBe('a');
    });
  });

  describe('type, select, backspace clear, retype flow', () => {
    it('combines all steps: type 3 chars → select → clear without blur → retype and options visible', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      inputValue(trigger, 'a');
      fixture.detectChanges();
      inputValue(trigger, 'ab');
      fixture.detectChanges();
      inputValue(trigger, 'abc');
      fixture.detectChanges();

      const overlay1 = findOverlay();
      expect(overlay1).toBeTruthy();
      expect(overlay1?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();

      keydown(trigger, { key: 'ArrowDown' });
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      inputValue(trigger, '');
      fixture.detectChanges();

      expect(host.query()).toBe('');
      expect(host.value()).toBe('b');
      expect(trigger.value).toBe('');

      inputValue(trigger, 'xy');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.query()).toBe('xy');
      const overlay2 = findOverlay();
      expect(overlay2).toBeTruthy();
      expect(overlay2?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();
    });

    it('type 3 chars → close with Escape (no select) → filter other chars and options visible', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      inputValue(trigger, 'a');
      fixture.detectChanges();
      inputValue(trigger, 'ab');
      fixture.detectChanges();
      inputValue(trigger, 'abc');
      fixture.detectChanges();

      const overlay1 = findOverlay();
      expect(overlay1).toBeTruthy();
      expect(overlay1?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.value()).toBeNull();
      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      inputValue(trigger, 'xy');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.query()).toBe('xy');
      const overlay2 = findOverlay();
      expect(overlay2).toBeTruthy();
      expect(overlay2?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();
    });

    it('1. type 3 characters and select one item', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      inputValue(trigger, 'a');
      fixture.detectChanges();
      inputValue(trigger, 'ab');
      fixture.detectChanges();
      inputValue(trigger, 'abc');
      fixture.detectChanges();
      expect(host.query()).toBe('abc');

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.open()).toBe(false);
      expect(trigger.value).toBe('B');
    });

    it('typing a character when closed (selected value) opens overlay and appends to input', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
      expect(trigger.value).toBe('A');

      keydown(trigger, { key: 'x' });
      fixture.detectChanges();
      inputValue(trigger, 'Ax');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.query()).toBe('Ax');
      expect(trigger.value).toBe('Ax');
    });

    it('re-clicking same option (India) when filtered to Indi closes overlay', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FilteredQueryHostComponent],
      }).createComponent(FilteredQueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      inputValue(trigger, 'India');
      fixture.detectChanges();
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('India');
      expect(host.open()).toBe(false);

      keydown(trigger, { key: 'Backspace' });
      fixture.detectChanges();
      inputValue(trigger, 'Indi');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.value()).toBe('India');
      expect(host.query()).toBe('Indi');

      await Promise.resolve();
      await fixture.whenStable();
      fixture.detectChanges();

      const optIndia = findOptionInBody('opt-India');
      expect(optIndia, 'opt-India should be in overlay').toBeTruthy();
      pointerdown(optIndia);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(host.value()).toBe('India');
    });

    it('typing after backspacing (filtered options change) keeps value and overlay open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [FilteredQueryHostComponent],
      }).createComponent(FilteredQueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      inputValue(trigger, 'India');
      fixture.detectChanges();
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('India');
      expect(host.open()).toBe(false);

      keydown(trigger, { key: 'Backspace' });
      fixture.detectChanges();
      inputValue(trigger, 'Indi');
      fixture.detectChanges();

      keydown(trigger, { key: 'Backspace' });
      fixture.detectChanges();
      inputValue(trigger, 'Ind');
      fixture.detectChanges();

      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'o' });
      fixture.detectChanges();
      inputValue(trigger, 'Indo');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.value()).toBe('India');
      expect(host.query()).toBe('Indo');
      expect(trigger.value).toBe('Indo');
    });

    it('Backspace opens overlay when closed (selected value, focused)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
      expect(trigger.value).toBe('A');

      keydown(trigger, { key: 'Backspace' });
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBeNull();
    });

    it('2. without blurring, type backspace and remove all characters', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      inputValue(trigger, 'abc');
      fixture.detectChanges();
      keydown(trigger, { key: 'ArrowDown' });
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      inputValue(trigger, '');
      fixture.detectChanges();

      expect(host.query()).toBe('');
      expect(host.value()).toBe('b');
      expect(trigger.value).toBe('');
    });

    it('3. type some other characters and check options are visible', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [QueryHostComponent],
      }).createComponent(QueryHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      inputValue(trigger, 'abc');
      fixture.detectChanges();

      const overlayBeforeSelect = findOverlay();
      expect(overlayBeforeSelect).toBeTruthy();
      expect(overlayBeforeSelect?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      inputValue(trigger, '');
      fixture.detectChanges();

      inputValue(trigger, 'xy');
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(host.query()).toBe('xy');

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBeNull();

      const optA = findOptionInBody('opt-a');
      const optB = findOptionInBody('opt-b');
      const optC = findOptionInBody('opt-c');
      expect(optA).toBeTruthy();
      expect(optB).toBeTruthy();
      expect(optC).toBeTruthy();
    });
  });

  describe('Tab focus', () => {
    it('TAB focuses trigger → popup opens with all items; TAB moves focus to next element (without closing overlay first)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [TabFocusHostComponent],
      }).createComponent(TabFocusHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const prevInput = fixture.nativeElement.querySelector(
        '[data-testid="prev"]'
      ) as HTMLInputElement;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;
      const nextInput = fixture.nativeElement.querySelector(
        '[data-testid="next"]'
      ) as HTMLInputElement;

      focus(prevInput);
      fixture.detectChanges();

      keydown(prevInput, { key: 'Tab' });
      focus(trigger);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBeNull();
      expect(findOptionInBody('opt-a')).toBeTruthy();
      expect(findOptionInBody('opt-b')).toBeTruthy();
      expect(findOptionInBody('opt-c')).toBeTruthy();

      keydown(trigger, { key: 'Tab' });
      focus(nextInput);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(document.activeElement).toBe(nextInput);
      expect(host.open()).toBe(false);
    });
  });
});
