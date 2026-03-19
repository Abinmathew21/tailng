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
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem disabled data-testid="item-edit">Edit</button>
      <button
        tngMenubarItem
        disabled
        [tngMenubarMenu]="viewMenu"
        data-testid="item-view"
      >
        View
      </button>
      <button tngMenubarItem data-testid="item-help">Help</button>
    </div>

    <div tngMenu #viewMenu="tngMenu" data-testid="view-menu">
      <button tngMenuItem [tngMenuItemValue]="'zoom-in'" data-testid="view-zoom-in">Zoom In</button>
    </div>
  `,
})
class MenubarDisabledHostComponent {}

describe('tng-menubar disabled item behavior', () => {
  it('reflects disabled state with aria-disabled="true" on top-level items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledHostComponent],
    }).createComponent(MenubarDisabledHostComponent);

    fixture.detectChanges();

    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    expect(edit.getAttribute('aria-disabled')).toBe('true');
    expect(view.getAttribute('aria-disabled')).toBe('true');
  });

  it('skips disabled top-level items during ArrowRight and ArrowLeft navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledHostComponent],
    }).createComponent(MenubarDisabledHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;

    file.focus();
    keydown(file, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(help);

    keydown(help, 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('does not open an owned menu from a disabled top-level item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledHostComponent],
    }).createComponent(MenubarDisabledHostComponent);

    fixture.detectChanges();

    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;
    const viewMenu = fixture.nativeElement.querySelector('[data-testid="view-menu"]') as HTMLElement;

    view.focus();
    const enterEvent = keydown(view, 'Enter');
    fixture.detectChanges();

    expect(viewMenu.getAttribute('data-state')).toBe('closed');
    expect(view.getAttribute('aria-expanded')).toBe('false');
    expect(enterEvent.defaultPrevented).toBe(false);

    const arrowDownEvent = keydown(view, 'ArrowDown');
    fixture.detectChanges();

    expect(viewMenu.getAttribute('data-state')).toBe('closed');
    expect(view.getAttribute('aria-expanded')).toBe('false');
    expect(arrowDownEvent.defaultPrevented).toBe(false);
  });

  it('does nothing when a disabled top-level item is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledHostComponent],
    }).createComponent(MenubarDisabledHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;
    const viewMenu = fixture.nativeElement.querySelector('[data-testid="view-menu"]') as HTMLElement;

    file.focus();
    view.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
    expect(viewMenu.getAttribute('data-state')).toBe('closed');
    expect(view.getAttribute('aria-expanded')).toBe('false');
  });
});
