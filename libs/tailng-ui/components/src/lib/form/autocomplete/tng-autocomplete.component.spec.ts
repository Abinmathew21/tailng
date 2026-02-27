import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngAutocompleteComponent } from './tng-autocomplete.component';

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
}

type Option = { value: string; label: string };

@Component({
  standalone: true,
  imports: [TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      [getOptionValue]="getOptionValue"
      [getOptionLabel]="getOptionLabel"
      placeholder="Type to search"
      data-testid="autocomplete"
    />
  `,
})
class HostComponent {
  readonly options: Option[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ];
  readonly value = signal<string | null>(null);
  readonly getOptionValue = (o: Option) => o.value;
  readonly getOptionLabel = (o: Option) => o.label;
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  trigger.focus();
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete component', () => {
  it('exports the autocomplete component', () => {
    expect(typeof TngAutocompleteComponent).toBe('function');
  });

  it('Space when open does NOT select - inserts into input for typing - e.g. "United St"', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    expect(trigger).toBeTruthy();

    await openAutocomplete(fixture, trigger);

    keydown(trigger, { key: ' ' });
    fixture.detectChanges();

    // Space should NOT select; value stays null
    expect(host.value()).toBe(null);
  });

  it('Enter selection updates input to show selected label (not placeholder)', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="autocomplete-trigger"]'
    ) as HTMLInputElement;

    await openAutocomplete(fixture, trigger);

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    expect(host.value()).toBe('a');
    expect(trigger.value).toBe('Option A');
  });
});
