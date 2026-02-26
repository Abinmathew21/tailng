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

function focus(el: HTMLElement): void {
  el.focus();
}

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    })
  );
}

function findOverlay(): HTMLElement | null {
  return document.body.querySelector('[data-testid="overlay"]') as HTMLElement | null;
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
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

/** Overlay with wide content to test min-width vs grow. */
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
      <input tngAutocompleteTrigger type="text" data-testid="trigger" style="width: 100px" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
            style="min-width: 300px"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">Option A – very long label</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">Option B – very long label</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">Option C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class WideContentHostComponent {
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

describe('tng-autocomplete.overlay', () => {
  describe('Overlay renders when open=true', () => {
    it('overlay is in body and not hidden when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      expect(host.open()).toBe(false);

      await openAutocomplete(fixture, trigger);

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBeNull();
      expect(document.body.contains(overlay)).toBe(true);
    });
  });

  describe('Overlay hidden when closed', () => {
    it('overlay has hidden when closed', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(findOverlay()?.getAttribute('hidden')).toBeNull();

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.getAttribute('hidden')).toBe('');
    });
  });

  describe('Min-width equals trigger width', () => {
    it('overlay min-width matches trigger width when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
      const triggerRect = trigger.getBoundingClientRect();

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      const minWidth = overlay?.style.minWidth;
      expect(minWidth).toBeDefined();
      expect(parseFloat(minWidth || '0')).toBe(triggerRect.width);
    });
  });

  describe('Overlay can grow wider than trigger', () => {
    it('overlay has minWidth but no maxWidth, so content can grow', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [WideContentHostComponent],
      }).createComponent(WideContentHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);

      await Promise.resolve();
      fixture.detectChanges();

      const overlay = findOverlay();
      expect(overlay).toBeTruthy();
      expect(overlay?.style.minWidth).toBeDefined();
      expect(overlay?.style.maxWidth ?? '').toBe('');
    });
  });

  describe('Clicking outside closes', () => {
    it('pointerdown outside overlay closes', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      pointerdown(document.body);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('Escape closes', () => {
    it('Escape key closes overlay', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Escape' });
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });
  });

  describe('Focus restore does not reopen', () => {
    it('focus on trigger after close does not reopen when _restoringFocus', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;

      await openAutocomplete(fixture, trigger);
      expect(host.open()).toBe(true);

      keydown(trigger, { key: 'Enter' });
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
      expect(document.activeElement).toBe(trigger);
      expect(host.open()).toBe(false);
    });
  });

  describe('Scroll reposition', () => {
    it.todo('scroll event triggers overlay reposition');
  });
});
