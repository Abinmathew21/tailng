import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngSelect } from './tng-select';
import { TngSelectTrigger } from './tng-select.parts';

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectTrigger],
  template: `
    <div tngSelect [disabled]="disabled" data-testid="root">
      <button tngSelectTrigger data-testid="trigger">Trigger</button>
    </div>
  `,
})
class HostComponent {
  disabled = false;

  @ViewChild(TngSelect, { static: true }) select!: TngSelect;
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

    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    fixture.detectChanges();

    expect(root.getAttribute('data-state')).toBe('closed');
  });

  it('Escape closes when open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('[data-testid="root"]') as HTMLElement;
    const select = fixture.componentInstance.select;

    select.openSelect();
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('open');

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.getAttribute('data-state')).toBe('closed');
  });
});