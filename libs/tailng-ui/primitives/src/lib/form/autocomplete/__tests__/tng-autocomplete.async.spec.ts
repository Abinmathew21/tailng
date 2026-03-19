import { Component, ViewChild, signal } from '@angular/core';
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

function keydown(
  el: HTMLElement,
  init: Partial<KeyboardEventInit> & { key: string }
): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
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
      [loading]="loading()"
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
            @for (opt of options(); track $index) {
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">{{ opt }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class AsyncHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  loading = signal(false);
  options = signal<string[]>(['a', 'b', 'c']);
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
      [loading]="loading()"
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
            @for (opt of options(); track $index) {
              <li tngAutocompleteOption [tngValue]="opt" [attr.data-testid]="'opt-' + opt">{{ opt }}</li>
            }
            @if (options().length === 0) {
              <li data-testid="empty-message" class="empty">No results</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
})
class EmptyStateHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  loading = signal(false);
  options = signal<string[]>([]);
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  focus(trigger);
  fixture.detectChanges();
  keydown(trigger, { key: 'ArrowDown' });
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete async (remote filtering)', () => {
  describe('loading state reflects data-loading', () => {
    it('data-loading attribute set when loading=true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AsyncHostComponent],
      }).createComponent(AsyncHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const el = fixture.nativeElement.querySelector(
        '[data-testid="autocomplete"]'
      ) as HTMLElement;

      expect(el.getAttribute('data-loading')).toBeNull();

      host.loading.set(true);
      fixture.detectChanges();
      expect(el.getAttribute('data-loading')).toBe('');
    });
  });

  describe('keyboard during loading', () => {
    it('keyboard works during loading (ArrowDown opens, Enter commits)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AsyncHostComponent],
      }).createComponent(AsyncHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.loading.set(true);
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
    });
  });

  describe('options update while open', () => {
    it('does not crash when options change while open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AsyncHostComponent],
      }).createComponent(AsyncHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      host.options.set(['x', 'y', 'z']);
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('active option re-ensured after options change', () => {
    it('has valid activeDescendant after options swap', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AsyncHostComponent],
      }).createComponent(AsyncHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

      host.options.set(['x', 'y', 'z']);
      fixture.detectChanges();

      const activeId = trigger.getAttribute('aria-activedescendant');
      if (activeId) {
        const activeEl = document.getElementById(activeId);
        expect(activeEl, `aria-activedescendant "${activeId}" must point to existing element`).toBeTruthy();
      }
    });
  });

  describe('empty state', () => {
    it('empty state renders properly without crashing', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [EmptyStateHostComponent],
      }).createComponent(EmptyStateHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      const emptyMsg = document.body.querySelector('[data-testid="empty-message"]');
      expect(emptyMsg).toBeTruthy();
      expect(emptyMsg?.textContent?.trim()).toBe('No results');
    });
  });

  describe('no stale activeDescendant after options removed', () => {
    it('aria-activedescendant does not reference removed option', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [AsyncHostComponent],
      }).createComponent(AsyncHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      const initialActiveId = trigger.getAttribute('aria-activedescendant');
      expect(initialActiveId).toBeTruthy();

      host.options.set(['b', 'c']);
      fixture.detectChanges();

      const activeId = trigger.getAttribute('aria-activedescendant');
      if (activeId) {
        const activeEl = document.getElementById(activeId);
        expect(activeEl).toBeTruthy();
      }
    });
  });
});
