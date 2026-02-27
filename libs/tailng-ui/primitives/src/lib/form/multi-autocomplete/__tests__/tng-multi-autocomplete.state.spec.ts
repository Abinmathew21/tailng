import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';
import {
  TngMultiAutocompleteContent,
  TngMultiAutocompleteTrigger,
} from '../tng-multi-autocomplete.parts';
import { TngMultiAutocompleteOverlay } from '../tng-multi-autocomplete.overlay';
import { TngMultiAutocompleteListbox, TngMultiAutocompleteOption } from '../tng-multi-autocomplete.listbox';

@Component({
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  template: `
    <div
      tngMultiAutocomplete
      #api="tngMultiAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-autocomplete"
    >
      <input
        tngMultiAutocompleteTrigger
        type="text"
        data-testid="trigger"
        [value]="query()"
      />

      <div tngMultiAutocompleteContent data-testid="content">
        <div tngMultiAutocompleteOverlay data-testid="overlay">
          <ul tngMultiAutocompleteListbox [multiple]="true" data-testid="listbox">
            <li tngMultiAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngMultiAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiAutocomplete<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
  query = signal('');
}

describe('tng-multi-autocomplete primitive', () => {
  it('sets data-slot="multi-autocomplete" on the host', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="multi-autocomplete"]') as HTMLElement;
    expect(host.getAttribute('data-slot')).toBe('multi-autocomplete');
  });

  it('value() defaults to empty array', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.api.value()).toEqual([]);
  });

  it('reflects open state via data-state', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="multi-autocomplete"]') as HTMLElement;

    expect(el.getAttribute('data-state')).toBe('closed');

    host.open.set(true);
    fixture.detectChanges();

    expect(el.getAttribute('data-state')).toBe('open');
  });

  it('supports exportAs="tngMultiAutocomplete"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(
      HostComponent
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.api).toBeInstanceOf(TngMultiAutocomplete);
  });
});
