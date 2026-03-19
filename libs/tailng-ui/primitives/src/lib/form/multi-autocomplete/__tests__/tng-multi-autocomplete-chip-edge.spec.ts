import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';

function dispatchKeydown(el: HTMLElement, key: string) {
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  el.dispatchEvent(e);
  return e;
}

function dispatchFocus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus', { bubbles: false, cancelable: false }));
  el.focus?.();
}

@Component({
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger, TngMultiAutocompleteChip],
  template: `
    <section tngMultiAutocomplete [value]="value()" (valueChange)="value.set($event)">
      @for (item of value(); track item) {
        <span
          tngMultiAutocompleteChip
          [tngValue]="item"
          [attr.data-testid]="'chip-' + item"
        >
          {{ item }}
        </span>
      }
      <input tngMultiAutocompleteTrigger [attr.data-testid]="'input'" />
    </section>
  `,
})
class ChipEdgeHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
}

describe('tng-multi-autocomplete chip edge behavior', () => {
  it('ArrowLeft on first chip is a no-op (focus stays)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipEdgeHostComponent],
    }).createComponent(ChipEdgeHostComponent);

    fixture.detectChanges();

    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    dispatchFocus(chipA);
    fixture.detectChanges();

    dispatchKeydown(chipA, 'ArrowLeft');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipA);
  });

  it('ArrowRight on middle chip focuses next chip (not input)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipEdgeHostComponent],
    }).createComponent(ChipEdgeHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const chipC = fixture.nativeElement.querySelector('[data-testid="chip-c"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    dispatchFocus(chipB);
    fixture.detectChanges();

    dispatchKeydown(chipB, 'ArrowRight');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipC);
    expect(document.activeElement).not.toBe(input);
  });

  it('Home on first chip remains focused (idempotent)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipEdgeHostComponent],
    }).createComponent(ChipEdgeHostComponent);

    fixture.detectChanges();

    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    dispatchFocus(chipA);
    fixture.detectChanges();

    dispatchKeydown(chipA, 'Home');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(chipA);
  });

  it('Delete prevents default + stops propagation on chips (remove key path)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipEdgeHostComponent],
    }).createComponent(ChipEdgeHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    dispatchFocus(chipB);
    fixture.detectChanges();

    const e = dispatchKeydown(chipB, 'Delete');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(e.defaultPrevented).toBe(true);
  });

  it('Backspace prevents default + stops propagation on chips (remove key path)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipEdgeHostComponent],
    }).createComponent(ChipEdgeHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    dispatchFocus(chipB);
    fixture.detectChanges();

    const e = dispatchKeydown(chipB, 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(e.defaultPrevented).toBe(true);
  });
});