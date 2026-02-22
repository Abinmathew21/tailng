
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngListboxDirective } from './listbox.directive';
import { TngOptionDirective } from './option.directive';

@Component({
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  template: `
    <div
      tngListbox
      [multiple]="multiple()"
      [value]="value()"
      (valueChange)="value.set($event)"
      tabindex="0"
      data-testid="lb"
    >
      <div tngOption [tngValue]="'A'" data-testid="opt-a">A</div>
      <div tngOption [tngValue]="'B'" [disabled]="disableB()" data-testid="opt-b">B</div>
      <div tngOption [tngValue]="'C'" data-testid="opt-c">C</div>
    </div>
  `,
})
class TestHostComponent {
  multiple = signal(false);
  disableB = signal(false);
  value = signal<string | readonly string[] | null>(null);
}

function keydown(el: HTMLElement, key: string, extras?: Partial<KeyboardEventInit>) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...extras }));
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
}); 