import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from './tng-select';
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

  it('opens and closes via trigger keyboard (Enter/Space)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();
    expect(host.open()).toBe(true);

    keydown(trigger, { key: ' ' });
    fixture.detectChanges();
    expect(host.open()).toBe(false);
  });

  it('Escape closes when open (handled by tngSelect host)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const selectHost = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    // open programmatically (controlled)
    host.open.set(true);
    fixture.detectChanges();

    expect(selectHost.getAttribute('data-state')).toBe('open');
    expect(content.hasAttribute('hidden')).toBe(false);

    keydown(selectHost, { key: 'Escape' });
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
});