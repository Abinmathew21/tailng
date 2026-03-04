import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

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
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
      <button
        tngMenuItem
        [tngMenuItemSubmenu]="submenu"
        data-testid="item-more"
      >
        More
      </button>
      <button tngMenuItem data-testid="item-z">Item Z</button>
    </div>

    <div tngMenu #submenu="tngMenu" data-testid="submenu">
      <button tngMenuItem data-testid="sub-item-a">Sub A</button>
      <button tngMenuItem data-testid="sub-item-b">Sub B</button>
    </div>
  `,
})
class MenuSubmenuHostComponent {}

describe('tng-menu submenu behavior', () => {
  it('opens a submenu on ArrowRight from the active submenu-trigger item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSubmenuHostComponent],
    }).createComponent(MenuSubmenuHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const submenu = fixture.nativeElement.querySelector('[data-testid="submenu"]') as HTMLElement;
    const submenuTrigger = fixture.nativeElement.querySelector('[data-testid="item-more"]') as HTMLButtonElement;
    const firstSubItem = fixture.nativeElement.querySelector('[data-testid="sub-item-a"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(submenuTrigger.id);

    keydown(menu, 'ArrowRight');
    fixture.detectChanges();

    expect(submenuTrigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(submenuTrigger.getAttribute('aria-controls')).toBe(submenu.id);
    expect(submenuTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(submenu.getAttribute('data-state')).toBe('open');
    expect(submenu.getAttribute('aria-activedescendant')).toBe(firstSubItem.id);
    expect(document.activeElement).toBe(submenu);
  });

  it('closes a submenu on ArrowLeft and returns focus to the parent menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSubmenuHostComponent],
    }).createComponent(MenuSubmenuHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const submenu = fixture.nativeElement.querySelector('[data-testid="submenu"]') as HTMLElement;
    const submenuTrigger = fixture.nativeElement.querySelector('[data-testid="item-more"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowRight');
    fixture.detectChanges();

    keydown(submenu, 'ArrowLeft');
    fixture.detectChanges();

    expect(submenu.getAttribute('data-state')).toBe('closed');
    expect(submenuTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('aria-activedescendant')).toBe(submenuTrigger.id);
    expect(document.activeElement).toBe(menu);
  });

  it('closes the submenu on first Escape and the parent menu on second Escape', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSubmenuHostComponent],
    }).createComponent(MenuSubmenuHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const submenu = fixture.nativeElement.querySelector('[data-testid="submenu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowRight');
    fixture.detectChanges();

    keydown(submenu, 'Escape');
    fixture.detectChanges();

    expect(submenu.getAttribute('data-state')).toBe('closed');
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);

    keydown(menu, 'Escape');
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes the previously open submenu when the parent menu active item moves away from its trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSubmenuHostComponent],
    }).createComponent(MenuSubmenuHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const submenu = fixture.nativeElement.querySelector('[data-testid="submenu"]') as HTMLElement;
    const submenuTrigger = fixture.nativeElement.querySelector('[data-testid="item-more"]') as HTMLButtonElement;
    const itemZ = fixture.nativeElement.querySelector('[data-testid="item-z"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowDown');
    keydown(menu, 'ArrowRight');
    fixture.detectChanges();

    expect(submenu.getAttribute('data-state')).toBe('open');
    expect(submenuTrigger.getAttribute('aria-expanded')).toBe('true');

    menu.focus();
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemZ.id);
    expect(submenu.getAttribute('data-state')).toBe('closed');
    expect(submenuTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
  });
});
