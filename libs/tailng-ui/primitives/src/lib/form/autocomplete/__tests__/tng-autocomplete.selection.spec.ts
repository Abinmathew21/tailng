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

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
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
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />

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
  `,
})
class PrimitiveHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

type Opt = Readonly<{ id: number; label: string }>;

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
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="optA" data-testid="opt-a">{{ optA.label }}</li>
            <li tngAutocompleteOption [tngValue]="optB" data-testid="opt-b">{{ optB.label }}</li>
            <li tngAutocompleteOption [tngValue]="optC" data-testid="opt-c">{{ optC.label }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class ObjectHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<Opt>;
  open = signal(false);
  value = signal<Opt | null>(null);
  readonly optA: Opt = { id: 1, label: 'Comfortable' };
  readonly optB: Opt = { id: 2, label: 'Compact' };
  readonly optC: Opt = { id: 3, label: 'Dense' };
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
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" [disabled]="optBDisabled()" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class DisabledOptionHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  optBDisabled = signal(true);
}

async function openAutocomplete(fixture: { detectChanges: () => void }, trigger: HTMLElement): Promise<void> {
  trigger.focus();
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

function findOptionInBody(testId: string): HTMLElement | null {
  return document.body.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
}

describe('tng-autocomplete.selection', () => {
  describe('selecting primitive value works', () => {
    it('selects via Enter and updates value + closes', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
    });

    it('selects via click on option', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      const optB = findOptionInBody('opt-b');
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.open()).toBe(false);
    });

    it('clicking already-selected option closes overlay (single mode)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);

      await openAutocomplete(fixture, trigger);
      const optA = findOptionInBody('opt-a');
      pointerdown(optA);
      fixture.detectChanges();

      expect(host.value()).toBe('a');
      expect(host.open()).toBe(false);
    });
  });

  describe('selecting object value works (reference equality)', () => {
    it('selects object option by reference', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [ObjectHostComponent],
      }).createComponent(ObjectHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      const optA = findOptionInBody('opt-a');
      pointerdown(optA);
      fixture.detectChanges();

      expect(host.api.value()).toBe(host.optA);
      expect(host.value()).toBe(host.optA);
    });
  });

  describe('reopen marks correct option', () => {
    it('aria-selected="true" and data-selected on selected option when reopened', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      host.value.set('b');
      fixture.detectChanges();

      await openAutocomplete(fixture, trigger);

      const optB = findOptionInBody('opt-b');
      expect(optB).toBeTruthy();
      expect(optB!.getAttribute('aria-selected')).toBe('true');
      expect(optB!.hasAttribute('data-selected')).toBe(true);
    });
  });

  describe('selecting same value twice does not duplicate', () => {
    it('value stays the same when selecting same option twice', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('a');
    });
  });

  describe('active option resets after close', () => {
    it('aria-activedescendant is null when closed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [PrimitiveHostComponent],
      }).createComponent(PrimitiveHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
    });
  });

  describe('disabled option cannot be selected', () => {
    it('click on disabled option does not update value', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DisabledOptionHostComponent],
      }).createComponent(DisabledOptionHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      const optB = findOptionInBody('opt-b');
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toBeNull();
      expect(host.open()).toBe(true);
    });

    it('Enter skips disabled and selects next enabled (ArrowDown to c, Enter)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DisabledOptionHostComponent],
      }).createComponent(DisabledOptionHostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('c');
    });
  });
});
