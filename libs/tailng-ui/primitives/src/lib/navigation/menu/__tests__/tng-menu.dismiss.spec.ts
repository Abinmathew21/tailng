import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu, TngMenuBackdrop, TngMenuItem, TngMenuTrigger } from '../tng-menu';

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

function focusout(el: HTMLElement, relatedTarget: EventTarget | null): void {
  el.dispatchEvent(
    new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget,
    }),
  );
}

@Component({
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

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div tngMenu #menu="tngMenu" [dismissOnFocusout]="true" data-testid="menu">
      <button type="button" data-testid="menu-inside">Inside target</button>
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
    </div>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class MenuFocusoutDismissHostComponent {}

@Component({
  imports: [TngMenu, TngMenuBackdrop, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>
    <div [tngMenuBackdrop]="menu" data-testid="backdrop"></div>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
    </div>
  `,
})
class MenuBackdropDismissHostComponent {}

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

  it('does not close on focusout when focus remains inside the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuFocusoutDismissHostComponent],
    }).createComponent(MenuFocusoutDismissHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const inside = fixture.nativeElement.querySelector('[data-testid="menu-inside"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    focusout(menu, inside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('closes on focusout when focus moves outside the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuFocusoutDismissHostComponent],
    }).createComponent(MenuFocusoutDismissHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    focusout(menu, outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('closes when the linked backdrop is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuBackdropDismissHostComponent],
    }).createComponent(MenuBackdropDismissHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const backdrop = fixture.nativeElement.querySelector('[data-testid="backdrop"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    click(trigger);
    fixture.detectChanges();

    click(backdrop);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });
});
