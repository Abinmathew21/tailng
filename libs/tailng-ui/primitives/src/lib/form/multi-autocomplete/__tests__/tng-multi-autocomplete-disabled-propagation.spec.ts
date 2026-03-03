import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';

function keydown(el: HTMLElement, key: string) {
  const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  const prevented = !el.dispatchEvent(ev);
  return { ev, prevented };
}

@Component({
  standalone: true,
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section
      tngMultiAutocomplete
      [disabled]="true"
      [value]="value()"
      (valueChange)="value.set($event)"
      (queryChange)="queries.push($event)"
    >
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="'chip-' + item"
        >
          {{ item }}
        </span>
      }

      <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" type="text" />
    </section>
  `,
})
class DisabledPropagationHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b']);
  readonly queries: string[] = [];
}

describe('tng-multi-autocomplete disabled propagation', () => {
  it('disabled trigger keydown does NOT preventDefault / stopPropagation (no side-effects)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledPropagationHostComponent],
    }).createComponent(DisabledPropagationHostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    const parentSpy = vi.fn();
    input.parentElement!.addEventListener('keydown', parentSpy);

    const { ev } = keydown(input, 'ArrowDown');
    expect(ev.defaultPrevented).toBe(false);
    expect(parentSpy).toHaveBeenCalledTimes(1);
  });

  it('disabled chip keydown does NOT preventDefault / stopPropagation (no side-effects)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledPropagationHostComponent],
    }).createComponent(DisabledPropagationHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    const parentSpy = vi.fn();
    chipB.parentElement!.addEventListener('keydown', parentSpy);

    const { ev } = keydown(chipB, 'Delete');
    expect(ev.defaultPrevented).toBe(false);
    expect(parentSpy).toHaveBeenCalledTimes(1);
  });
});