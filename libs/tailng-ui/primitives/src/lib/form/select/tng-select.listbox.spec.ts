import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from './tng-select';
import { TngSelectListbox, TngSelectOption } from './tng-select.listbox';
import { TngSelectContent, TngSelectTrigger } from './tng-select.parts';

function pointerdown(el: HTMLElement, init: Partial<PointerEventInit> = {}): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...init,
    }),
  );
}

@Component({
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngSelectListbox,
    TngSelectOption,
  ],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [disabled]="disabled()"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <div
          tngSelectListbox
          [disabled]="false"
          [value]="value()"
          (valueChange)="value.set($event)"
          data-testid="listbox"
        >
          <div tngSelectOption [tngValue]="'a'" data-testid="opt-a">A</div>
          <div tngSelectOption [tngValue]="'b'" data-testid="opt-b">B</div>
          <div tngSelectOption [tngValue]="'c'" data-testid="opt-c">C</div>
        </div>
      </div>
    </button>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect<string>;

  open = signal(false);
  disabled = signal(false);
  value = signal<string | null>(null);

}

describe('tngSelectListbox primitive', () => {
  it('selecting an option updates select value and closes - when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    const selectEl = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    // closed initial
    expect(host.api.open()).toBe(false);
    expect(selectEl.getAttribute('aria-expanded')).toBe('false');
    expect(selectEl.getAttribute('data-state')).toBe('closed');
    expect(content.hasAttribute('hidden')).toBe(true);
  
    // open via trigger
    pointerdown(trigger);
    fixture.detectChanges();
  
    expect(host.api.open()).toBe(true);
    expect(selectEl.getAttribute('aria-expanded')).toBe('true');
    expect(selectEl.getAttribute('data-state')).toBe('open');
    expect(content.hasAttribute('hidden')).toBe(false);
  
    // pick option B
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();
  
    expect(host.value()).toBe('b');
    expect(host.api.open()).toBe(false);
    expect(selectEl.getAttribute('aria-expanded')).toBe('false');
    expect(selectEl.getAttribute('data-state')).toBe('closed');
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('does NOT auto-close when selection changes while closed - programmatic change', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    expect(host.open()).toBe(false);

    // programmatically set value (simulates controlled update)
    host.value.set('a');
    fixture.detectChanges();

    // wrapper effect must not close (already closed) and must not toggle open
    expect(host.value()).toBe('a');
    expect(host.open()).toBe(false);
  });

  it('clearing selection programmatically does NOT close when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    // open
    pointerdown(trigger);
    fixture.detectChanges();
  
    expect(host.api.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  
    // programmatic clear (parent-driven)
    host.value.set(null);
    fixture.detectChanges();
  
    // stays open (no user intent to close)
    expect(host.value()).toBeNull();
    expect(host.api.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('ignores listbox-driven changes when select is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    host.disabled.set(true);
    fixture.detectChanges();

    // even if user tries to open, trigger toggler should no-op
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(false);

    // even if value changes externally, we keep it (controlled), but no close logic is relevant
    host.value.set('c');
    fixture.detectChanges();
    expect(host.value()).toBe('c');
    expect(host.open()).toBe(false);
  });

  it('adds styling hook data-slot="select-listbox" on listbox host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const listbox = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;
    expect(listbox.getAttribute('data-slot')).toBe('select-listbox');
  });

  it('adds styling hook data-slot="select-option" on options', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    expect(optA.getAttribute('data-slot')).toBe('select-option');
    expect(optB.getAttribute('data-slot')).toBe('select-option');
  });
});