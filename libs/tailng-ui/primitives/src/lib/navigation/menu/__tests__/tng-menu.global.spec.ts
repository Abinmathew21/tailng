import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngContextMenu, TngContextMenuTrigger } from '../../context-menu/tng-context-menu';
import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

function contextmenu(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('contextmenu', {
    clientX: 24,
    clientY: 48,
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
  imports: [TngMenu, TngMenuItem, TngMenuTrigger, TngContextMenu, TngContextMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menuA" data-testid="trigger-a">Open A</button>
    <div tngMenu #menuA="tngMenu" data-testid="menu-a">
      <button tngMenuItem data-testid="item-a">A</button>
    </div>

    <button type="button" [tngMenuTrigger]="menuB" data-testid="trigger-b">Open B</button>
    <div tngMenu #menuB="tngMenu" data-testid="menu-b">
      <button tngMenuItem data-testid="item-b">B</button>
    </div>

    <div tabindex="0" [tngContextMenuTrigger]="contextMenu" data-testid="context-target">Context</div>
    <div tngMenu tngContextMenu #contextMenu="tngContextMenu" data-testid="context-menu">
      <button tngMenuItem data-testid="context-item">C</button>
    </div>
  `,
})
class GlobalSingleOpenHostComponent {}

describe('tng-menu global single-open coordination', () => {
  it('opening menu B closes menu A across independent menu triggers', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GlobalSingleOpenHostComponent],
    }).createComponent(GlobalSingleOpenHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const triggerB = fixture.nativeElement.querySelector('[data-testid="trigger-b"]') as HTMLButtonElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const menuB = fixture.nativeElement.querySelector('[data-testid="menu-b"]') as HTMLElement;

    triggerA.click();
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('open');
    expect(triggerA.getAttribute('aria-expanded')).toBe('true');

    triggerB.click();
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('closed');
    expect(triggerA.getAttribute('aria-expanded')).toBe('false');
    expect(menuB.getAttribute('data-state')).toBe('open');
    expect(triggerB.getAttribute('aria-expanded')).toBe('true');
  });

  it('opening a context menu closes an already-open regular menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GlobalSingleOpenHostComponent],
    }).createComponent(GlobalSingleOpenHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const contextTarget = fixture.nativeElement.querySelector('[data-testid="context-target"]') as HTMLDivElement;
    const contextMenuEl = fixture.nativeElement.querySelector('[data-testid="context-menu"]') as HTMLElement;

    triggerA.click();
    fixture.detectChanges();
    contextmenu(contextTarget);
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('closed');
    expect(triggerA.getAttribute('aria-expanded')).toBe('false');
    expect(contextMenuEl.getAttribute('data-state')).toBe('open');
    expect(contextTarget.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps active state isolated when different menus are opened sequentially on the same page', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GlobalSingleOpenHostComponent],
    }).createComponent(GlobalSingleOpenHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const triggerB = fixture.nativeElement.querySelector('[data-testid="trigger-b"]') as HTMLButtonElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const menuB = fixture.nativeElement.querySelector('[data-testid="menu-b"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;

    triggerA.click();
    fixture.detectChanges();
    keydown(menuA, 'ArrowDown');
    fixture.detectChanges();

    expect(menuA.getAttribute('aria-activedescendant')).toBe(itemA.id);

    triggerB.click();
    fixture.detectChanges();
    keydown(menuB, 'ArrowDown');
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('closed');
    expect(menuA.hasAttribute('aria-activedescendant')).toBe(false);
    expect(menuB.getAttribute('data-state')).toBe('open');
    expect(menuB.getAttribute('aria-activedescendant')).toBe(itemB.id);
  });
});
