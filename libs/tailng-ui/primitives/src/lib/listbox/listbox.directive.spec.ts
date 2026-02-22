
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngListboxDirective } from './listbox.directive';
import { TngOptionDirective } from './option.directive';

import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <div
      tngListbox
      [multiple]="multiple()"
      [orientation]="orientation()"
      [direction]="direction()"
      [disabled]="listboxDisabled()"
      [value]="value()"
      (valueChange)="value.set($event)"
      tabindex="0"
      data-testid="lb"
      [loop]="loop()"
    >
      <div tngOption [tngValue]="'A'" data-testid="opt-a">A</div>

      @if (showB()) {
        <div tngOption [tngValue]="'B'" [disabled]="disableB()" data-testid="opt-b">B</div>
      }

      @if (showC()) {
        <div tngOption [tngValue]="'C'" data-testid="opt-c">C</div>
      }
    </div>
  `,
})
class TestHostComponent {
  multiple = signal(false);
  orientation = signal<'vertical' | 'horizontal'>('vertical');
  direction = signal<'ltr' | 'rtl'>('ltr');
  listboxDisabled = signal(false);
  loop = signal(true);
  disableB = signal(false);
  showB = signal(true);
  showC = signal(true);

  value = signal<string | readonly string[] | null>(null);
}

function keydown(el: HTMLElement, key: string, extras?: Partial<KeyboardEventInit>) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...extras }));
}

function focusin(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
}

describe('tngListbox + tngOption primitives', () => {
  it('registers options and sets aria-activedescendant on ArrowDown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TngListboxDirective,
        TngOptionDirective,
      ],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    expect(optA.id).toBeTruthy();
    expect(optB.id).toBeTruthy();
    expect(optC.id).toBeTruthy();

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  });

  it('click selects in single mode and updates controlled value', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TngListboxDirective,
        TngOptionDirective,
      ],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    optC.click();
    fixture.detectChanges();

    expect(hostCmp.value()).toBe('C');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  });

  it('toggles selection in multiple mode and updates controlled value as readonly array', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TngListboxDirective,
        TngOptionDirective,
      ],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();

    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    optA.click();
    fixture.detectChanges();
    optC.click();
    fixture.detectChanges();

    const v = hostCmp.value();
    expect(Array.isArray(v)).toBe(true);
    expect(new Set(v as readonly string[])).toEqual(new Set(['A', 'C']));

    expect(optA.getAttribute('aria-selected')).toBe('true');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  });

  it('skips disabled options during navigation and does not select them on click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TngListboxDirective,
        TngOptionDirective,
      ],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    hostCmp.disableB.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    expect(optB.getAttribute('aria-disabled')).toBe('true');

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);

    // next ArrowDown should skip B and land on C (controller behavior)
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);

    optB.click();
    fixture.detectChanges();
    expect(hostCmp.value()).toBeNull();
  });

  it('ctrl+a selects all enabled options in multiple mode via list-navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TngListboxDirective,
        TngOptionDirective,
      ],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.disableB.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;

    keydown(host, 'a', { ctrlKey: true });
    fixture.detectChanges();

    const v = hostCmp.value();
    expect(new Set(v as readonly string[])).toEqual(new Set(['A', 'C']));
  });

  it('sets active option on focus -first enabled-, but does not auto-select', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent, TngListboxDirective, TngOptionDirective],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.disableB.set(true);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
  
    host.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
  
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
    expect(hostCmp.value()).toBeNull();
  });

  it('navigates horizontally with ArrowRight/ArrowLeft', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.orientation.set('horizontal');
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
  
    keydown(host, 'ArrowRight');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  
    keydown(host, 'ArrowRight');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  
    keydown(host, 'ArrowLeft');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  });

  it('reverses horizontal navigation in RTL', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.orientation.set('horizontal');
    hostCmp.direction.set('rtl');
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
  
    keydown(host, 'ArrowRight');
    fixture.detectChanges();
  
    // In RTL, ArrowRight should behave like ArrowLeft in LTR,
    // so first key press should land on first item
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  });

  it('toggles off a selected option in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
  
    optA.click();
    fixture.detectChanges();
  
    expect(hostCmp.value()).toEqual(['A']);
  
    optA.click();
    fixture.detectChanges();
  
    expect(hostCmp.value()).toEqual([]);
  });

  it('selects a range with shift+click in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    optA.click();
    fixture.detectChanges();
  
    optC.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as string[])).toEqual(new Set(['A', 'B', 'C']));
  });

  it('range selection skips disabled options', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(true);
    hostCmp.disableB.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    optA.click();
    fixture.detectChanges();
  
    optC.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as string[])).toEqual(new Set(['A', 'C']));
  });

  it('toggles active item with Spacebar in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
  
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
  
    keydown(host, ' ');
    fixture.detectChanges();
  
    expect(hostCmp.value()).toEqual(['A']);
  });

  it('Home moves to first enabled and End moves to last enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.disableB.set(true);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    keydown(host, 'End');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  
    keydown(host, 'Home');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  });

  it('does nothing when listbox is disabled  - keyboard and click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    hostCmp.listboxDisabled.set(true);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
  
    // keyboard should not set active
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBeNull();
  
    // click should not select
    optA.click();
    fixture.detectChanges();
    expect(hostCmp.value()).toEqual([] as readonly string[]);
  
    // ctrl+a should not select
    keydown(host, 'a', { ctrlKey: true });
    fixture.detectChanges();
    expect(hostCmp.value()).toEqual([] as readonly string[]);
  });

  it('moves active away when the active option becomes disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    // Go to A then B
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  
    // Disable B while it's active -> should move to next enabled (C)
    hostCmp.disableB.set(true);
    fixture.detectChanges();
  
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  });

  it('does not range-select on shift+click in single mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(false);
    hostCmp.value.set(null);
    fixture.detectChanges();
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    optA.click();
    fixture.detectChanges();
    expect(hostCmp.value()).toBe('A');
  
    optC.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
    fixture.detectChanges();
  
    // should simply select C (not A..C)
    expect(hostCmp.value()).toBe('C');
  });

  it('removes a selected option when it is unregistered - option removed from DOM', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
  
    optB.click();
    fixture.detectChanges();
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['B']));
  
    // remove B from DOM -> should no longer be selected
    hostCmp.showB.set(false);
    fixture.detectChanges();
  
    // Expected: selection should drop B
    // If this fails, you likely need to sync external value when unregister deselects internally.
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set([]));
  });

  it('wraps from last to first when loop=true (default)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    // Move to last (C)
    keydown(host, 'End');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  
    // Next should wrap to first (A)
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  });

  it('does not wrap when loop=false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.loop.set(false);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    keydown(host, 'End');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
  
    // stays on last
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  });
}); 