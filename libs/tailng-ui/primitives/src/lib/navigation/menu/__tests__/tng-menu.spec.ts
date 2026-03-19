import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu } from '../tng-menu';

@Component({
  imports: [TngMenu],
  template: `
    <div tngMenu data-testid="menu"></div>
  `,
})
class MenuHostComponent {}

@Component({
  imports: [TngMenu],
  template: `
    <div tngMenu tabindex="0" data-testid="menu"></div>
  `,
})
class MenuTabindexHostComponent {}

@Component({
  imports: [TngMenu],
  template: `
    <div tngMenu id="custom-menu-id" data-testid="menu"></div>
  `,
})
class MenuCustomIdHostComponent {}

@Component({
  imports: [TngMenu],
  template: `
    <div tngMenu #menu="tngMenu" data-testid="menu"></div>
  `,
})
class ProgrammaticMenuHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

@Component({
  imports: [TngMenu],
  template: `
    <button type="button" data-testid="before">Before</button>
    <div tngMenu [disabled]="disabled()" #menu="tngMenu" data-testid="menu"></div>
  `,
})
class ProgrammaticDisabledMenuHostComponent {
  readonly disabled = signal(true);

  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

@Component({
  imports: [TngMenu],
  template: `
    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuOpened)="openedCount = openedCount + 1"
      (tngMenuClosed)="closedCount = closedCount + 1"
      data-testid="menu"
    ></div>
  `,
})
class ProgrammaticMenuLifecycleHostComponent {
  openedCount = 0;
  closedCount = 0;

  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

describe('tng-menu primitive', () => {
  it('exports the menu primitive', () => {
    expect(typeof TngMenu).toBe('function');
  });

  it('renders role="menu" with a stable generated id on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuHostComponent],
    }).createComponent(MenuHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.id).toBeTruthy();

    const firstId = menu.id;
    fixture.detectChanges();

    expect(menu.id).toBe(firstId);
  });

  it('makes the menu host focusable by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuHostComponent],
    }).createComponent(MenuHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('tabindex')).toBe('-1');
  });

  it('preserves a user-provided host id', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuCustomIdHostComponent],
    }).createComponent(MenuCustomIdHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.id).toBe('custom-menu-id');
  });

  it('preserves an explicit consumer tabindex on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTabindexHostComponent],
    }).createComponent(MenuTabindexHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('tabindex')).toBe('0');
  });

  it('does not throw when opened and closed programmatically without a trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuHostComponent],
    }).createComponent(ProgrammaticMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(() => {
      host.menu.open();
      fixture.detectChanges();
      host.menu.close(false);
      fixture.detectChanges();
    }).not.toThrow();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not move focus to the menu panel when opening is prevented by a disabled menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticDisabledMenuHostComponent],
    }).createComponent(ProgrammaticDisabledMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const before = fixture.nativeElement.querySelector('[data-testid="before"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    before.focus();
    expect(document.activeElement).toBe(before);

    host.menu.open();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(before);
  });

  it('clears aria-activedescendant when there is no active item on open and after close', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuHostComponent],
    }).createComponent(ProgrammaticMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    host.menu.open();
    fixture.detectChanges();

    expect(menu.hasAttribute('aria-activedescendant')).toBe(false);

    host.menu.close(false);
    fixture.detectChanges();

    expect(menu.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('remains stable under rapid programmatic open and close sequences', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuHostComponent],
    }).createComponent(ProgrammaticMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(() => {
      host.menu.open();
      host.menu.close(false);
      host.menu.open('first');
      host.menu.close(false);
      host.menu.open();
      host.menu.close(false);
      fixture.detectChanges();
    }).not.toThrow();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(menu.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('emits opened and closed lifecycle events when the menu state changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuLifecycleHostComponent],
    }).createComponent(ProgrammaticMenuLifecycleHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    host.menu.open();
    fixture.detectChanges();

    expect(host.openedCount).toBe(1);
    expect(host.closedCount).toBe(0);

    host.menu.close(false);
    fixture.detectChanges();

    expect(host.openedCount).toBe(1);
    expect(host.closedCount).toBe(1);
  });

  it('does not emit duplicate lifecycle events on redundant open and close calls', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuLifecycleHostComponent],
    }).createComponent(ProgrammaticMenuLifecycleHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;

    host.menu.open();
    host.menu.open();
    fixture.detectChanges();

    expect(host.openedCount).toBe(1);
    expect(host.closedCount).toBe(0);

    host.menu.close(false);
    host.menu.close(false);
    fixture.detectChanges();

    expect(host.openedCount).toBe(1);
    expect(host.closedCount).toBe(1);
  });

  it('fails safely when linked to a detached trigger element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuHostComponent],
    }).createComponent(ProgrammaticMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const detachedTrigger = document.createElement('button');
    detachedTrigger.id = 'detached-trigger';

    expect(() => {
      host.menu.setTriggerElement(detachedTrigger);
      host.menu.open();
      fixture.detectChanges();
      host.menu.close(true);
      fixture.detectChanges();
    }).not.toThrow();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });
});
