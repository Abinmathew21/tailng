import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
      <button tngMenuItem disabled data-testid="item-b">Item B</button>
      <button tngMenuItem data-testid="item-c">Item C</button>
    </div>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class MenuTriggerHostComponent {}

describe('tng-menu trigger integration', () => {
  it('exports the menu-trigger primitive', () => {
    expect(typeof TngMenuTrigger).toBe('function');
  });

  it('opens the menu on click and wires trigger aria attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(menu);
  });

  it('opens the menu and focuses the panel on Enter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(menu);
  });

  it('opens the menu and focuses the panel on Space', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(menu);
  });

  it('opens the menu on ArrowDown and sets the first enabled item active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const firstItem = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  it('closes on Escape and restores focus to the trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    menu.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('closes on Tab without preventing default or restoring focus to the trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    menu.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(trigger);
  });

  it('closes on Shift+Tab without preventing default or restoring focus to the trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    menu.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(trigger);
  });
});
