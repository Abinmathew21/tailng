import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteContent } from '../tng-multi-autocomplete.content';
import { TngMultiAutocompleteListbox } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

function focus(el: HTMLElement): void {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus();
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
      style="
        --tng-multi-autocomplete-surface: #f8fafc;
        --tng-multi-autocomplete-border: #d8e2ef;
        --tng-multi-autocomplete-fg: #0f172a;
        --tng-multi-autocomplete-brand: #2563eb;
        color-scheme: light;
      "
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger data-testid="trigger" type="text" autocomplete="off" />

      <div tngMultiAutocompleteContent class="contents">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox>
            <li tngMultiAutocompleteOption [tngValue]="'India'">India</li>
            <li tngMultiAutocompleteOption [tngValue]="'Indonesia'">Indonesia</li>
          </ul>
        </div>
      </div>
    </section>

    <button type="button" data-testid="after-button">After</button>
  `,
})
class MultiAutocompleteOverlayHostComponent {
  readonly open = signal(false);
  readonly value = signal<readonly string[]>([]);
}

describe('tng-multi-autocomplete overlay mounting', () => {
  it('moves overlay to document.body while open and restores it on close', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteOverlayHostComponent],
    }).createComponent(MultiAutocompleteOverlayHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiHost = fixture.nativeElement.querySelector('[data-slot="multi-autocomplete"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLInputElement;
    const overlay = fixture.nativeElement.querySelector('[data-testid="overlay"]') as HTMLElement;

    multiHost.getBoundingClientRect = () =>
      ({
        left: 48,
        top: 72,
        width: 320,
        height: 48,
        right: 368,
        bottom: 120,
        x: 48,
        y: 72,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(overlay.parentNode).not.toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(true);

    focus(trigger);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(overlay.parentNode).toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(false);
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-surface').trim()).toBe('#f8fafc');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-border').trim()).toBe('#d8e2ef');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-fg').trim()).toBe('#0f172a');
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-brand').trim()).toBe('#2563eb');
    expect(overlay.style.colorScheme).toBe('light');
    expect(overlay.style.width).toBe('320px');
    expect(overlay.style.minWidth).toBe('320px');

    host.open.set(false);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(overlay.parentNode).not.toBe(document.body);
    expect(fixture.nativeElement.contains(overlay)).toBe(true);
    expect(overlay.style.getPropertyValue('--tng-multi-autocomplete-surface').trim()).toBe('');
    expect(overlay.style.colorScheme).toBe('');
    expect(overlay.style.width).toBe('');
    expect(overlay.style.minWidth).toBe('');
  });
});
