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

function inputText(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
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

@Component({
  imports: [TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi"
      [options]="options()"
      [query]="query()"
      (queryChange)="onQueryChange($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
    />
  `,
})
class QueryHostComponent {
  readonly options = signal<readonly MarketOption[]>([
    { code: 'ca', label: 'Canada' },
    { code: 'de', label: 'Germany' },
    { code: 'jp', label: 'Japan' },
  ]);
  readonly query = signal('');
  readonly queryChangeCalls: string[] = [];
  readonly getOptionValue = (market: MarketOption) => market.code;
  readonly getOptionLabel = (market: MarketOption) => market.label;

  onQueryChange(query: string): void {
    this.queryChangeCalls.push(query);
    this.query.set(query);
  }
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

  it('exposes queryChange from the component wrapper when typing', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryHostComponent],
    }).createComponent(QueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    trigger.focus();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'api');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.query()).toBe('api');
    expect(host.queryChangeCalls).toContain('api');
    expect(trigger.value).toBe('api');
  });

  it('renders server-filtered options as provided by the host', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [QueryHostComponent],
    }).createComponent(QueryHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="multi-autocomplete-trigger"]',
    ) as HTMLInputElement;

    trigger.focus();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    inputText(trigger, 'remote');
    host.options.set([{ code: 'de', label: 'Germany' }]);
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    const options = Array.from(
      getOpenOverlay()?.querySelectorAll('[data-slot="multi-autocomplete-option"]') ?? [],
    ) as HTMLElement[];

    expect(host.query()).toBe('remote');
    expect(options.map((el) => el.textContent?.trim())).toEqual(['Germany']);
  });
});
