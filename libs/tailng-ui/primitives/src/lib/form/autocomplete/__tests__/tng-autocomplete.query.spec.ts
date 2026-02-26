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
});
