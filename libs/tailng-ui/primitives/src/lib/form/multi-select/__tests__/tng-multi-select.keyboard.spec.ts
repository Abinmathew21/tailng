import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMultiSelect } from '../tng-multi-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-multi-select.parts';
import { TngMultiSelectListbox, TngMultiSelectOption } from '../tng-multi-select.listbox';

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }): KeyboardEvent {
  const ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(ev);
  return ev;
}

@Component({
  standalone: true,
  imports: [
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectContent,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  template: `
    <div
      tngMultiSelect
      #api="tngMultiSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="multi-select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <ul tngMultiSelectListbox [multiple]="true" data-testid="listbox">
          <li tngMultiSelectOption [tngValue]="'a'" data-testid="opt-a">A</li>
          <li tngMultiSelectOption [tngValue]="'b'" data-testid="opt-b">B</li>
          <li tngMultiSelectOption [tngValue]="'c'" data-testid="opt-c">C</li>
        </ul>
      </div>
    </div>
  `,
})
class HostComponent {
  @ViewChild('api', { static: true }) api!: TngMultiSelect<string>;
  open = signal(false);
  value = signal<readonly string[]>([]);
}

describe('tng-multi-select keyboard', () => {
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

  it('Escape closes and clears aria-activedescendant', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);
    expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();

    keydown(trigger, { key: 'Escape' });
    fixture.detectChanges();

    expect(host.open()).toBe(false);
    expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('Enter when open toggles active option and overlay STAYS OPEN (multi)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    keydown(trigger, { key: 'Enter' });
    fixture.detectChanges();

    expect(host.value()).toEqual(['a']);
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('Space when open toggles active option and overlay stays open (multi)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    keydown(trigger, { key: 'ArrowDown' });
    fixture.detectChanges();

    expect(host.open()).toBe(true);

    keydown(trigger, { key: ' ' });
    fixture.detectChanges();

    expect(host.value()).toEqual(['a']);
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });
});
