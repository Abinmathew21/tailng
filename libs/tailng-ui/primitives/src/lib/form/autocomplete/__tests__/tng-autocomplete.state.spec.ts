import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteContent,
} from '../index';
import type { TngAutocompleteListboxApi } from '../tng-autocomplete.listbox.types';

@Component({
  imports: [TngAutocomplete, TngAutocompleteTrigger, TngAutocompleteContent],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      [disabled]="disabled()"
      [loading]="loading()"
      [invalid]="invalid()"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />
      <div tngAutocompleteContent data-testid="content"></div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  disabled = signal(false);
  loading = signal(false);
  invalid = signal(false);
}

function createStubListboxApi(): TngAutocompleteListboxApi<string> {
  return {
    getHostId: () => 'listbox-1',
    getActiveId: () => 'opt-1',
    ensureActive: () => {},
    handleKey: () => false,
    typeahead: () => false,
    commitActive: () => {},
  };
}

describe('tng-autocomplete.state', () => {
  describe('default state', () => {
    it('open() defaults to false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.api.open()).toBe(false);
    });

    it('value() defaults to null', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.api.value()).toBeNull();
    });

    it('disabled() defaults to false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.api.disabled()).toBe(false);
    });

    it('loading() defaults to false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.api.loading()).toBe(false);
    });

    it('invalid() defaults to false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.api.invalid()).toBe(false);
    });
  });

  describe('host bindings', () => {
    it('data-slot="autocomplete" on host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('[data-testid="autocomplete"]') as HTMLElement;
      expect(el.getAttribute('data-slot')).toBe('autocomplete');
    });

    it('data-state reflects open/closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;
      const el = fixture.nativeElement.querySelector('[data-testid="autocomplete"]') as HTMLElement;

      expect(el.getAttribute('data-state')).toBe('closed');

      host.open.set(true);
      fixture.detectChanges();
      expect(el.getAttribute('data-state')).toBe('open');

      host.open.set(false);
      fixture.detectChanges();
      expect(el.getAttribute('data-state')).toBe('closed');
    });

    it('data-disabled when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;
      const el = fixture.nativeElement.querySelector('[data-testid="autocomplete"]') as HTMLElement;

      expect(el.getAttribute('data-disabled')).toBeNull();

      host.disabled.set(true);
      fixture.detectChanges();
      expect(el.getAttribute('data-disabled')).toBe('');
    });

    it('data-loading when loading', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;
      const el = fixture.nativeElement.querySelector('[data-testid="autocomplete"]') as HTMLElement;

      expect(el.getAttribute('data-loading')).toBeNull();

      host.loading.set(true);
      fixture.detectChanges();
      expect(el.getAttribute('data-loading')).toBe('');
    });

    it('data-invalid when invalid', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;
      const el = fixture.nativeElement.querySelector('[data-testid="autocomplete"]') as HTMLElement;

      expect(el.getAttribute('data-invalid')).toBeNull();

      host.invalid.set(true);
      fixture.detectChanges();
      expect(el.getAttribute('data-invalid')).toBe('');
    });
  });

  describe('open / close behavior', () => {
    it('openSelect() opens when not disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;

      expect(host.open()).toBe(false);

      host.api.openSelect();
      fixture.detectChanges();

      expect(host.open()).toBe(true);
    });

    it('openSelect() does nothing when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;

      host.disabled.set(true);
      fixture.detectChanges();

      host.api.openSelect();
      fixture.detectChanges();

      expect(host.open()).toBe(false);
    });

    it('close() always closes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;

      host.open.set(true);
      fixture.detectChanges();
      expect(host.open()).toBe(true);

      host.api.close();
      fixture.detectChanges();
      expect(host.open()).toBe(false);
    });
  });

  describe('selection behavior', () => {
    it('selectValue() sets value + closes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;

      host.open.set(true);
      fixture.detectChanges();

      host.api.selectValue('Albania');
      fixture.detectChanges();

      expect(host.value()).toBe('Albania');
      expect(host.open()).toBe(false);
    });

    it('selectValue() blocked when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const host = fixture.componentInstance;

      host.disabled.set(true);
      host.open.set(true);
      fixture.detectChanges();

      host.api.selectValue('Albania');
      fixture.detectChanges();

      expect(host.value()).toBeNull();
    });
  });

  describe('ID setters/getters', () => {
    it('setContentId() / getContentId()', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;

      expect(api.getContentId()).toMatch(/^tng-autocomplete-content-\d+$/);

      api.setContentId('content-123');
      expect(api.getContentId()).toBe('content-123');

      api.setContentId(null);
      expect(api.getContentId()).toBeNull();
    });

    it('setListboxId() / getListboxId()', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;

      expect(api.getListboxId()).toBeNull();

      api.setListboxId('listbox-456');
      expect(api.getListboxId()).toBe('listbox-456');

      api.setListboxId(null);
      expect(api.getListboxId()).toBeNull();
    });

    it('setActiveDescendantId() / getActiveDescendantId()', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;

      expect(api.getActiveDescendantId()).toBeNull();

      api.setActiveDescendantId('opt-1');
      expect(api.getActiveDescendantId()).toBe('opt-1');

      api.setActiveDescendantId(null);
      expect(api.getActiveDescendantId()).toBeNull();
    });
  });

  describe('listbox API bridge', () => {
    it('setListboxApi() stores api', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;
      const stub = createStubListboxApi();

      expect(api.getListboxApi()).toBeNull();

      api.setListboxApi(stub);
      expect(api.getListboxApi()).toBe(stub);
    });

    it('clearing api works', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;
      const stub = createStubListboxApi();

      api.setListboxApi(stub);
      expect(api.getListboxApi()).toBe(stub);

      api.setListboxApi(null);
      expect(api.getListboxApi()).toBeNull();
    });

    it('getListboxApi() returns latest value', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [HostComponent],
      }).createComponent(HostComponent);
      fixture.detectChanges();
      const api = fixture.componentInstance.api;
      const stub1 = createStubListboxApi();
      const stub2: TngAutocompleteListboxApi<string> = {
        ...createStubListboxApi(),
        getActiveId: () => 'opt-2',
      };

      api.setListboxApi(stub1);
      expect(api.getListboxApi()?.getActiveId()).toBe('opt-1');

      api.setListboxApi(stub2);
      expect(api.getListboxApi()?.getActiveId()).toBe('opt-2');
    });
  });
});
