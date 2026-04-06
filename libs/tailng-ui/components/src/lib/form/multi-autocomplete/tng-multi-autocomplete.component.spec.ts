import '@angular/compiler';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { TngMultiAutocompleteComponent } from './tng-multi-autocomplete.component';

type MarketOption = {
  readonly code: string;
  readonly label: string;
};

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }),
  );
}

function getOpenOverlay(): HTMLElement | null {
  return (
    Array.from(document.body.querySelectorAll('[data-slot="multi-autocomplete-overlay"]')).find(
      (overlay) => overlay.getAttribute('hidden') === null,
    ) ?? null
  ) as HTMLElement | null;
}

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Search launch markets"
      [ariaLabel]="'Launch markets'"
    />
  `,
})
class HostComponent {
  readonly options: readonly MarketOption[] = [
    { code: 'ca', label: 'Canada' },
    { code: 'de', label: 'Germany' },
    { code: 'jp', label: 'Japan' },
  ];
  readonly value = signal<readonly string[]>(['de']);
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;
}

describe('tng-multi-autocomplete component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.body
      .querySelectorAll('[data-slot="multi-autocomplete-overlay"]')
      .forEach((overlay) => overlay.remove());
  });

  it('exports the multi autocomplete component', () => {
    expect(typeof TngMultiAutocompleteComponent).toBe('function');
  });

  it('clicking the wrapper surface focuses the trigger and opens the overlay', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const hostEl = fixture.nativeElement.querySelector('[data-testid="multi"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    click(hostEl);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    expect(getOpenOverlay()).toBeTruthy();
  });

  it('clicking the remove button still removes the selected chip', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const removeButton = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-chip"] button',
    ) as HTMLButtonElement;

    pointerdown(removeButton);
    click(removeButton);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.value()).toEqual([]);
  });
});
