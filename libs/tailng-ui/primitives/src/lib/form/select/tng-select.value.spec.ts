import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

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

describe('tng-select value primitive', () => {
  it('selecting an option updates value and closes', () => {
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
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);

    // click option B
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();

    expect(host.value()).toBe('b');
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('keeps aria-expanded/data-state in sync when closing after selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const selectEl = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

    pointerdown(trigger);
    fixture.detectChanges();
    expect(selectEl.getAttribute('aria-expanded')).toBe('true');
    expect(selectEl.getAttribute('data-state')).toBe('open');

    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    pointerdown(optA);
    fixture.detectChanges();

    expect(selectEl.getAttribute('aria-expanded')).toBe('false');
    expect(selectEl.getAttribute('data-state')).toBe('closed');
  });
});