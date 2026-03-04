import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem } from '../../menu/tng-menu';
import { TngMenubar, TngMenubarItem } from '../tng-menubar';

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
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button
        tngMenubarItem
        [tngMenubarMenu]="fileMenu"
        data-testid="item-file"
      >
        File
      </button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
      <button tngMenuItem [tngMenuItemValue]="'open'" data-testid="file-open">Open</button>
    </div>
  `,
})
class MenubarMenuHostComponent {}

describe('tng-menubar owned menu integration', () => {
  it('applies menu ownership aria attributes only to items that own a menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    expect(file.getAttribute('aria-haspopup')).toBe('menu');
    expect(file.getAttribute('aria-controls')).toBe(fileMenu.id);
    expect(file.getAttribute('aria-expanded')).toBe('false');

    expect(edit.hasAttribute('aria-haspopup')).toBe(false);
    expect(edit.hasAttribute('aria-controls')).toBe(false);
    expect(edit.hasAttribute('aria-expanded')).toBe(false);
  });

  it('opens the owned menu on Enter and focuses the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    keydown(file, 'Enter');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
  });

  it('opens the owned menu on Space and focuses the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    keydown(file, ' ');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
  });

  it('opens the owned menu on ArrowDown and sets the first menu item active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const firstItem = fixture.nativeElement.querySelector('[data-testid="file-new"]') as HTMLButtonElement;

    file.focus();
    keydown(file, 'ArrowDown');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });
});
