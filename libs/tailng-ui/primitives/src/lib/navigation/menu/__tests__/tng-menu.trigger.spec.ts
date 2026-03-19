import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TngMenu, TngMenuItem, TngMenuTrigger } from '../tng-menu';

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

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
      <button tngMenuItem data-testid="item-b">Item B</button>
    </div>
  `,
})
class ProgrammaticMenuTriggerHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button
      type="button"
      disabled
      [tngMenuTrigger]="menu"
      data-testid="trigger"
    >
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class DisabledMenuTriggerHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div tngMenu #menu="tngMenu" [disabled]="true" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class DisabledLinkedMenuTriggerHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" data-testid="before">Before</button>

    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
      <button tngMenuItem data-testid="item-b">Item B</button>
    </div>

    <input data-testid="after" />
  `,
})
class MenuTriggerTraversalHostComponent {}

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  nextFocusTarget: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  source.dispatchEvent(event);
  if (!event.defaultPrevented) {
    nextFocusTarget.focus();
  }

  return event;
}

@Component({
  imports: [TngMenuTrigger],
  template: `
    <button
      type="button"
      [tngMenuTrigger]="missingMenu"
      data-testid="trigger"
    >
      Open
    </button>
  `,
})
class MissingMenuTriggerHostComponent {
  readonly missingMenu: TngMenu | null = null;
}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem disabled data-testid="item-a">Item A</button>
      <button tngMenuItem data-testid="item-b">Item B</button>
      <button tngMenuItem data-testid="item-c">Item C</button>
    </div>
  `,
})
class FirstDisabledMenuTriggerHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <span id="hint">Hint</span>
    <button
      type="button"
      aria-label="Actions"
      aria-describedby="hint"
      [tngMenuTrigger]="menu"
      data-testid="trigger"
    >
      Open
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class AriaPreservingMenuTriggerHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menuRef()" data-testid="trigger">
      Open
    </button>

    <div tngMenu #primaryMenuRef="tngMenu" id="primary-menu" data-testid="menu-primary">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>

    <div tngMenu #secondaryMenuRef="tngMenu" id="secondary-menu" data-testid="menu-secondary">
      <button tngMenuItem data-testid="item-b">Item B</button>
    </div>
  `,
})
class DynamicLinkedMenuTriggerHostComponent {
  @ViewChild('primaryMenuRef', { static: true }) primaryMenu!: TngMenu;
  @ViewChild('secondaryMenuRef', { static: true }) secondaryMenu!: TngMenu;

  readonly menuRef = signal<TngMenu | null>(null);

  ngOnInit(): void {
    this.menuRef.set(this.primaryMenu);
  }
}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger-a">
      Open A
    </button>

    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger-b">
      Open B
    </button>

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class SharedMenuTriggersHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menuA" data-testid="trigger-a">
      Open A
    </button>

    <div tngMenu #menuA="tngMenu" data-testid="menu-a">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>

    <button type="button" [tngMenuTrigger]="menuB" data-testid="trigger-b">
      Open B
    </button>

    <div tngMenu #menuB="tngMenu" data-testid="menu-b">
      <button tngMenuItem data-testid="item-b">Item B</button>
    </div>
  `,
})
class MultipleMenuTriggersHostComponent {}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
      Open
    </button>

    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuOpened)="openedCount = openedCount + 1"
      (tngMenuClosed)="closedCount = closedCount + 1"
      data-testid="menu"
    >
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class TriggerIdempotenceHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;

  openedCount = 0;
  closedCount = 0;
}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    @if (showPrimary()) {
      <button type="button" [tngMenuTrigger]="menu" data-testid="trigger-primary">
        Primary
      </button>
    } @else {
      <button type="button" [tngMenuTrigger]="menu" data-testid="trigger-secondary">
        Secondary
      </button>
    }

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <div data-testid="menu-pad">Pad</div>
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class TriggerReplacementHostComponent {
  readonly showPrimary = signal(true);
}

@Component({
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    @if (showTrigger()) {
      <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">
        Open
      </button>
    }

    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-a">Item A</button>
    </div>
  `,
})
class TriggerListenerTeardownHostComponent {
  readonly showTrigger = signal(true);
}

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
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('toggles the linked menu closed on a second click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();
    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
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
    expect(event.defaultPrevented).toBe(true);
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
    expect(event.defaultPrevented).toBe(true);
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
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  it('skips an initial disabled item when ArrowDown opens the menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FirstDisabledMenuTriggerHostComponent],
    }).createComponent(FirstDisabledMenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const firstEnabledItem = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(event.defaultPrevented).toBe(true);
    expect(menu.getAttribute('aria-activedescendant')).toBe(firstEnabledItem.id);
  });

  it('opens the menu on ArrowUp and sets the last enabled item active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const lastItem = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(menu);
    expect(menu.getAttribute('aria-activedescendant')).toBe(lastItem.id);
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

  it('closes the linked menu when Escape is pressed on the trigger while it is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();
    trigger.focus();

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('does nothing when Escape is pressed on the trigger while the menu is already closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
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

  it('allows native Tab traversal to move focus to the next focusable element after closing', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerTraversalHostComponent],
    }).createComponent(MenuTriggerTraversalHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const after = fixture.nativeElement.querySelector('[data-testid="after"]') as HTMLInputElement;

    trigger.click();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(menu, after);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(after);
  });

  it('allows native Shift+Tab traversal to move focus to the previous focusable element after closing', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerTraversalHostComponent],
    }).createComponent(MenuTriggerTraversalHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const before = fixture.nativeElement.querySelector('[data-testid="before"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(menu, before, true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(before);
  });

  it('updates trigger aria state when the linked menu opens and closes programmatically', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuTriggerHostComponent],
    }).createComponent(ProgrammaticMenuTriggerHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    host.menu.open();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    host.menu.close(false);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not open the linked menu when the trigger is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledMenuTriggerHostComponent],
    }).createComponent(DisabledMenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
  });

  it('does not open the linked menu when the linked menu is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DisabledLinkedMenuTriggerHostComponent],
    }).createComponent(DisabledLinkedMenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    trigger.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(clickEvent.defaultPrevented).toBe(false);

    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(keyEvent);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(keyEvent.defaultPrevented).toBe(false);
  });

  it('preserves unrelated user-provided aria attributes on the trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AriaPreservingMenuTriggerHostComponent],
    }).createComponent(AriaPreservingMenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    expect(trigger.getAttribute('aria-label')).toBe('Actions');
    expect(trigger.getAttribute('aria-describedby')).toBe('hint');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('fails safely when no menu is linked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MissingMenuTriggerHostComponent],
    }).createComponent(MissingMenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);

    expect(() => {
      trigger.click();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      fixture.detectChanges();
    }).not.toThrow();

    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    expect(trigger.hasAttribute('aria-expanded')).toBe(false);
  });

  it('updates aria-controls and aria-expanded when the linked menu reference changes dynamically', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DynamicLinkedMenuTriggerHostComponent],
    }).createComponent(DynamicLinkedMenuTriggerHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    expect(trigger.getAttribute('aria-controls')).toBe('primary-menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    host.menuRef.set(host.secondaryMenu);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-controls')).toBe('secondary-menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    host.secondaryMenu.open();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    host.secondaryMenu.close(false);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not prevent default click behavior when opening on click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
  });

  it('does not steal focus back to the trigger when the menu closes due to outside click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    const event = pointerdown(outside);
    if (!event.defaultPrevented) {
      outside.focus();
    }
    fixture.detectChanges();

    expect(document.activeElement).toBe(outside);
    expect(document.activeElement).not.toBe(trigger);
  });

  it('closes the menu on outside click via the shared dismiss logic', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    pointerdown(outside);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not close the menu on inside pointerdown unless selection occurs', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTriggerHostComponent],
    }).createComponent(MenuTriggerHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    pointerdown(menu);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps aria-expanded in sync through rapid open close sequences', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProgrammaticMenuTriggerHostComponent],
    }).createComponent(ProgrammaticMenuTriggerHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    host.menu.open();
    host.menu.close(false);
    host.menu.open();
    host.menu.close(false);
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    host.menu.open();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('keeps trigger state consistent when the same menu is opened and closed by different triggers', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SharedMenuTriggersHostComponent],
    }).createComponent(SharedMenuTriggersHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const triggerB = fixture.nativeElement.querySelector('[data-testid="trigger-b"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    triggerA.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(triggerA.getAttribute('aria-expanded')).toBe('true');
    expect(triggerB.getAttribute('aria-expanded')).toBe('true');

    triggerB.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(triggerA.getAttribute('aria-expanded')).toBe('false');
    expect(triggerB.getAttribute('aria-expanded')).toBe('false');
  });

  it('supports multiple independent trigger instances on the same page', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultipleMenuTriggersHostComponent],
    }).createComponent(MultipleMenuTriggersHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const triggerB = fixture.nativeElement.querySelector('[data-testid="trigger-b"]') as HTMLButtonElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const menuB = fixture.nativeElement.querySelector('[data-testid="menu-b"]') as HTMLElement;

    triggerA.click();
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('open');
    expect(menuB.getAttribute('data-state')).toBe('closed');
    expect(triggerA.getAttribute('aria-expanded')).toBe('true');
    expect(triggerB.getAttribute('aria-expanded')).toBe('false');

    triggerB.click();
    fixture.detectChanges();

    expect(menuA.getAttribute('data-state')).toBe('closed');
    expect(menuB.getAttribute('data-state')).toBe('open');
    expect(triggerA.getAttribute('aria-expanded')).toBe('false');
    expect(triggerB.getAttribute('aria-expanded')).toBe('true');
  });

  it('does not interfere with other triggers linked to other menus', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultipleMenuTriggersHostComponent],
    }).createComponent(MultipleMenuTriggersHostComponent);

    fixture.detectChanges();

    const triggerA = fixture.nativeElement.querySelector('[data-testid="trigger-a"]') as HTMLButtonElement;
    const triggerB = fixture.nativeElement.querySelector('[data-testid="trigger-b"]') as HTMLButtonElement;
    const menuA = fixture.nativeElement.querySelector('[data-testid="menu-a"]') as HTMLElement;
    const menuB = fixture.nativeElement.querySelector('[data-testid="menu-b"]') as HTMLElement;

    expect(triggerA.getAttribute('aria-controls')).toBe(menuA.id);
    expect(triggerB.getAttribute('aria-controls')).toBe(menuB.id);

    triggerA.click();
    fixture.detectChanges();

    expect(triggerB.getAttribute('aria-expanded')).toBe('false');
    expect(menuB.getAttribute('data-state')).toBe('closed');
  });

  it('ignores repeated open requests when already open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerIdempotenceHostComponent],
    }).createComponent(TriggerIdempotenceHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();
    trigger.focus();

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    trigger.dispatchEvent(event);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(host.openedCount).toBe(1);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('ignores repeated close requests when already closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerIdempotenceHostComponent],
    }).createComponent(TriggerIdempotenceHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger.dispatchEvent(closeEvent);
    fixture.detectChanges();

    const redundantCloseEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    trigger.dispatchEvent(redundantCloseEvent);
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(host.closedCount).toBe(1);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(redundantCloseEvent.defaultPrevented).toBe(false);
  });

  it('updates the linked trigger reference when the trigger element is replaced', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TriggerReplacementHostComponent],
    }).createComponent(TriggerReplacementHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstTrigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger-primary"]',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    firstTrigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('aria-labelledby')).toBe(firstTrigger.id);

    host.showPrimary.set(false);
    fixture.detectChanges();

    const secondTrigger = fixture.nativeElement.querySelector(
      '[data-testid="trigger-secondary"]',
    ) as HTMLButtonElement;

    secondTrigger.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('open');
    expect(menu.getAttribute('aria-labelledby')).toBe(secondTrigger.id);
    expect(secondTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('removes shared global listeners when the trigger is destroyed while its menu is open', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const fixture = TestBed.configureTestingModule({
      imports: [TriggerListenerTeardownHostComponent],
    }).createComponent(TriggerListenerTeardownHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    host.showTrigger.set(false);
    fixture.detectChanges();

    expect(
      removeSpy.mock.calls.some(([type]) => type === 'pointerdown'),
    ).toBe(true);

    removeSpy.mockRestore();
  });
});
