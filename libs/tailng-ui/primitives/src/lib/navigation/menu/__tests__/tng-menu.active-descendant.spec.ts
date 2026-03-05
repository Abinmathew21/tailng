import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem } from '../tng-menu';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu tabindex="0" data-testid="menu">
      <button tngMenuItem data-testid="item-a">A</button>
      <button tngMenuItem data-testid="item-b">B</button>
      <button tngMenuItem disabled data-testid="item-c">C</button>
      <button tngMenuItem data-testid="item-d">D</button>
    </div>
  `,
})
class MenuActiveDescendantHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu [loop]="loop()" tabindex="0" data-testid="menu">
      <button tngMenuItem data-testid="item-a">A</button>
      <button tngMenuItem data-testid="item-b">B</button>
      <button tngMenuItem disabled data-testid="item-c">C</button>
      <button tngMenuItem data-testid="item-d">D</button>
    </div>
  `,
})
class MenuLoopConfigHostComponent {
  readonly loop = signal(false);
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu tabindex="0" data-testid="menu">
      <button tngMenuItem disabled data-testid="item-a">A</button>
      <button tngMenuItem disabled data-testid="item-b">B</button>
    </div>
  `,
})
class MenuAllDisabledHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu],
  template: `
    <div tngMenu tabindex="0" data-testid="menu"></div>
  `,
})
class MenuEmptyHostComponent {}

describe('tng-menu active-descendant contract', () => {
  it('keeps focus on the panel and sets aria-activedescendant on first ArrowDown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    menu.focus();
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
  });

  it('updates aria-activedescendant and skips disabled items during ArrowDown navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;
    const itemD = fixture.nativeElement.querySelector('[data-testid="item-d"]') as HTMLButtonElement;

    menu.focus();

    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);
    expect(itemA.hasAttribute('data-active')).toBe(false);
    expect(itemB.hasAttribute('data-active')).toBe(true);
    expect(itemC.hasAttribute('data-active')).toBe(false);
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);
    expect(itemB.hasAttribute('data-active')).toBe(false);
    expect(itemD.hasAttribute('data-active')).toBe(true);
    expect(document.activeElement).toBe(menu);
  });

  it('wraps from the last enabled item to the first enabled item on ArrowDown by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    menu.focus();

    keydown(menu, 'End');
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
    expect(document.activeElement).toBe(menu);
  });

  it('marks menu items as non-tabbable in active-descendant mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const items = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid^="item-"]'),
    ) as HTMLButtonElement[];

    expect(items).toHaveLength(4);
    expect(items.every((item) => item.getAttribute('tabindex') === '-1')).toBe(true);
  });

  it('supports ArrowUp initial activation, backward navigation, and wrap from first to last', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemD = fixture.nativeElement.querySelector('[data-testid="item-d"]') as HTMLButtonElement;

    menu.focus();

    keydown(menu, 'ArrowUp');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowUp');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowUp');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'ArrowUp');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);
    expect(document.activeElement).toBe(menu);
  });

  it('moves to the first enabled item on Home and the last enabled item on End', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuActiveDescendantHostComponent],
    }).createComponent(MenuActiveDescendantHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemD = fixture.nativeElement.querySelector('[data-testid="item-d"]') as HTMLButtonElement;

    menu.focus();

    keydown(menu, 'End');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);

    keydown(menu, 'Home');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
    expect(document.activeElement).toBe(menu);
  });

  it('does not set an active item when all items are disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuAllDisabledHostComponent],
    }).createComponent(MenuAllDisabledHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    menu.focus();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBeNull();
    expect(document.activeElement).toBe(menu);
  });

  it('does not set an active item when the menu has zero items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuEmptyHostComponent],
    }).createComponent(MenuEmptyHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    menu.focus();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBeNull();
    expect(document.activeElement).toBe(menu);
  });

  it('does not wrap at the ends when loop is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuLoopConfigHostComponent],
    }).createComponent(MenuLoopConfigHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLDivElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemD = fixture.nativeElement.querySelector('[data-testid="item-d"]') as HTMLButtonElement;

    menu.focus();

    keydown(menu, 'ArrowUp');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);

    keydown(menu, 'End');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemD.id);
    expect(document.activeElement).toBe(menu);
  });
});
