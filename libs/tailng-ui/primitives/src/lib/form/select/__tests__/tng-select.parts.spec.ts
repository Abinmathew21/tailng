// tng-select.parts.spec.ts
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from '../tng-select';
import {
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
} from '../tng-select.parts';

function dispatchPointerDown(el: HTMLElement, init?: Partial<PointerEventInit> & { button?: number }): void {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    button: 0,
    ...init,
  });
  el.dispatchEvent(event);
}

function dispatchKeydown(el: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
}

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select-root"
    >
      <span tngSelectValue data-testid="value">Value</span>
      <span tngSelectIcon data-testid="icon">Icon</span>

      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">Content</div>
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
  imports: [TngSelectTrigger],
  template: `<span tngSelectTrigger data-testid="trigger">Trigger</span>`,
})
class TriggerOutsideSelectHostComponent {}

describe('tng-select parts (option B)', () => {
  it('sets data-slot attributes on parts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('[data-testid="trigger"]')?.getAttribute('data-slot')).toBe('select-trigger');
    expect(root.querySelector('[data-testid="value"]')?.getAttribute('data-slot')).toBe('select-value');
    expect(root.querySelector('[data-testid="icon"]')?.getAttribute('data-slot')).toBe('select-icon');
    expect(root.querySelector('[data-testid="content"]')?.getAttribute('data-slot')).toBe('select-content');
  });

  it('trigger toggles open on left pointerdown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(host.open()).toBe(false);

    dispatchPointerDown(trigger, { button: 0 });
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    dispatchPointerDown(trigger, { button: 0 });
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('trigger ignores non-left pointer buttons', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    dispatchPointerDown(trigger, { button: 2 }); // right click
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('trigger opens on Enter/Space when closed; Space does not toggle closed when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    // closed -> Enter opens
    dispatchKeydown(trigger, 'Enter');
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  
    // open -> Space should NOT toggle closed in Mode 2
    dispatchKeydown(trigger, ' ');
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  });

  it('trigger does nothing when select is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    host.disabled.set(true);
    fixture.detectChanges();

    dispatchPointerDown(trigger, { button: 0 });
    fixture.detectChanges();
    expect(host.open()).toBe(false);

    dispatchKeydown(trigger, 'Enter');
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('tngSelectTrigger must be inside a tngSelect host (inject token guard)', () => {
    expect(() => {
      const fixture = TestBed.configureTestingModule({
        imports: [TriggerOutsideSelectHostComponent],
      }).createComponent(TriggerOutsideSelectHostComponent);

      fixture.detectChanges();
    }).toThrow();
  });
});