import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngMenu, TngMenuItem, TngMenuSelectEvent } from '../tng-menu';

function click(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function keydown(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngMenu, TngMenuItem],
  template: `
    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <div
        tngMenuItem
        #itemA="tngMenuItem"
        [tngMenuItemValue]="'alpha'"
        [attr.disabled]="itemADisabled() ? '' : null"
        data-testid="item-a"
      >
        <span data-testid="item-a-icon" aria-hidden="true">*</span>
        <span data-testid="item-a-label">Alpha</span>
        <button type="button" disabled data-testid="item-a-nested-disabled">
          Nested disabled
        </button>
      </div>

      <div tngMenuItem [tngMenuItemValue]="'beta'" data-testid="item-b">
        Beta
      </div>
    </div>
  `,
})
class MenuItemInteractionHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;
  @ViewChild('itemA', { static: true }) itemA!: TngMenuItem;

  readonly itemADisabled = signal(false);
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  imports: [TngMenu, TngMenuItem],
  template: `
    <div
      tngMenu
      #menuA="tngMenu"
      (tngMenuSelect)="eventsA.push($event)"
      data-testid="menu-a"
    >
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">A</button>
    </div>

    <div
      tngMenu
      #menuB="tngMenu"
      (tngMenuSelect)="eventsB.push($event)"
      data-testid="menu-b"
    >
      <button tngMenuItem [tngMenuItemValue]="'b'" data-testid="item-b">B</button>
    </div>
  `,
})
class MenuItemMultipleMenusHostComponent {
  @ViewChild('menuA', { static: true }) menuA!: TngMenu;
  @ViewChild('menuB', { static: true }) menuB!: TngMenu;

  readonly eventsA: TngMenuSelectEvent[] = [];
  readonly eventsB: TngMenuSelectEvent[] = [];
}

describe('tng-menu-item interaction contract', () => {
  it('delegates enabled pointer selection to the parent menu when clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemInteractionHostComponent],
    }).createComponent(MenuItemInteractionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLElement;
    const icon = fixture.nativeElement.querySelector('[data-testid="item-a-icon"]') as HTMLElement;
    const requestSpy = vi.spyOn(host.menu, 'requestSelect');

    host.menu.open();
    fixture.detectChanges();

    click(icon);
    fixture.detectChanges();

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(host.itemA, 'pointer');
    expect(host.events).toEqual([
      {
        value: 'alpha',
        itemId: itemA.id,
        trigger: 'pointer',
      },
    ]);
  });

  it('does not select when click originates from a nested disabled control', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemInteractionHostComponent],
    }).createComponent(MenuItemInteractionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const nestedDisabled = fixture.nativeElement.querySelector(
      '[data-testid="item-a-nested-disabled"]',
    ) as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    click(nestedDisabled);
    fixture.detectChanges();

    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('remains stable under rapid enable and disable toggles', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemInteractionHostComponent],
    }).createComponent(MenuItemInteractionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLElement;

    host.menu.open('first');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);

    host.itemADisabled.set(true);
    fixture.detectChanges();
    host.itemADisabled.set(false);
    fixture.detectChanges();
    host.itemADisabled.set(true);
    fixture.detectChanges();
    host.itemADisabled.set(false);
    fixture.detectChanges();

    expect(itemA.hasAttribute('aria-disabled')).toBe(false);
    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);
  });

  it('does not emit duplicate selection when Enter is pressed repeatedly', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemInteractionHostComponent],
    }).createComponent(MenuItemInteractionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    host.menu.open('first');
    fixture.detectChanges();

    const firstEnter = keydown(menu, 'Enter');
    fixture.detectChanges();
    const secondEnter = keydown(menu, 'Enter');
    fixture.detectChanges();

    expect(firstEnter.defaultPrevented).toBe(true);
    expect(secondEnter.defaultPrevented).toBe(false);
    expect(host.events).toHaveLength(1);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('keeps item interactions isolated across multiple menus on the page', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemMultipleMenusHostComponent],
    }).createComponent(MenuItemMultipleMenusHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;

    host.menuA.open();
    fixture.detectChanges();
    click(itemA);
    fixture.detectChanges();

    host.menuB.open();
    fixture.detectChanges();
    click(itemB);
    fixture.detectChanges();

    expect(host.eventsA).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'pointer',
      },
    ]);
    expect(host.eventsB).toEqual([
      {
        value: 'b',
        itemId: itemB.id,
        trigger: 'pointer',
      },
    ]);
  });
});
