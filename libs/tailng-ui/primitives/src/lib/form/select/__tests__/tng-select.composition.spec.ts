import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from '../tng-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-select.parts';

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

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  );
}

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectTrigger, TngSelectContent],
  template: `
    <button
      tngSelect
      #api="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        Content
      </div>
    </button>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngSelect;

  open = signal(false);
  disabled = signal(false);
}

describe('tng-select composition', () => {
  it('opens and closes via trigger pointerdown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);

    pointerdown(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);

    pointerdown(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('keyboard: Enter/Space opens; Escape closes', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  
    // Space while open should NOT toggle-close in mode-2
    keydown(trigger, { key: ' ' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('keyboard: ArrowDown opens; Escape closes', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('Escape closes when open - handled by trigger in mode-2', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const selectHost = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    // open programmatically (controlled)
    host.open.set(true);
    fixture.detectChanges();
  
    expect(selectHost.getAttribute('data-state')).toBe('open');
    expect(content.hasAttribute('hidden')).toBe(false);
  
    // Escape is listened on trigger in mode-2
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
  
    expect(selectHost.getAttribute('data-state')).toBe('closed');
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('does not open when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    host.disabled.set(true);
    fixture.detectChanges();

    pointerdown(trigger);
    fixture.detectChanges();

    expect(host.open()).toBe(false);

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
  });

  it('returns focus to trigger when closed via Escape', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    // open
    pointerdown(trigger);
    fixture.detectChanges();
  
    expect(document.activeElement).toBe(trigger);
  
    // close
    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();
  
    expect(document.activeElement).toBe(trigger);
  });
});