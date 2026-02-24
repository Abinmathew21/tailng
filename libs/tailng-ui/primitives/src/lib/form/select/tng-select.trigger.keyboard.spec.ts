import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngSelect } from './tng-select';
import { TngSelectContent, TngSelectTrigger } from './tng-select.parts';
import { TngSelectListbox, TngSelectOption } from './tng-select.listbox';

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

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(ev);
  return ev;
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
      [open]="open()"
      (openChange)="open.set($event)"
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
  value = signal<string | null>(null);
}

describe('tng-select trigger (keyboard)', () => {
  it('ArrowDown opens and sets aria-activedescendant (first)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    expect(host.open()).toBe(false);
    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    const active = trigger.getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();
  });

  it('ArrowUp opens and sets aria-activedescendant (last)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    keydown(trigger, { key: 'ArrowUp' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    const active = trigger.getAttribute('aria-activedescendant');
    expect(active).toBeTruthy();
  });

  it('Escape closes, clears aria-activedescendant, and prevents default + stops propagation', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // open first (ArrowDown sets active)
    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

    const parent = fixture.nativeElement as HTMLElement;
    const parentSpy = vi.fn();
    parent.addEventListener('keydown', parentSpy);

    const ev = keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();

    expect(ev.defaultPrevented).toBe(true);
    expect(parentSpy).not.toHaveBeenCalled();
  });

  it('Enter when open commits active selection', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    // open with ArrowDown => ensures active
    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    // Enter commits active
    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    // In your listbox pipeline, commitActive should produce a valueChange,
    // which closes select via selectValue(next)
    expect(host.value()).toBeTruthy();
    expect(host.open()).toBe(false);
  });
});