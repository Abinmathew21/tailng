// tng-multi-select.state.spec.ts
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TngMultiSelect } from '../tng-multi-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-multi-select.parts';
import { TngMultiSelectListbox, TngMultiSelectOption } from '../tng-multi-select.listbox';

function dispatchKeydown(el: HTMLElement, eventInit: Partial<KeyboardEventInit> & { key: string }) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...eventInit,
  });
  const stopPropagation = vi.spyOn(event, 'stopPropagation');
  el.dispatchEvent(event);
  return { event, stopPropagation };
}

@Component({
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectContent, TngMultiSelectListbox, TngMultiSelectOption],
  template: `
    <div
      tngMultiSelect
      #api="tngMultiSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-select"
    >
      <button tngSelectTrigger data-testid="trigger">Trigger</button>
      <div tngSelectContent data-testid="content">
        <ul tngMultiSelectListbox [multiple]="true" data-testid="listbox">
          <li tngMultiSelectOption [tngValue]="'a'" data-testid="opt-a">A</li>
          <li tngMultiSelectOption [tngValue]="'b'" data-testid="opt-b">B</li>
        </ul>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiSelect<string>;
  open = signal(false);
  disabled = signal(false);
  value = signal<readonly string[]>([]);
}

describe('tng-multi-select primitive', () => {
  it('sets data-slot="multi-select" on the multi-select host', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const selectEl = fixture.nativeElement.querySelector('[data-testid="multi-select"]') as HTMLElement;
    expect(selectEl.getAttribute('data-slot')).toBe('multi-select');

    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    expect(triggerEl.getAttribute('data-slot')).toBe('select-trigger');
  });

  it('reflects open state via aria-expanded and data-state', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const selectEl = fixture.nativeElement.querySelector('[data-testid="multi-select"]') as HTMLElement;

    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    expect(selectEl.getAttribute('data-state')).toBe('closed');

    host.open.set(true);
    fixture.detectChanges();

    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
    expect(selectEl.getAttribute('data-state')).toBe('open');
  });

  it('reflects disabled state via aria-disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(el.getAttribute('aria-disabled')).toBeNull();

    host.disabled.set(true);
    fixture.detectChanges();

    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('supports exportAs="tngMultiSelect"', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.api).toBeInstanceOf(TngMultiSelect);
  });

  it('value() defaults to empty array', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.api.value()).toEqual([]);
  });

  it('multiple() always returns true', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.api.multiple()).toBe(true);
  });
});

describe('tng-multi-select primitive (behavior)', () => {
  it('openSelect() opens when enabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const selectEl = fixture.nativeElement.querySelector('[data-testid="multi-select"]') as HTMLElement;
    expect(selectEl.getAttribute('data-state')).toBe('closed');

    host.api.openSelect();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(selectEl.getAttribute('data-state')).toBe('open');
  });

  it('openSelect() does nothing when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.disabled.set(true);
    fixture.detectChanges();

    host.api.openSelect();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('toggle() toggles when enabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;

    host.api.toggle();
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    host.api.toggle();
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('toggle() does nothing when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.disabled.set(true);
    fixture.detectChanges();

    host.api.toggle();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('Escape closes when open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    host.open.set(true);
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    dispatchKeydown(el, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('Escape does nothing when closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    const { event } = dispatchKeydown(el, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });
});
