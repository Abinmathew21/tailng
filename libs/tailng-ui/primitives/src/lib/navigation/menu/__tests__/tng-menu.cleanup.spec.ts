import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    @if (showTrigger()) {
      <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>
    }

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class MenuTriggerTeardownHostComponent {
  readonly showTrigger = signal(true);
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class MenuPanelTeardownHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

describe('tng-menu cleanup and teardown', () => {
  it('closes the menu when the linked trigger is destroyed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerTeardownHostComponent],
    }).createComponent(MenuTriggerTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');

    host.showTrigger.set(false);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('resets trigger aria-expanded when the menu panel is destroyed while open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuPanelTeardownHostComponent],
    }).createComponent(MenuPanelTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    host.menu.ngOnDestroy();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes the document pointerdown listener when the menu is destroyed', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerTeardownHostComponent],
    }).createComponent(MenuTriggerTeardownHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    fixture.destroy();

    expect(
      removeSpy.mock.calls.some(([type]) => type === 'pointerdown'),
    ).toBe(true);

    removeSpy.mockRestore();
  });
});
