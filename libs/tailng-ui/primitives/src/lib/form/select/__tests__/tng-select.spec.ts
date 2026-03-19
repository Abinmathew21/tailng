// tng-select.spec.ts
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngSelect } from '../tng-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-select.parts';


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
  imports: [TngSelect, TngSelectTrigger, TngSelectContent],
  template: `
    <div
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select"
    >
      <button tngSelectTrigger data-testid="trigger">Trigger</button>
      <div tngSelectContent data-testid="content"></div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect;
  open = signal(false);
  disabled = signal(false);
}

@Component({
  imports: [TngSelect, TngSelectTrigger, TngSelectContent],
  template: `
    <div
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select"
    >
      <button type="button" tngSelectTrigger data-testid="trigger">Trigger</button>

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
  it('sets data-slot="select" on the select host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const selectEl = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    expect(selectEl.getAttribute('data-slot')).toBe('select');
  
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    expect(triggerEl.getAttribute('data-slot')).toBe('select-trigger');
  });

  it('reflects open state via aria-expanded and data-state', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const selectEl = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
  
    // trigger owns aria-expanded in mode 2
    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    // select host still owns data-state
    expect(selectEl.getAttribute('data-state')).toBe('closed');
  
    host.open.set(true);
    fixture.detectChanges();
  
    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
    expect(selectEl.getAttribute('data-state')).toBe('open');
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
  
    const selectEl = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    expect(selectEl.getAttribute('data-state')).toBe('closed');
  
    host.api.openSelect();
    fixture.detectChanges();
  
    expect(host.open()).toBe(true);
    expect(selectEl.getAttribute('data-state')).toBe('open');
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
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    host.api.openSelect();
    fixture.detectChanges();
  
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();
  
    trigger.dispatchEvent(event);
    fixture.detectChanges();
  
    expect(host.api.open()).toBe(true);
  });
  
  it('wires aria-controls to the select content id only when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostWithContentComponent],
    }).createComponent(HostWithContentComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    const triggerEl = fixture.nativeElement.querySelector(
      '[data-testid="trigger"]',
    ) as HTMLElement;
  
    const contentEl = fixture.nativeElement.querySelector(
      '[data-testid="content"]',
    ) as HTMLElement;
  
    // content should always have an id (mounted always)
    const contentId = contentEl.getAttribute('id');
    expect(contentId).toBeTruthy();
  
    // closed: aria-controls absent
    expect(triggerEl.getAttribute('aria-controls')).toBeNull();
  
    host.open.set(true);
    fixture.detectChanges();
  
    // open: aria-controls points to content id
    expect(triggerEl.getAttribute('aria-controls')).toBe(contentId);
  
    host.open.set(false);
    fixture.detectChanges();
  
    expect(triggerEl.getAttribute('aria-controls')).toBeNull();
  });

  it('wires aria-controls to content id only when open (Mode 2: on trigger)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const contentEl = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    // content id should exist immediately (even when hidden)
    const contentId = contentEl.getAttribute('id');
    expect(contentId).toBeTruthy();
  
    // closed => aria-controls absent
    expect(triggerEl.getAttribute('aria-controls')).toBeNull();
  
    host.open.set(true);
    fixture.detectChanges();
  
    // open => aria-controls points to content id
    expect(triggerEl.getAttribute('aria-controls')).toBe(contentId);
  
    host.open.set(false);
    fixture.detectChanges();
  
    expect(triggerEl.getAttribute('aria-controls')).toBeNull();
  });
});