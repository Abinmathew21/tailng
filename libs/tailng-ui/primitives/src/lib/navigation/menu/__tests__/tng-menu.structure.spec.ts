import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngMenu,
  TngMenuGroupLabel,
  TngMenuItem,
  TngMenuSelectEvent,
  TngMenuSeparator,
} from '../tng-menu';

function keydown(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function click(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuSeparator, TngMenuGroupLabel],
  template: `
    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button tngMenuItem data-testid="item-alpha">Alpha</button>
      <div tngMenuSeparator data-testid="separator"></div>
      <div tngMenuGroupLabel data-testid="group-label">Help</div>
      <button tngMenuItem hidden data-testid="item-hidden">Hotel</button>
      <button tngMenuItem inert data-testid="item-inert">India</button>
      <button tngMenuItem data-testid="item-zulu">Zulu</button>
    </div>
  `,
})
class MenuStructureHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  @ViewChild('menu', { static: true }) menu!: TngMenu;

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

describe('tng-menu structure primitives', () => {
  it('skips separators, group labels, hidden items, and inert items during arrow navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuStructureHostComponent],
    }).createComponent(MenuStructureHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const alpha = fixture.nativeElement.querySelector('[data-testid="item-alpha"]') as HTMLButtonElement;
    const zulu = fixture.nativeElement.querySelector('[data-testid="item-zulu"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(alpha.id);

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(zulu.id);
  });

  it('renders separators and group labels as non-focusable, non-selectable structure only', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuStructureHostComponent],
    }).createComponent(MenuStructureHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const separator = fixture.nativeElement.querySelector('[data-testid="separator"]') as HTMLElement;
    const groupLabel = fixture.nativeElement.querySelector('[data-testid="group-label"]') as HTMLElement;

    host.menu.open();
    fixture.detectChanges();

    click(separator);
    click(groupLabel);
    fixture.detectChanges();

    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.hasAttribute('tabindex')).toBe(false);
    expect(groupLabel.getAttribute('role')).toBe('presentation');
    expect(groupLabel.hasAttribute('tabindex')).toBe(false);
    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('ignores separators, group labels, hidden items, and inert items during typeahead', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuStructureHostComponent],
    }).createComponent(MenuStructureHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const alpha = fixture.nativeElement.querySelector('[data-testid="item-alpha"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'ArrowDown');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(alpha.id);

    keydown(menu, 'h');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(alpha.id);

    keydown(menu, 'i');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(alpha.id);
  });
});
