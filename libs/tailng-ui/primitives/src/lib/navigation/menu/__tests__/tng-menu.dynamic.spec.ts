import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem } from '../tng-menu';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    }),
  );
}

@Component({
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu #menu="tngMenu" data-testid="menu">
      @if (showInsertedPrefix()) {
        <button tngMenuItem data-testid="item-x">X</button>
      }

      <button tngMenuItem data-testid="item-a">A</button>

      @if (showItemB()) {
        <button
          tngMenuItem
          [disabled]="itemBDisabled()"
          data-testid="item-b"
        >
          B
        </button>
      }

      <button tngMenuItem data-testid="item-c">C</button>
    </div>
  `,
})
class MenuDynamicHostComponent {
  readonly showInsertedPrefix = signal(false);
  readonly showItemB = signal(true);
  readonly itemBDisabled = signal(false);

  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

@Component({
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu #menu="tngMenu" data-testid="menu">
      @for (item of items(); track item) {
        <button
          tngMenuItem
          [attr.data-testid]="'item-' + item.toLowerCase()"
          [id]="'item-' + item.toLowerCase()"
        >
          {{ item }}
        </button>
      }
    </div>
  `,
})
class MenuOrderHostComponent {
  readonly items = signal<readonly string[]>(['A', 'B', 'C']);

  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

describe('tng-menu dynamic item lifecycle', () => {
  it('moves the active item to the next enabled item when the active item becomes disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDynamicHostComponent],
    }).createComponent(MenuDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    host.itemBDisabled.set(true);
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemC.id);
  });

  it('moves the active item to the next enabled item when the active item is removed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDynamicHostComponent],
    }).createComponent(MenuDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    host.showItemB.set(false);
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemC.id);
  });

  it('keeps the same active item when a new item is inserted before it', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDynamicHostComponent],
    }).createComponent(MenuDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    host.showInsertedPrefix.set(true);
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);
  });

  it('preserves DOM order for navigation across registered items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuOrderHostComponent],
    }).createComponent(MenuOrderHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemC.id);
  });

  it('updates navigation order correctly when registered items reorder in the DOM', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuOrderHostComponent],
    }).createComponent(MenuOrderHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    host.items.set(['C', 'B', 'A']);
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
  });

  it('ignores unregistered menu-like elements for navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuOrderHostComponent],
    }).createComponent(MenuOrderHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    const rogueItem = document.createElement('button');
    rogueItem.id = 'rogue-item';
    rogueItem.setAttribute('tngMenuItem', '');
    rogueItem.textContent = 'Rogue';
    menu.insertBefore(rogueItem, menu.firstChild);

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);
  });
});
