import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

function click(el: HTMLElement): void {
  el.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
}

function pointerdown(el: HTMLElement): void {
  el.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <div data-testid="menu-pad">Padding</div>
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
      <button tngMenuItem [tngMenuItemValue]="'b'" data-testid="item-b">Item B</button>
    </div>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class MenuDismissHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div tngMenu #menu="tngMenu" [dismissOnOutsideClick]="false" data-testid="menu">
      <div data-testid="menu-pad">Padding</div>
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
    </div>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class MenuDismissDisabledHostComponent {}

describe('tng-menu dismiss behavior', () => {
  it('closes when pointerdown happens outside the open menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDismissHostComponent],
    }).createComponent(MenuDismissHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');

    pointerdown(outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not close when pointerdown happens inside the menu on non-select content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDismissHostComponent],
    }).createComponent(MenuDismissHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const menuPad = fixture.nativeElement.querySelector('[data-testid="menu-pad"]') as HTMLElement;

    click(trigger);
    fixture.detectChanges();

    pointerdown(menuPad);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('does not close on outside pointerdown when dismissOnOutsideClick is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuDismissDisabledHostComponent],
    }).createComponent(MenuDismissDisabledHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    pointerdown(outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
  });
});
