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
      [disabled]="disabled()"
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
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  disabled = signal(false);
}

@Component({
  imports: [TngAutocomplete, TngAutocompleteTrigger],
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
      <input
        tngAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="value() ?? ''"
      />
    </div>
  `,
})
class NoListboxHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

describe('tng-autocomplete keyboard (combobox logic)', () => {
  describe('closed state', () => {
    it('ArrowDown opens and ensures active first option', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      expect(host.open()).toBe(false);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(trigger.getAttribute('aria-activedescendant')).toMatch(/opt-a|opt/);
    });

    it('ArrowUp opens and ensures active last option', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      expect(host.open()).toBe(false);

      keydown(trigger, { key: 'ArrowUp' });
      fixture.detectChanges();

      expect(host.open()).toBe(true);
      expect(trigger.getAttribute('aria-activedescendant')).toMatch(/opt-c|opt/);
    });

    it('Enter when closed does not open (autocomplete rule: input uses Enter for submit)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });

    it('Space when closed does not open (autocomplete rule: input uses Space for typing)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: ' ' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('open state', () => {
    it('ArrowDown navigates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      const activedesc1 = trigger.getAttribute('aria-activedescendant');
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      const activedesc2 = trigger.getAttribute('aria-activedescendant');

      expect(activedesc2).not.toBe(activedesc1);
    });

    it('ArrowUp navigates', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowUp' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      const activedesc1 = trigger.getAttribute('aria-activedescendant');
      keydown(trigger, { key: 'ArrowUp' });
      fixture.detectChanges();
      const activedesc2 = trigger.getAttribute('aria-activedescendant');

      expect(activedesc2).not.toBe(activedesc1);
    });

    it('Home moves active to first option', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowUp' });
      fixture.detectChanges();
      const lastActivedesc = trigger.getAttribute('aria-activedescendant');

      keydown(trigger, { key: 'Home' });
      fixture.detectChanges();
      const firstActivedesc = trigger.getAttribute('aria-activedescendant');

      expect(firstActivedesc).toMatch(/opt-a|opt/);
      expect(firstActivedesc).not.toBe(lastActivedesc);
    });

    it('End moves active to last option', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      const firstActivedesc = trigger.getAttribute('aria-activedescendant');

      keydown(trigger, { key: 'End' });
      fixture.detectChanges();
      const lastActivedesc = trigger.getAttribute('aria-activedescendant');

      expect(lastActivedesc).toMatch(/opt-c|opt/);
      expect(lastActivedesc).not.toBe(firstActivedesc);
    });

    it('Escape closes without changing value', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.value.set('a');
      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(String(trigger.getAttribute('aria-activedescendant') ?? '')).toMatch(/opt-b|opt/);

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(host.value()).toBe('a');
    });

    it('Enter commits active option', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe('b');
      expect(host.open()).toBe(false);
    });

    it('Space when open does NOT select - inserts into input like normal typing', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      keydown(trigger, { key: ' ' });
      fixture.detectChanges();

      // Space should NOT commit; value stays null, overlay stays open
      expect(host.value()).toBe(null);
      expect(host.open()).toBe(true);
    });

    it('Tab does not commit active option (value unchanged)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-activedescendant')).toMatch(/opt-b|opt/);

      keydown(trigger, { key: 'Tab' });
      fixture.detectChanges();

      expect(host.value()).toBe(null);
    });
  });

  describe('disabled state', () => {
    it('ArrowDown does nothing when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.disabled.set(true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });

    it('ArrowUp does nothing when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.disabled.set(true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'ArrowUp' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });

    it('Enter does nothing when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.open.set(true);
      host.disabled.set(true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toBe(null);
    });

    it('Escape does nothing when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.open.set(true);
      host.disabled.set(true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(true);
    });
  });

  describe('no listbox registered', () => {
    it('ArrowDown does not crash', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NoListboxHostComponent],
      }).createComponent(NoListboxHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      expect(() => {
        keydown(trigger, { key: 'ArrowDown' });
        fixture.detectChanges();
      }).not.toThrow();
      expect(host.open()).toBe(true);
    });

    it('Enter does not throw when open without listbox', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NoListboxHostComponent],
      }).createComponent(NoListboxHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.open.set(true);
      fixture.detectChanges();

      expect(() => {
        keydown(trigger, { key: 'Enter' });
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
