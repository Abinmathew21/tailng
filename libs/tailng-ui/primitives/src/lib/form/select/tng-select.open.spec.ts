import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngSelect } from './tng-select';
import { TngSelectTrigger } from './tng-select.parts';

function keydown(el: HTMLElement, key: string, init: Partial<KeyboardEventInit> = {}) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });

  const stopPropagation = vi.spyOn(event, 'stopPropagation');
  el.dispatchEvent(event);

  return { event, stopPropagation };
}

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectTrigger],
  template: `
    <div tngSelect data-testid="root" [disabled]="disabled">
      <button type="button" tngSelectTrigger data-testid="trigger">Trigger</button>
    </div>
  `,
})
class HostComponent {
  @ViewChild(TngSelect, { static: true }) select!: TngSelect;
  disabled = false;
}


describe('tng-select open/close primitive', () => {
  it('starts closed and exposes data-state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector('[data-testid="root"]') as HTMLElement;

    expect(fixture.componentInstance.select.open()).toBe(false);
    expect(root.getAttribute('data-state')).toBe('closed');
  });

  it('pointerdown on trigger toggles open/close', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('[data-testid="root"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('open');

    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('closed');
  });

  it('does not toggle when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
  
    const root = fixture.nativeElement.querySelector('[data-testid="root"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    // sanity: disabled reflected on trigger in mode-2
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(root.getAttribute('data-state')).toBe('closed');
  
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }));
    fixture.detectChanges();
  
    // should not open
    expect(root.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});


describe('tng-select (mode-2) Escape behavior', () => {
  it('Escape closes when open (keydown on trigger)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('[data-testid="root"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const select = fixture.componentInstance.select;

    select.openSelect();
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('open');

    keydown(trigger, 'Escape');
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('closed');
  });

  it('Escape preventsDefault + stopsPropagation when open (keydown on trigger)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const select = fixture.componentInstance.select;

    select.openSelect();
    fixture.detectChanges();
    expect(select.open()).toBe(true);

    const { event, stopPropagation } = keydown(trigger, 'Escape');
    fixture.detectChanges();

    expect(select.open()).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('Escape does nothing when closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const select = fixture.componentInstance.select;

    expect(select.open()).toBe(false);

    const { event } = keydown(trigger, 'Escape');
    fixture.detectChanges();

    expect(select.open()).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });

  it('Escape is ignored when defaultPrevented is already true', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const select = fixture.componentInstance.select;

    select.openSelect();
    fixture.detectChanges();
    expect(select.open()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault(); // pre-prevent
    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    // stays open because handler bails out when defaultPrevented
    expect(select.open()).toBe(true);
    expect(stopPropagation).not.toHaveBeenCalled();
  });
});