import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
}

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  target: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  source.dispatchEvent(event);
  source.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: target,
    }),
  );

  target.focus();
  target.dispatchEvent(
    new FocusEvent('focusin', {
      bubbles: true,
      relatedTarget: source,
    }),
  );

  return event;
}

@Component({
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <section
      tngMultiAutocomplete
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

      <div tngMultiAutocompleteContent>
        <div tngMultiAutocompleteOverlay>
          <ul tngMultiAutocompleteListbox data-testid="listbox">
            <li tngMultiAutocompleteOption [tngValue]="'India'">India</li>
            <li tngMultiAutocompleteOption [tngValue]="'Indonesia'">Indonesia</li>
            <li tngMultiAutocompleteOption [tngValue]="'Canada'">Canada</li>
          </ul>
        </div>
      </div>
    </section>

    <button type="button" data-testid="after-button">Next element</button>
  `,
})
class MultiAutocompleteTabFocusHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
}

describe('tng-multi-autocomplete tab focus handoff', () => {
  it('opens on focus, then Tab closes overlay and moves focus to the next focusable element', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteTabFocusHostComponent],
    }).createComponent(MultiAutocompleteTabFocusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const afterButton = fixture.nativeElement.querySelector(
      '[data-testid="after-button"]',
    ) as HTMLButtonElement;

    expect(host.open()).toBe(false);

    focus(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    const event = dispatchTabAndSimulateBrowserFocus(trigger, afterButton);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(afterButton);
    expect(host.open()).toBe(false);
  });
});
