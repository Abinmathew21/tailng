import { Component, ViewChild, signal } from '@angular/core';
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
        [value]="query()"
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
  query = signal('');
}

describe('tng-multi-autocomplete selection', () => {
  describe('Enter key appends selected option to values list', () => {
    it('pressing Enter when first option is active appends it to value', async () => {
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
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toEqual(['a']);
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

    it('pressing Enter multiple times appends each active option', async () => {
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

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      expect(host.value()).toEqual(['a', 'b', 'c']);
    });
  });

  describe('deselecting option removes it from selected list', () => {
    it('clicking already-selected option removes it from value', async () => {
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

      host.value.set(['b']);
      fixture.detectChanges();

      await openMultiAutocomplete(fixture, trigger);
      expect(host.api.open()).toBe(true);

      const optB = findOptionInBody('opt-b');
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toEqual([]);
      expect(host.api.open()).toBe(true);
      expect(content.hasAttribute('hidden')).toBe(false);
    });

    it('pressing Enter on already-selected option removes it (toggle off)', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.value.set(['b']);
      fixture.detectChanges();

      await openMultiAutocomplete(fixture, trigger);

      keydown(trigger, { key: 'ArrowDown' });
      fixture.detectChanges();
      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();

      expect(host.value()).toEqual([]);
    });

    it('deselecting one option keeps others in value', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector(
        '[data-testid="trigger"]'
      ) as HTMLInputElement;

      host.value.set(['a', 'b', 'c']);
      fixture.detectChanges();

      await openMultiAutocomplete(fixture, trigger);

      const optB = findOptionInBody('opt-b');
      pointerdown(optB);
      fixture.detectChanges();

      expect(host.value()).toEqual(['a', 'c']);
    });
  });
});
