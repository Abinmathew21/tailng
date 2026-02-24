// tng-select.spec.ts
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngSelect } from './tng-select';
import { TngSelectContent } from './tng-select.parts'; // OR from './tng-select' if you moved it there


function dispatchKeydown(el: HTMLElement, eventInit: Partial<KeyboardEventInit> & { key: string }) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...eventInit,
  });

  // spy on stopPropagation (JSDOM supports patching this)
  const stopPropagation = vi.spyOn(event, 'stopPropagation');

  el.dispatchEvent(event);

  return { event, stopPropagation };
}

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectContent],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="trigger"
    >
      Trigger
    </button>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect;

  open = signal(false);
  disabled = signal(false);
}

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectContent],
  template: `
    <div
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select"
    >
      <button type="button" data-testid="trigger">Trigger</button>

      <div tngSelectContent data-testid="content">Content</div>
    </div>
  `,
})
class HostWithContentComponent {
  @ViewChild('api', { static: true }) api!: TngSelect;

  open = signal(false);
  disabled = signal(false);
}

describe('tng-select primitive', () => {
  it('sets data-slot="select" on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(el.getAttribute('data-slot')).toBe('select');
  });

  it('reflects open state via aria-expanded and data-state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(el.getAttribute('aria-expanded')).toBe('false');
    expect(el.getAttribute('data-state')).toBe('closed');

    host.open.set(true);
    fixture.detectChanges();

    expect(el.getAttribute('aria-expanded')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('open');
  });

  it('reflects disabled state via aria-disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(el.getAttribute('aria-disabled')).toBeNull();

    host.disabled.set(true);
    fixture.detectChanges();

    expect(el.getAttribute('aria-disabled')).toBe('true');
  });

  it('supports exportAs="tngSelect"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    expect(fixture.componentInstance.api).toBeInstanceOf(TngSelect);
  });
});



describe('tng-select primitive (behavior)', () => {
  it('openSelect() opens when enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(el.getAttribute('data-state')).toBe('closed');

    host.api.openSelect();
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(el.getAttribute('data-state')).toBe('open');
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

  it('toggle() toggles when enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

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
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;

    host.disabled.set(true);
    fixture.detectChanges();

    host.api.toggle();
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('Escape closes when open and prevents default + stops propagation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // open first
    host.open.set(true);
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    const { event, stopPropagation } = dispatchKeydown(el, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('Escape does nothing when closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    const { event } = dispatchKeydown(el, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  it('Escape is ignored when defaultPrevented is already true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const el = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    host.open.set(true);
    fixture.detectChanges();

    // Create a keydown event and pre-prevent it.
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();

    el.dispatchEvent(event);
    fixture.detectChanges();

    // should remain open because handler bails out
    expect(host.open()).toBe(true);
  });

  it('wires aria-controls to the select content id only when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostWithContentComponent],
    }).createComponent(HostWithContentComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    const selectEl = fixture.nativeElement.querySelector(
      '[data-testid="select"]',
    ) as HTMLElement;
  
    const contentEl = fixture.nativeElement.querySelector(
      '[data-testid="content"]',
    ) as HTMLElement;
  
    // closed: aria-controls should be absent
    expect(selectEl.getAttribute('aria-controls')).toBeNull();
  
    host.open.set(true);
    fixture.detectChanges();
  
    const contentId = contentEl.getAttribute('id');
    expect(contentId).toBeTruthy();
    expect(selectEl.getAttribute('aria-controls')).toBe(contentId);
  
    host.open.set(false);
    fixture.detectChanges();
  
    expect(selectEl.getAttribute('aria-controls')).toBeNull();
  });
});