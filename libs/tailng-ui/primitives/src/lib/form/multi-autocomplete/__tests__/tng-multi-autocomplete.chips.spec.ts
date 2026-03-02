import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';
import { TngMultiAutocompleteChip } from '../tng-multi-autocomplete.chip';

function keydown(el: HTMLElement, key: string) {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    }),
  );
}

@Component({
  standalone: true,
  imports: [TngMultiAutocomplete, TngMultiAutocompleteTrigger],
  template: `
    <section
      tngMultiAutocomplete
      #m="tngMultiAutocomplete"
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      <input tngMultiAutocompleteTrigger data-testid="input" />
    </section>
  `,
})
class HostComponent {
  readonly value = signal<readonly string[]>(['a', 'b']);
}

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
  ],
  template: `
    <section
      tngMultiAutocomplete
      [value]="value()"
      (valueChange)="value.set($event)"
    >
      @for (chip of value(); track chip) {
        <span tngMultiAutocompleteChip data-testid="chip">
          {{ chip }}
        </span>
      }

      <input
        tngMultiAutocompleteTrigger
        data-testid="trigger"
        type="text"
      />
    </section>
  `,
})
class ChipNavHostComponent {
  readonly value = signal<readonly string[]>(['A', 'B', 'C']);
}

describe('tng-multi-autocomplete chips UX', () => {
  it('Backspace removes last selected item when input is empty', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = ''; // empty

    keydown(input, 'Backspace' );
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['a']);
  });
});

describe('multi-autocomplete chip navigation', () => {
  it('ArrowLeft from input focuses last chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    ) as HTMLInputElement;

    trigger.focus();
    keydown(trigger, 'ArrowLeft');
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll(
      '[data-testid="chip"]'
    );

    expect(document.activeElement).toBe(chips[2]);
  });

  it('ArrowRight on last chip focuses input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ChipNavHostComponent],
    }).createComponent(ChipNavHostComponent);

    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll(
      '[data-testid="chip"]'
    );

    (chips[2] as HTMLElement).focus();
    keydown(chips[2], 'ArrowRight');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    );

    expect(document.activeElement).toBe(trigger);
  });
});