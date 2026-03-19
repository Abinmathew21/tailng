import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
} from '../index';

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  );
}

@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="autocomplete"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="value() ?? ''"
      />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
}

describe('tng-autocomplete primitive', () => {
  it('exports the autocomplete primitive', () => {
    expect(typeof TngAutocomplete).toBe('function');
  });

  it('opens on ArrowDown and sets aria-activedescendant', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    ) as HTMLInputElement;

    expect(host.open()).toBe(false);

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
  });

  it('Escape closes when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    ) as HTMLInputElement;

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('Enter commits active selection and closes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]'
    ) as HTMLInputElement;

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    expect(host.value()).toBe('a');
    expect(host.open()).toBe(false);
  });
});
