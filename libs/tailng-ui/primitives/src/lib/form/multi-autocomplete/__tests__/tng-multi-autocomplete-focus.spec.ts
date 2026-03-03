import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteChip,
} from '@tailng-ui/primitives';

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focus'));
  el.focus?.();
}

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit>) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  );
}

@Component({
  standalone: true,
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
class FocusHostComponent {
  readonly value = signal<readonly string[]>(['a', 'b', 'c']);
}

describe('tng-multi-autocomplete focus management', () => {
  it('Delete removes focused chip and focuses previous chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FocusHostComponent],
    }).createComponent(FocusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;

    focus(chipB);
    fixture.detectChanges();

    keydown(chipB, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['a', 'c']);
    expect(document.activeElement).toBe(chipA);
  });

  it('Delete on first chip focuses next chip (no previous)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FocusHostComponent],
    }).createComponent(FocusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipA = fixture.nativeElement.querySelector('[data-testid="chip-a"]') as HTMLElement;
    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;

    focus(chipA);
    fixture.detectChanges();

    keydown(chipA, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual(['b', 'c']);
    expect(document.activeElement).toBe(chipB);
  });

  it('Delete on last remaining chip focuses input', async () => {
    @Component({
      standalone: true,
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
    class OneChipHost {
      readonly value = signal<readonly string[]>(['x']);
    }

    const fixture = TestBed.configureTestingModule({
      imports: [OneChipHost],
    }).createComponent(OneChipHost);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const chipX = fixture.nativeElement.querySelector('[data-testid="chip-x"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(chipX);
    fixture.detectChanges();

    keydown(chipX, { key: 'Delete' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
    expect(document.activeElement).toBe(input);
  });

  it('End on chip focuses input (jump out of chips)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FocusHostComponent],
    }).createComponent(FocusHostComponent);

    fixture.detectChanges();

    const chipB = fixture.nativeElement.querySelector('[data-testid="chip-b"]') as HTMLElement;
    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;

    focus(chipB);
    fixture.detectChanges();

    keydown(chipB, { key: 'End' });
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(input);
  });
});