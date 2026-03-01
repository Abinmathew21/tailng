import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import { TngMultiAutocompleteTrigger } from '../tng-multi-autocomplete.trigger';

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

describe('tng-multi-autocomplete chips UX', () => {
  it('Backspace removes last selected item when input is empty', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('[data-testid="input"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    input.value = ''; // empty

    keydown(input, { key: 'Backspace' });
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['a']);
  });
});