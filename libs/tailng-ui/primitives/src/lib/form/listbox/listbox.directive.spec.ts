
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
      [loop]="loop()"
      [value]="value()"
      (valueChange)="value.set($event)"
      tabindex="0"
      data-testid="lb"
    >
      @for (k of order(); track k) {
        @switch (k) {
          @case ('A') {
            @if (showA()) {
              <div
                tngOption
                [tngValue]="'A'"
                [disabled]="disableA()"
                data-testid="opt-a"
              >
                A
              </div>
            }
          }

          @case ('B') {
            @if (showB()) {
              <div
                tngOption
                [tngValue]="'B'"
                [disabled]="disableB()"
                data-testid="opt-b"
              >
                B
              </div>
            }
          }

          @case ('C') {
            @if (showC()) {
              <div
                tngOption
                [tngValue]="'C'"
                [disabled]="disableC()"
                data-testid="opt-c"
              >
                C
              </div>
            }
          }

          @case ('X') {
            @if (showX()) {
              <div
                tngOption
                [tngValue]="'X'"
                [disabled]="disableX()"
                data-testid="opt-x"
              >
                X
              </div>
            }
          }
        }
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

  // selection value
  value = signal<string | readonly string[] | null>(null);

  // show/hide options (DOM add/remove)
  showA = signal(true);
  showB = signal(true);
  showC = signal(true);
  showX = signal(false);

  // disabled flags (dynamic disable/enable)
  disableA = signal(false);
  disableB = signal(false);
  disableC = signal(false);
  disableX = signal(false);

  // dynamic order (reorder/insert)
  order = signal<readonly ('A' | 'B' | 'C' | 'X')[]>(['A', 'B', 'C']);
}

@Component({
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <div
      tngListbox
      [multiple]="false"
      [value]="value()"
      (valueChange)="value.set($event)"
      data-testid="listbox"
    >
      <div tngOption [tngValue]="'a'" data-testid="opt-a">A</div>
      <div tngOption [tngValue]="'b'" data-testid="opt-b">B</div>
      <div tngOption [tngValue]="'c'" data-testid="opt-c">C</div>
    </div>
  `,
})
class HostSingleControlled {
  value = signal<string | null>(null);
}

@Component({
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <div tngListbox [multiple]="false" [value]="value()" (valueChange)="value.set($event)">
      <div tngOption [tngValue]="'a'" data-testid="opt-a">A</div>
      <div tngOption [tngValue]="'b'" data-testid="opt-b">B</div>
      <div tngOption [tngValue]="'c'" [disabled]="true" data-testid="opt-c">C</div>
    </div>
  `,
})
class HostSingleControlledDisabled {
  value = signal<string | null>(null);
}

function keydown(
  el: HTMLElement,
  key: string,
  opts: Partial<KeyboardEventInit> = {},
) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
}

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

describe('tngListbox + tngOption primitives', () => {
  
  beforeAll(() => {
    if (!HTMLElement.prototype.scrollIntoView) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
        value: vi.fn(),
        writable: true,
      });
    }
  });

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

    pointerdown(optC, { button: 0 });
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
  
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
  
    // After first toggle → C selected
    expect(new Set(hostCmp.value() as readonly string[]))
      .toEqual(new Set(['C']));
  
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
  
    // After second toggle → C deselected
    expect(new Set(hostCmp.value() as readonly string[]))
      .toEqual(new Set([]));
  
    expect(optC.getAttribute('aria-selected')).toBe('false');
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

    pointerdown(optB, { button: 0 });
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
  
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
  
    expect(hostCmp.value()).toEqual(['A']);
  
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
  
    expect(hostCmp.value()).toEqual([]);
  });

  it('selects a range with shift+pointerdown in multiple mode', () => {
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
  
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
  
    pointerdown(optC, { button: 0, shiftKey: true });
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as string[]))
      .toEqual(new Set(['A', 'B', 'C']));
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
  
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
  
    // shift range via pointerdown (not click)
    pointerdown(optC, { button: 0, shiftKey: true });
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
    pointerdown(optA, { button: 0 });
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

  it('does not range-select on shift+pointerdown in single mode', () => {
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
  
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
    expect(hostCmp.value()).toBe('A');
  
    // shift selection via pointerdown
    pointerdown(optC, { button: 0, shiftKey: true });
    fixture.detectChanges();
  
    // In single mode, shift has no meaning → just select C
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
  
    pointerdown(optB, { button: 0 });
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

  it('controlled: when external single value points to missing option, selection becomes null', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    // external sets a value that doesn't exist
    hostCmp.value.set('Z' as any);
    fixture.detectChanges();

    // expected: listbox should drop it
    expect(hostCmp.value()).toBeNull();
  });

  it('controlled: when external multi value includes missing option, it is filtered out', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    hostCmp.multiple.set(true);
    fixture.detectChanges();

    hostCmp.value.set(['A', 'Z'] as any);
    fixture.detectChanges();

    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['A']));
  });

  it('controlled: when external multi value includes disabled option, disabled is removed - policy: no disabled selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    hostCmp.multiple.set(true);
    hostCmp.disableB.set(true);
    fixture.detectChanges();

    hostCmp.value.set(['A', 'B'] as any);
    fixture.detectChanges();

    // policy: disabled can't be selected
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['A']));
  });

  it('controlled: external value change updates selection but does not disturb current active id', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    // make active = B via keyboard
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);

    // now controlled selection changes externally
    hostCmp.value.set('C' as any);
    fixture.detectChanges();

    // active should remain B, selection should become C (policy)
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
    expect(hostCmp.value()).toBe('C');
  });


  // ============================================================================
  // 2) Dynamic list changes (insert before active, reorder, remove active option)
  // ============================================================================

  it('keeps the active id stable when a new option is inserted before it', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    // active -> B
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);

    // Insert X at the start
    hostCmp.showX.set(true);
    hostCmp.order.set(['X', 'A', 'B', 'C']);
    fixture.detectChanges();

    // Active should remain B (same id)
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  });

  it('navigation follows new DOM order after reorder', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    // reorder DOM to C, B, A
    hostCmp.order.set(['C', 'B', 'A']);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  });

  it('when the active option is removed from DOM, active moves to next enabled - or clears if none', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    // active -> B
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);

    // remove B
    hostCmp.showB.set(false);
    hostCmp.order.set(['A', 'C']); // keep order consistent
    fixture.detectChanges();

    // Expect: active moves to next enabled (C) - this assumes your controller reconciles on unregister
    // If your policy is "clear active", change expectation to null.
    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  });

  it('focusin does not reset active if active is already set', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    // active -> B
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);

    // trigger focusin
    host.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    // should remain B (not jump to A)
    expect(host.getAttribute('aria-activedescendant')).toBe(optB.id);
  });

  it('typeahead: typing "c" moves active to the first option starting with "c"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;

    keydown(host, 'c');
    fixture.detectChanges();

    expect(host.getAttribute('aria-activedescendant')).toBe(optC.id);
  });

  it('typeahead: skips disabled matches', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    hostCmp.disableC.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;

    keydown(host, 'c');
    fixture.detectChanges();

    // no enabled "c" match -> active stays null (or unchanged)
    expect(host.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('calls scrollIntoView when active changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;

    const spy = vi.spyOn(optA, 'scrollIntoView');

    keydown(host, 'ArrowDown');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('pointerdown can be used for selection without requiring click (optional)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    hostCmp.value.set(null);
    fixture.detectChanges();

    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;

    optA.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();

    expect(hostCmp.value()).toBe('A');
  });


  // ============================================================================
  // 7) Loop + disabled corner: loop=true with only one enabled option
  // ============================================================================

  it('with loop=true and only one enabled option, navigation stays on that option', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);

    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;

    hostCmp.disableB.set(true);
    hostCmp.disableC.set(true);
    hostCmp.loop.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);

    keydown(host, 'ArrowDown');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);

    keydown(host, 'ArrowUp');
    fixture.detectChanges();
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  });

  it('shift+ArrowDown extends contiguous range in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
  
    // ArrowDown -> active A (no selection yet)
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
  
    // Shift+ArrowDown -> extend selection A..B
    keydown(host, 'ArrowDown', { shiftKey: true });
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['A', 'B']));
  });
  
  it('shift+ArrowDown keeps extending range as you move', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
  
    keydown(host, 'ArrowDown'); // A active
    fixture.detectChanges();
  
    keydown(host, 'ArrowDown', { shiftKey: true }); // select A..B
    fixture.detectChanges();
  
    keydown(host, 'ArrowDown', { shiftKey: true }); // select A..C
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['A', 'B', 'C']));
  });
  
  it('shift+ArrowDown range selection skips disabled options', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const hostCmp = fixture.componentInstance;
    hostCmp.multiple.set(true);
    hostCmp.disableB.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
  
    keydown(host, 'ArrowDown'); // A active
    fixture.detectChanges();
  
    keydown(host, 'ArrowDown', { shiftKey: true }); // extend to C (B is disabled)
    fixture.detectChanges();
  
    expect(new Set(hostCmp.value() as readonly string[])).toEqual(new Set(['A', 'C']));
  });

  it('sets data-selected on selected options - for Tailwind data-variant styling', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    // select C (use your project helper)
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
  
    // data-selected should exist (attribute presence)
    expect(optC.hasAttribute('data-selected')).toBe(true);
  
    // and aria-selected stays correct too
    expect(optC.getAttribute('aria-selected')).toBe('true');
  
    // sanity: other option isn't selected
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    expect(optA.hasAttribute('data-selected')).toBe(false);
  });

  it('sets data-active on the active option - for Tailwind data-variant styling', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
  
    const host = fixture.nativeElement.querySelector('[data-testid="lb"]') as HTMLElement;
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
  
    // move active to first enabled (A)
    keydown(host, 'ArrowDown');
    fixture.detectChanges();
  
    expect(host.getAttribute('aria-activedescendant')).toBe(optA.id);
  
    // data-active should exist on active option
    expect(optA.hasAttribute('data-active')).toBe(true);
  
    // another option should not have it
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    expect(optB.hasAttribute('data-active')).toBe(false);
  });

  it('sets data-disabled on disabled options - for Tailwind data-variant styling', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;
  
    hostCmp.disableB.set(true);
    fixture.detectChanges();
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
  
    expect(optB.getAttribute('aria-disabled')).toBe('true');
    expect(optB.hasAttribute('data-disabled')).toBe(true);
  });

  it('removes data-selected when an option is deselected - multiple toggle', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(true);
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
    expect(optC.hasAttribute('data-selected')).toBe(true);
  
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
    expect(optC.hasAttribute('data-selected')).toBe(false);
  });

  it('controlled: external clear in multiple mode clears internal selection + data-selected', () => {
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
  
    // select A and C via pointerdown
    pointerdown(optA, { button: 0 });
    fixture.detectChanges();
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
  
    expect(optA.getAttribute('aria-selected')).toBe('true');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  
    // now clear externally
    hostCmp.value.set([] as readonly string[]);
    fixture.detectChanges();
  
    // should reflect in UI
    expect(optA.getAttribute('aria-selected')).toBe('false');
    expect(optC.getAttribute('aria-selected')).toBe('false');
  
    // If you add data-selected binding:
    expect(optA.hasAttribute('data-selected')).toBe(false);
    expect(optC.hasAttribute('data-selected')).toBe(false);
  });

  it('controlled: external clear in single mode clears internal selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(false);
    hostCmp.value.set(null);
    fixture.detectChanges();
  
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    // select C
    pointerdown(optC, { button: 0 });
    fixture.detectChanges();
  
    expect(hostCmp.value()).toBe('C');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  
    // now clear externally
    hostCmp.value.set(null);
    fixture.detectChanges();
  
    expect(hostCmp.value()).toBeNull();
    expect(optC.getAttribute('aria-selected')).toBe('false');
  });

  it('controlled: external value sets selection (inbound)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).createComponent(TestHostComponent);
  
    fixture.detectChanges();
    const hostCmp = fixture.componentInstance;
  
    hostCmp.multiple.set(false);
    hostCmp.value.set(null);
    fixture.detectChanges();
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
  
    // set externally
    hostCmp.value.set('B' as any);
    fixture.detectChanges();
  
    // UI should reflect external selection
    expect(optB.getAttribute('aria-selected')).toBe('true');
    expect(optB.hasAttribute('data-selected')).toBe(true); // once implemented
  });

  it('controlled: external multi value sets selection (inbound)', () => {
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
  
    // set externally
    hostCmp.value.set(['C', 'A'] as any);
    fixture.detectChanges();
  
    expect(optA.getAttribute('aria-selected')).toBe('true');
    expect(optC.getAttribute('aria-selected')).toBe('true');
  });
}); 
describe('tngListbox controlled sync', () => {
  it('clears UI selection when external value becomes null', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostSingleControlled],
    }).createComponent(HostSingleControlled);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;

    // select B
    pointerdown(optB);
    fixture.detectChanges();
    expect(optB.getAttribute('aria-selected')).toBe('true');
    expect(optB.hasAttribute('data-selected')).toBe(true);

    // external clear
    host.value.set(null);
    fixture.detectChanges();

    expect(optB.getAttribute('aria-selected')).toBe('false');
    expect(optB.hasAttribute('data-selected')).toBe(false);
  });

  it('selects correct option when external value changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostSingleControlled],
    }).createComponent(HostSingleControlled);
  
    fixture.detectChanges();
    const host = fixture.componentInstance;
  
    const optA = fixture.nativeElement.querySelector('[data-testid="opt-a"]') as HTMLElement;
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    host.value.set('c');
    fixture.detectChanges();
  
    expect(optC.getAttribute('aria-selected')).toBe('true');
    expect(optC.hasAttribute('data-selected')).toBe(true);
  
    expect(optA.getAttribute('aria-selected')).toBe('false');
    expect(optA.hasAttribute('data-selected')).toBe(false);
  });

  it('does not select disabled option when external value points to it', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostSingleControlledDisabled],
    }).createComponent(HostSingleControlledDisabled);
  
    fixture.detectChanges();
    const host = fixture.componentInstance;
  
    const optC = fixture.nativeElement.querySelector('[data-testid="opt-c"]') as HTMLElement;
  
    host.value.set('c');
    fixture.detectChanges();
  
    expect(optC.getAttribute('aria-disabled')).toBe('true');
    expect(optC.getAttribute('aria-selected')).toBe('false');
    expect(optC.hasAttribute('data-selected')).toBe(false);
  });

  it('does not thrash when setting external value repeatedly to same value', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostSingleControlled],
    }).createComponent(HostSingleControlled);
  
    fixture.detectChanges();
    const host = fixture.componentInstance;
  
    host.value.set('b');
    fixture.detectChanges();
  
    // same again: should not cause any visible change / no instability
    host.value.set('b');
    fixture.detectChanges();
  
    const optB = fixture.nativeElement.querySelector('[data-testid="opt-b"]') as HTMLElement;
    expect(optB.getAttribute('aria-selected')).toBe('true');
  });
});