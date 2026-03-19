import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem } from '../../menu/tng-menu';
import { TngMenubar, TngMenubarItem } from '../tng-menubar';

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

function mouseenter(el: HTMLElement): void {
  el.dispatchEvent(
    new MouseEvent('mouseenter', {
      bubbles: false,
      cancelable: false,
    }),
  );
}

@Component({
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
      <button
        tngMenubarItem
        [tngMenubarMenu]="editMenu"
        data-testid="item-edit"
      >
        Edit
      </button>
      <button tngMenubarItem disabled data-testid="item-help">Help</button>
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem data-testid="file-new">New</button>
    </div>

    <div tngMenu #editMenu="tngMenu" data-testid="edit-menu">
      <button tngMenuItem data-testid="edit-cut">Cut</button>
    </div>
  `,
})
class MenubarPointerHostComponent {}

describe('tng-menubar pointer and hover behavior', () => {
  it('focuses the top-level item on pointerdown before opening', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarPointerHostComponent],
    }).createComponent(MenubarPointerHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

    pointerdown(file);
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('updates the current menubar item on hover without stealing focus', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarPointerHostComponent],
    }).createComponent(MenubarPointerHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    mouseenter(edit);
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
    expect(file.getAttribute('tabindex')).toBe('-1');
    expect(edit.getAttribute('tabindex')).toBe('0');
  });

  it('switches the open menu when hovering a different top-level item while a menu is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarPointerHostComponent],
    }).createComponent(MenubarPointerHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();
    mouseenter(edit);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('open');
    expect(edit.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not focus or open a disabled item on pointerdown or hover', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarPointerHostComponent],
    }).createComponent(MenubarPointerHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    file.focus();
    fixture.detectChanges();

    pointerdown(help);
    mouseenter(help);
    click(help);
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
  });
});
