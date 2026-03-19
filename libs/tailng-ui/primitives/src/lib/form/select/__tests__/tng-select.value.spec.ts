import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from '../tng-select';
import { TngSelectContent, TngSelectTrigger } from '../tng-select.parts';
import { TngSelectListbox, TngSelectOption } from '../tng-select.listbox';

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

function keydown(el: HTMLElement, init: Partial<KeyboardEventInit> = {}): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...init,
    }),
  );
}

@Component({
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
      [disabled]="disabled()"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        <div
          tngSelectListbox
          [disabled]="disabled()"
          [value]="value()"
          (valueChange)="value.set($event)"
          data-testid="listbox"
        >
          <div tngSelectOption [tngValue]="'a'" data-testid="opt-a">A</div>
          <div tngSelectOption [tngValue]="'b'"   [disabled]="optBDisabled()" data-testid="opt-b">B</div>
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
  disabled = signal(false);
  optBDisabled = signal(false);
}

describe('tng-select value primitive', () => {
  it('selecting an option updates value and closes', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    host.optBDisabled.set(false); // ensure enabled
    fixture.detectChanges();
  
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();
  
    expect(host.value()).toBe('b');
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('keeps aria-expanded (trigger) and data-state (host) in sync when closing after selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const selectHost = fixture.nativeElement.querySelector('[data-testid="select"]') as HTMLElement;
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
  
    // open
    pointerdown(triggerEl);
    fixture.detectChanges();
  
    // aria-expanded is on trigger
    expect(triggerEl.getAttribute('aria-expanded')).toBe('true');
    // host still has data-state for styling
    expect(selectHost.getAttribute('data-state')).toBe('open');
  
    // select option A
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    pointerdown(optA);
    fixture.detectChanges();
  
    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
    expect(selectHost.getAttribute('data-state')).toBe('closed');
  });

  it('does NOT auto-open when value changes programmatically while closed', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  
    host.value.set('c');
    fixture.detectChanges();
  
    expect(host.value()).toBe('c');
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('programmatic clear (value -> null) while open keeps the list open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    pointerdown(trigger);
    fixture.detectChanges();
  
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  
    host.value.set(null);
    fixture.detectChanges();
  
    expect(host.value()).toBeNull();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('does not select a disabled option and does not close', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    host.optBDisabled.set(true);
    fixture.detectChanges();
  
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(true);
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();
  
    expect(host.value()).toBeNull();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('does not open via trigger pointerdown when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    host.disabled.set(true);
    fixture.detectChanges();
  
    pointerdown(trigger);
    fixture.detectChanges();
  
    expect(host.open()).toBe(false);
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('ignores option selection when disabled while open - no value change, stays open', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    pointerdown(trigger);
    fixture.detectChanges();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  
    host.disabled.set(true);
    fixture.detectChanges();
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    pointerdown(optB);
    fixture.detectChanges();
  
    expect(host.value()).toBeNull();
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('can still be opened programmatically even when disabled (controlled)', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    host.disabled.set(true);
    host.open.set(true);
    fixture.detectChanges();
  
    expect(host.open()).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('allows programmatic value updates even when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    host.disabled.set(true);
    fixture.detectChanges();
  
    host.value.set('c');
    fixture.detectChanges();
  
    expect(host.value()).toBe('c');
  });

  it('aria-activedescendant updates when navigating and clears on close', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.componentInstance;
  
    const listboxEl = fixture.nativeElement.querySelector('[data-testid="listbox"]') as HTMLElement;
    expect(listboxEl).toBeTruthy();                  // sanity: listbox exists
    expect(host.api.getListboxId?.()).toBeTruthy();  // sanity: listbox registered id to select
  
    const triggerEl = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const contentEl = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;
  
    // closed => none
    expect(host.api.open()).toBe(false);
    expect(triggerEl.getAttribute('aria-activedescendant')).toBeNull();
  
    // open (mode-2: trigger ensures active item on open)
    pointerdown(triggerEl);
    fixture.detectChanges();
  
    expect(host.api.open()).toBe(true);
    expect(contentEl.hasAttribute('hidden')).toBe(false);
  
    const activeOnOpen = triggerEl.getAttribute('aria-activedescendant');
    expect(activeOnOpen).toBeTruthy();
  
    const nodeOnOpen = fixture.nativeElement.querySelector(
      `#${activeOnOpen}`
    );
    expect(nodeOnOpen).toBeTruthy();
  
    // navigate => should change active descendant
    keydown(triggerEl, { key: 'ArrowDown' });
    fixture.detectChanges();
  
    const active1 = triggerEl.getAttribute('aria-activedescendant');
    expect(active1).toBeTruthy();
  
    const node1 = fixture.nativeElement.querySelector(
      `#${active1}`
    ) as HTMLElement | null;
    expect(node1).toBeTruthy();
  
    // navigate again => should change again
    keydown(triggerEl, { key: 'ArrowDown' });
    fixture.detectChanges();
  
    const active2 = triggerEl.getAttribute('aria-activedescendant');
    expect(active2).toBeTruthy();
    expect(active2).not.toBe(active1);
    const node2 = fixture.nativeElement.querySelector(
      `#${active2}`
    ) as HTMLElement | null;
    expect(node2).toBeTruthy();
  
    // close => clears activedescendant
    keydown(triggerEl, { key: 'Escape' });
    fixture.detectChanges();
  
    expect(host.api.open()).toBe(false);
    expect(contentEl.hasAttribute('hidden')).toBe(true);
    expect(triggerEl.getAttribute('aria-activedescendant')).toBeNull();
  });
});