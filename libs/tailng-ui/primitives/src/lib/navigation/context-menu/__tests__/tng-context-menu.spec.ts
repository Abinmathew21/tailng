import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuTrigger } from '../../menu/tng-menu';
import { TngContextMenu, TngContextMenuTrigger } from '../tng-context-menu';

function contextmenu(el: HTMLElement, x = 24, y = 48): MouseEvent {
  const event = new MouseEvent('contextmenu', {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function keydown(el: HTMLElement, key: string, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function pointerdown(el: HTMLElement): PointerEvent {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });

  el.dispatchEvent(event);
  return event;
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <button type="button" data-testid="outside">Outside</button>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
      <button tngMenuItem [tngMenuItemValue]="'paste'" data-testid="item-paste">Paste</button>
    </div>
  `,
})
class ContextMenuHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngContextMenu;
}

@Component({
  standalone: true,
  imports: [TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="missingMenu"
      data-testid="target"
    >
      Target
    </div>
  `,
})
class MissingContextMenuHostComponent {
  readonly missingMenu: TngContextMenu | null = null;
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    @if (showTarget()) {
      <div
        tabindex="0"
        [tngContextMenuTrigger]="menu"
        data-testid="target"
      >
        Target
      </div>
    }

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class ContextMenuTargetTeardownHostComponent {
  readonly showTarget = signal(true);
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class ContextMenuPanelTeardownHostComponent {
  @ViewChild(TngMenu, { static: true }) menu!: TngMenu;
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
      <button tngMenuItem [tngMenuItemValue]="'paste'" disabled data-testid="item-paste">Paste</button>
    </div>
  `,
})
class ContextMenuSelectionHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      [closeOnSelect]="false"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class ContextMenuSelectionNoCloseHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      aria-label="Context actions"
      aria-describedby="hint"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <span id="hint">Hint</span>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class ContextMenuAriaHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      [disabled]="true"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class DisabledLinkedContextMenuHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div
      tabindex="0"
      aria-disabled="true"
      [tngContextMenuTrigger]="menu"
      data-testid="target"
    >
      Target
    </div>

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class DisabledContextTargetHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    <div tabindex="0" [tngContextMenuTrigger]="menuA" data-testid="target-a">Target A</div>
    <div tabindex="0" [tngContextMenuTrigger]="menuB" data-testid="target-b">Target B</div>

    <div tngMenu tngContextMenu #menuA="tngContextMenu" data-testid="menu-a">
      <button tngMenuItem [tngMenuItemValue]="'copy-a'" data-testid="item-a">Copy A</button>
    </div>

    <div tngMenu tngContextMenu #menuB="tngContextMenu" data-testid="menu-b">
      <button tngMenuItem [tngMenuItemValue]="'copy-b'" data-testid="item-b">Copy B</button>
    </div>
  `,
})
class MultipleContextTargetsHostComponent {
  @ViewChild('menuA', { static: true }) menuA!: TngContextMenu;
  @ViewChild('menuB', { static: true }) menuB!: TngContextMenu;
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngContextMenu, TngContextMenuTrigger],
  template: `
    @if (showTarget()) {
      <div
        tabindex="0"
        [tngContextMenuTrigger]="menu"
        data-testid="target"
      >
        Target
      </div>
    }

    <div
      tngMenu
      tngContextMenu
      #menu="tngContextMenu"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="item-copy">Copy</button>
    </div>
  `,
})
class ContextMenuListenerTeardownHostComponent {
  readonly showTarget = signal(true);
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger, TngContextMenu, TngContextMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="regularMenu" data-testid="regular-trigger">
      Regular
    </button>

    <div tngMenu #regularMenu="tngMenu" data-testid="regular-menu">
      <button tngMenuItem [tngMenuItemValue]="'open'" data-testid="regular-item">Open</button>
    </div>

    <div tabindex="0" [tngContextMenuTrigger]="contextMenuRef" data-testid="context-target">
      Context
    </div>

    <div tngMenu tngContextMenu #contextMenuRef="tngContextMenu" data-testid="context-menu">
      <button tngMenuItem [tngMenuItemValue]="'copy'" data-testid="context-item">Copy</button>
    </div>
  `,
})
class ContextMenuMixedTriggersHostComponent {}

describe('tng-context-menu primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the context-menu primitives', () => {
    expect(typeof TngContextMenu).toBe('function');
    expect(typeof TngContextMenuTrigger).toBe('function');
  });

  it('opens on contextmenu, prevents the native menu, and focuses the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(target.getAttribute('aria-haspopup')).toBe('menu');
    expect(target.getAttribute('aria-expanded')).toBe('false');

    const event = contextmenu(target, 12, 34);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(target.getAttribute('aria-controls')).toBe(menu.id);
    expect(target.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
  });

  it('stores pointer anchor state on pointer open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    contextmenu(target, 91, 37);
    fixture.detectChanges();

    expect(host.menu.getAnchorType()).toBe('pointer');
    expect(host.menu.getPointerAnchor()).toEqual({ x: 91, y: 37 });
  });

  it('preserves unrelated user-provided aria attributes on the context target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuAriaHostComponent],
    }).createComponent(ContextMenuAriaHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    expect(target.getAttribute('aria-label')).toBe('Context actions');
    expect(target.getAttribute('aria-describedby')).toBe('hint');
    expect(target.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('does not open when the context target is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledContextTargetHostComponent],
    }).createComponent(DisabledContextTargetHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const pointerEvent = contextmenu(target, 40, 50);
    fixture.detectChanges();

    expect(pointerEvent.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');

    target.focus();
    const keyboardEvent = keydown(target, 'F10', true);
    fixture.detectChanges();

    expect(keyboardEvent.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not open when the linked menu is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledLinkedContextMenuHostComponent],
    }).createComponent(DisabledLinkedContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const pointerEvent = contextmenu(target, 13, 17);
    fixture.detectChanges();

    expect(pointerEvent.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).not.toBe(menu);

    target.focus();
    const keyboardEvent = keydown(target, 'ContextMenu');
    fixture.detectChanges();

    expect(keyboardEvent.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(target);
  });

  it('opens on Shift+F10 using an element anchor and focuses the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    target.focus();
    const event = keydown(target, 'F10', true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(host.menu.getAnchorType()).toBe('element');
    expect(host.menu.getPointerAnchor()).toBeNull();
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
  });

  it('opens on the ContextMenu key using an element anchor and focuses the menu panel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    target.focus();
    const event = keydown(target, 'ContextMenu');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(host.menu.getAnchorType()).toBe('element');
    expect(host.menu.getPointerAnchor()).toBeNull();
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menu);
  });

  it('closes on Escape and restores focus to the context target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    contextmenu(target);
    fixture.detectChanges();

    const event = keydown(menu, 'Escape');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(target.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(target);
  });

  it('closes on outside click and restores focus to the context target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();

    pointerdown(outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(target.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(target);
  });

  it('closes on Tab without restoring focus to the context target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    contextmenu(target);
    fixture.detectChanges();

    const event = keydown(menu, 'Tab');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).not.toBe(target);
  });

  it('closes on Shift+Tab without preventing default or restoring focus to the context target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    contextmenu(target);
    fixture.detectChanges();

    const event = keydown(menu, 'Tab', true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).not.toBe(target);
  });

  it('fails safely when no context menu is linked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MissingContextMenuHostComponent],
    }).createComponent(MissingContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    expect(target.hasAttribute('aria-controls')).toBe(false);
    expect(target.hasAttribute('aria-expanded')).toBe(false);

    expect(() => {
      contextmenu(target);
      keydown(target, 'F10', true);
      keydown(target, 'ContextMenu');
      fixture.detectChanges();
    }).not.toThrow();

    expect(target.hasAttribute('aria-controls')).toBe(false);
    expect(target.hasAttribute('aria-expanded')).toBe(false);
  });

  it('closes the context menu when the context target is destroyed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuTargetTeardownHostComponent],
    }).createComponent(ContextMenuTargetTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    contextmenu(target);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');

    host.showTarget.set(false);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('resets aria-expanded when the context menu panel is destroyed while open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuPanelTeardownHostComponent],
    }).createComponent(ContextMenuPanelTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    contextmenu(target);
    fixture.detectChanges();

    expect(target.getAttribute('aria-expanded')).toBe('true');

    host.menu.ngOnDestroy();

    expect(target.getAttribute('aria-expanded')).toBe('false');
  });

  it('updates the pointer anchor on every contextmenu invocation and keeps the client-coordinate contract', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    contextmenu(target, 12, 34);
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(host.menu.getPointerAnchor()).toEqual({ x: 12, y: 34 });
    expect(menu.getAttribute('aria-activedescendant')).not.toBeNull();

    contextmenu(target, 200, 300);
    fixture.detectChanges();

    expect(host.menu.getAnchorType()).toBe('pointer');
    expect(host.menu.getPointerAnchor()).toEqual({ x: 200, y: 300 });
    expect(menu.getAttribute('aria-activedescendant')).toBeNull();
    expect(document.activeElement).toBe(menu);
  });

  it('supports multiple context targets on the same page without state interference', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultipleContextTargetsHostComponent],
    }).createComponent(MultipleContextTargetsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const targetA = fixture.nativeElement.querySelector('[data-testid="target-a"]') as HTMLDivElement;
    const targetB = fixture.nativeElement.querySelector('[data-testid="target-b"]') as HTMLDivElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const menuB = fixture.nativeElement.querySelector('[data-testid="menu-b"]') as HTMLElement;

    contextmenu(targetA, 10, 20);
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('open');
    expect(menuB.getAttribute('data-state')).toBe('closed');
    expect(host.menuA.getPointerAnchor()).toEqual({ x: 10, y: 20 });

    contextmenu(targetB, 30, 40);
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('closed');
    expect(menuB.getAttribute('data-state')).toBe('open');
    expect(host.menuA.getPointerAnchor()).toEqual({ x: 10, y: 20 });
    expect(host.menuB.getPointerAnchor()).toEqual({ x: 30, y: 40 });
  });

  it('does not interfere with regular menu triggers on the same page', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuMixedTriggersHostComponent],
    }).createComponent(ContextMenuMixedTriggersHostComponent);

    fixture.detectChanges();

    const regularTrigger = fixture.nativeElement.querySelector('[data-testid="regular-trigger"]') as HTMLButtonElement;
    const regularMenu = fixture.nativeElement.querySelector('[data-testid="regular-menu"]') as HTMLElement;
    const contextTarget = fixture.nativeElement.querySelector('[data-testid="context-target"]') as HTMLDivElement;
    const contextMenuEl = fixture.nativeElement.querySelector('[data-testid="context-menu"]') as HTMLElement;

    regularTrigger.click();
    fixture.detectChanges();

    expect(regularMenu.getAttribute('data-state')).toBe('open');
    expect(contextMenuEl.getAttribute('data-state')).toBe('closed');

    contextmenu(contextTarget, 70, 80);
    fixture.detectChanges();

    expect(regularMenu.getAttribute('data-state')).toBe('closed');
    expect(contextMenuEl.getAttribute('data-state')).toBe('open');
    expect(regularTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(contextTarget.getAttribute('aria-expanded')).toBe('true');
  });

  it('removes shared global listeners when the context target is destroyed while open', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuListenerTeardownHostComponent],
    }).createComponent(ContextMenuListenerTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    contextmenu(target);
    fixture.detectChanges();

    host.showTarget.set(false);
    fixture.detectChanges();

    expect(
      removeSpy.mock.calls.some(([type]) => type === 'pointerdown'),
    ).toBe(true);

    removeSpy.mockRestore();
  });

  it('remains stable through rapid open and close sequences', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
    }).createComponent(ContextMenuHostComponent);

    fixture.detectChanges();

    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;

    contextmenu(target, 1, 2);
    fixture.detectChanges();
    keydown(fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement, 'Escape');
    fixture.detectChanges();
    contextmenu(target, 3, 4);
    fixture.detectChanges();
    keydown(fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement, 'Escape');
    fixture.detectChanges();

    expect(target.getAttribute('aria-expanded')).toBe('false');
    expect(
      (fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement).getAttribute('data-state'),
    ).toBe('closed');
  });

  it('emits the canonical menu selection event with trigger=\"pointer\" on right-click open followed by item click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuSelectionHostComponent],
    }).createComponent(ContextMenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemCopy = fixture.nativeElement.querySelector('[data-testid="item-copy"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    itemCopy.click();
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'copy',
        itemId: itemCopy.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('emits the canonical menu selection event with trigger=\"keyboard\" on Shift+F10 open followed by ArrowDown and Enter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuSelectionHostComponent],
    }).createComponent(ContextMenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemCopy = fixture.nativeElement.querySelector('[data-testid="item-copy"]') as HTMLButtonElement;

    target.focus();
    keydown(target, 'F10', true);
    fixture.detectChanges();
    keydown(menu, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemCopy.id);

    keydown(menu, 'Enter');
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'copy',
        itemId: itemCopy.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not emit selection when a disabled context-menu item is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuSelectionHostComponent],
    }).createComponent(ContextMenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemPaste = fixture.nativeElement.querySelector('[data-testid="item-paste"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    itemPaste.click();
    fixture.detectChanges();

    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('keeps the context menu open after selection when closeOnSelect is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ContextMenuSelectionNoCloseHostComponent],
    }).createComponent(ContextMenuSelectionNoCloseHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const target = fixture.nativeElement.querySelector('[data-testid="target"]') as HTMLDivElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemCopy = fixture.nativeElement.querySelector('[data-testid="item-copy"]') as HTMLButtonElement;

    contextmenu(target);
    fixture.detectChanges();
    itemCopy.click();
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'copy',
        itemId: itemCopy.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });
});
