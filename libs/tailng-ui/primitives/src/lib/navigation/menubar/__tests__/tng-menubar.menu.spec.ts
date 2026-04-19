import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TngMenu, TngMenuItem, TngMenuSelectEvent } from '../../menu/tng-menu';
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
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem disabled [tngMenuItemValue]="'new'" data-testid="file-new-disabled">
        New
      </button>
      <button tngMenuItem [tngMenuItemValue]="'open'" data-testid="file-open-enabled">Open</button>
    </div>
  `,
})
class MenubarDisabledFirstItemHostComponent {}

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
    </div>

    <button type="button" data-testid="outside">Outside</button>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>

    <div tngMenu #editMenu="tngMenu" data-testid="edit-menu">
      <button tngMenuItem [tngMenuItemValue]="'cut'" data-testid="edit-cut">Cut</button>
    </div>
  `,
})
class MenubarMultipleMenuHostComponent {}

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
        [tngMenubarMenu]="toolsMenu"
        data-testid="item-tools"
      >
        Tools
      </button>
      <button tngMenubarItem data-testid="item-help">Help</button>
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>

    <div tngMenu #toolsMenu="tngMenu" data-testid="tools-menu">
      <button tngMenuItem [tngMenuItemValue]="'lint'" data-testid="tools-lint">Run lint</button>
    </div>
  `,
})
class MenubarLeafLastItemHostComponent {}

@Component({
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <button type="button" data-testid="before">Before</button>

    <div tngMenubar data-testid="menubar">
      <button
        tngMenubarItem
        [tngMenubarMenu]="fileMenu"
        data-testid="item-file"
      >
        File
      </button>
    </div>

    <input data-testid="after" />

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>
  `,
})
class MenubarTraversalHostComponent {}

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
    </div>

    <div
      tngMenu
      #fileMenu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="file-menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>
  `,
})
class MenubarSelectionDelegationHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
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
      <button tngMenubarItem data-testid="item-help">Help</button>
    </div>

    <div
      tngMenu
      #fileMenu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="file-menu"
    >
      <button
        tngMenuItem
        [tngMenuItemSubmenu]="importMenu"
        [tngMenuItemValue]="'import-from-source'"
        data-testid="file-import"
      >
        Import from...
      </button>
      <button
        tngMenuItem
        [tngMenuItemValue]="'archive-project'"
        data-testid="file-archive"
      >
        Archive
      </button>
    </div>

    <div
      tngMenu
      #importMenu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="import-menu"
    >
      <button
        tngMenuItem
        [tngMenuItemValue]="'import-csv'"
        data-testid="import-csv"
      >
        CSV file
      </button>
      <button
        tngMenuItem
        [tngMenuItemSubmenu]="gitMenu"
        [tngMenuItemValue]="'import-git'"
        data-testid="import-git"
      >
        Git repository
      </button>
    </div>

    <div
      tngMenu
      #gitMenu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="git-menu"
    >
      <button
        tngMenuItem
        [tngMenuItemValue]="'import-github'"
        data-testid="git-github"
      >
        GitHub
      </button>
      <button
        tngMenuItem
        [tngMenuItemValue]="'import-gitlab'"
        data-testid="git-gitlab"
      >
        GitLab
      </button>
    </div>
  `,
})
class MenubarCascadedSubmenuHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button
        tngMenubarItem
        [tngMenubarMenu]="fileMenu() ?? null"
        data-testid="item-file"
      >
        File
      </button>
    </div>

    @if (showMenu()) {
      <div tngMenu #fileMenuRef="tngMenu" data-testid="file-menu">
        <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
      </div>
    }
  `,
})
class MenubarTransientMenuHostComponent {
  readonly showMenu = signal(true);
  readonly fileMenu = viewChild<TngMenu>('fileMenuRef');
}

@Component({
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      @if (showOwner()) {
        <button
          tngMenubarItem
          [tngMenubarMenu]="fileMenu"
          data-testid="item-file"
        >
          File
        </button>
      }

      <button tngMenubarItem data-testid="item-help">Help</button>
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>
  `,
})
class MenubarTransientOwnerHostComponent {
  readonly showOwner = signal(true);
}

@Component({
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button
        tngMenubarItem
        [tngMenubarMenu]="fileMenu() ?? null"
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
    </div>

    @if (showFileMenu()) {
      <div tngMenu #fileMenuRef="tngMenu" data-testid="file-menu">
        <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
      </div>
    }

    <div tngMenu #editMenu="tngMenu" data-testid="edit-menu">
      <button tngMenuItem [tngMenuItemValue]="'cut'" data-testid="edit-cut">Cut</button>
    </div>
  `,
})
class MenubarTransientOpenStateHostComponent {
  readonly showFileMenu = signal(true);
  readonly fileMenu = viewChild<TngMenu>('fileMenuRef');
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
        <span tabindex="0" data-testid="item-file-label">File</span>
      </button>
    </div>

    <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
      <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
    </div>
  `,
})
class MenubarNestedContentHostComponent {}

function click(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', {
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

function mouseenter(el: HTMLElement): MouseEvent {
  const event = new MouseEvent('mouseenter', {
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

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

afterEach(() => {
  TestBed.resetTestingModule();
});

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

  it('opens the owned menu on ArrowUp and sets the last menu item active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const lastItem = fixture.nativeElement.querySelector('[data-testid="file-open"]') as HTMLButtonElement;

    file.focus();
    keydown(file, 'ArrowUp');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(lastItem.id);
  });

  it('after opening a menu, ArrowDown sets the first menu item as active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const firstItem = fixture.nativeElement.querySelector('[data-testid="file-new"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    const event = keydown(fileMenu, 'ArrowDown');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  it('after opening a menu, ArrowDown on the owning top-level item moves focus into the panel and sets first item active', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const firstItem = fixture.nativeElement.querySelector('[data-testid="file-new"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    file.focus();
    fixture.detectChanges();

    const event = keydown(file, 'ArrowDown');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(fileMenu);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  it('after opening a menu, ArrowDown sets the second item as active when the first item is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledFirstItemHostComponent],
    }).createComponent(MenubarDisabledFirstItemHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const secondItem = fixture.nativeElement.querySelector('[data-testid="file-open-enabled"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    const event = keydown(fileMenu, 'ArrowDown');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  });

  it('after opening a menu, ArrowDown on the owning top-level item sets second item active when first is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDisabledFirstItemHostComponent],
    }).createComponent(MenubarDisabledFirstItemHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const secondItem = fixture.nativeElement.querySelector('[data-testid="file-open-enabled"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    file.focus();
    fixture.detectChanges();

    const event = keydown(file, 'ArrowDown');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(fileMenu);
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  });

  it('closes the owned menu on Escape and restores focus to the owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    keydown(file, 'Enter');
    fixture.detectChanges();

    keydown(fileMenu, 'Escape');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(file);
  });

  it('closes a click-opened owned menu on Escape and restores focus to the owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');

    const escapeEvent = keydown(fileMenu, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(file);
  });

  it('closes a click-opened owned menu on Escape when keydown happens on the owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    file.focus();
    const escapeEvent = keydown(file, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(file);
  });

  it('closes an owned menu opened by ArrowRight transfer on Escape and restores focus to that owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    const arrowEvent = keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(arrowEvent.defaultPrevented).toBe(true);
    expect(edit.getAttribute('aria-expanded')).toBe('true');
    expect(editMenu.getAttribute('data-state')).toBe('open');

    const escapeEvent = keydown(editMenu, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(edit);
  });

  it('closes an ArrowRight-transferred owned menu on Escape when keydown happens on the owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    edit.focus();
    const escapeEvent = keydown(edit, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(edit);
  });

  it('closes an owned menu opened by ArrowLeft transfer on Escape and restores focus to that owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(edit);
    fixture.detectChanges();

    const arrowEvent = keydown(editMenu, 'ArrowLeft');
    fixture.detectChanges();

    expect(arrowEvent.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');

    const escapeEvent = keydown(fileMenu, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(file);
  });

  it('closes an ArrowLeft-transferred owned menu on Escape when keydown happens on the owning menubar item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(edit);
    fixture.detectChanges();

    keydown(editMenu, 'ArrowLeft');
    fixture.detectChanges();

    file.focus();
    const escapeEvent = keydown(file, 'Escape');
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(file);
  });

  it('closes the owned menu on Shift+Tab without preventing default or restoring focus to the owning item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    keydown(file, 'Enter');
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    fileMenu.dispatchEvent(event);
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(file);
  });

  it('opens the owned menu on click and toggles it closed on a second click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(fileMenu);

    file.focus();
    click(file);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(file);
  });

  it('opening a second top-level item closes the previously open menubar menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();
    click(edit);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('open');
    expect(edit.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(editMenu);
  });

  it('clicking a sibling top-level item with no owned menu closes the open menu without restoring focus to the previous trigger', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    pointerdown(edit);
    click(edit);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(edit.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(edit);
  });

  it('allows clicking a last top-level item with no owned menu and keeps it selected', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarLeafLastItemHostComponent],
    }).createComponent(MenubarLeafLastItemHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const toolsMenu = fixture.nativeElement.querySelector('[data-testid="tools-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    pointerdown(help);
    click(help);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(toolsMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(help.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(help);
  });

  it('allows arrow navigation to a last top-level item with no owned menu and keeps it selected after Enter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarLeafLastItemHostComponent],
    }).createComponent(MenubarLeafLastItemHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const tools = fixture.nativeElement.querySelector('[data-testid="item-tools"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const toolsMenu = fixture.nativeElement.querySelector('[data-testid="tools-menu"]') as HTMLElement;

    file.focus();
    fixture.detectChanges();

    keydown(file, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(tools);

    keydown(tools, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(help);
    expect(help.getAttribute('tabindex')).toBe('0');

    const enterEvent = keydown(help, 'Enter');
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(false);
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(toolsMenu.getAttribute('data-state')).toBe('closed');
    expect(help.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(help);
  });

  it('clicking outside closes a menubar-opened menu and restores focus to the owning item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    pointerdown(outside);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(file);
  });

  it('pressing Escape on a menubar item with no open menu does not change focus or state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    const event = keydown(file, 'Escape');
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(file);
  });

  it('fails safely when open keys are pressed on a top-level item with no menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      edit.focus();

      const enterEvent = keydown(edit, 'Enter');
      const spaceEvent = keydown(edit, ' ');
      const arrowDownEvent = keydown(edit, 'ArrowDown');
      const arrowUpEvent = keydown(edit, 'ArrowUp');
      fixture.detectChanges();

      expect(fileMenu.getAttribute('data-state')).toBe('closed');
      expect(edit.hasAttribute('aria-expanded')).toBe(false);
      expect(enterEvent.defaultPrevented).toBe(false);
      expect(spaceEvent.defaultPrevented).toBe(false);
      expect(arrowDownEvent.defaultPrevented).toBe(false);
      expect(arrowUpEvent.defaultPrevented).toBe(false);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(edit);
    } finally {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });

  it('allows native Tab traversal to move focus to the next focusable element after a menubar menu closes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTraversalHostComponent],
    }).createComponent(MenubarTraversalHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const after = fixture.nativeElement.querySelector('[data-testid="after"]') as HTMLInputElement;

    click(file);
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(fileMenu, after);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(after);
  });

  it('allows native Shift+Tab traversal to move focus to the previous focusable element after a menubar menu closes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTraversalHostComponent],
    }).createComponent(MenubarTraversalHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const before = fixture.nativeElement.querySelector('[data-testid="before"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(fileMenu, before, true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(before);
  });

  it('switches to the next top-level item and opens its menu on ArrowRight while a menubar menu is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('true');
    expect(editMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(editMenu);
  });

  it('moves focus to next top-level item without a menu on ArrowRight and closes the previously open menu when opened by click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    const event = keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(help.getAttribute('aria-expanded')).toBeNull();
    expect(document.activeElement).toBe(help);
  });

  it('moves focus to next top-level item without a menu on ArrowRight and closes the previously open menu when opened by Enter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMenuHostComponent],
    }).createComponent(MenubarMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    file.focus();
    keydown(file, 'Enter');
    fixture.detectChanges();

    const event = keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(help.getAttribute('aria-expanded')).toBeNull();
    expect(document.activeElement).toBe(help);
  });

  it('lets Tab leave an open menubar menu instead of transferring focus to a sibling item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(fileMenu, outside);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(outside);
  });

  it('lets Tab close an owned menu from the owning menubar item and continue to the next focus target', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const outside = fixture.nativeElement.querySelector('[data-testid="outside"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    file.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(file, outside);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(outside);
  });

  it('switches to the next top-level item and opens its menu on ArrowRight when focus is on the owning item while its menu is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    file.focus();
    fixture.detectChanges();

    const event = keydown(file, 'ArrowRight');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('true');
    expect(editMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(editMenu);
  });

  it('switches to the previous top-level item and opens its menu on ArrowLeft when focus is on the owning item while its menu is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(edit);
    fixture.detectChanges();

    edit.focus();
    fixture.detectChanges();

    const event = keydown(edit, 'ArrowLeft');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
  });

  it('switches to the previous top-level item and opens its menu on ArrowLeft while a menubar menu is open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(edit);
    fixture.detectChanges();

    keydown(editMenu, 'ArrowLeft');
    fixture.detectChanges();

    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('true');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
  });

  it('delegates selection to the owned menu instead of the menubar itself', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarSelectionDelegationHostComponent],
    }).createComponent(MenubarSelectionDelegationHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const item = fixture.nativeElement.querySelector('[data-testid="file-new"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    expect(host.events).toEqual([]);

    click(item);
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'new',
        itemId: item.id,
        trigger: 'pointer',
      },
    ]);
  });

  it('allows selecting a cascaded submenu leaf with mouse clicks from a menubar-owned menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarCascadedSubmenuHostComponent],
    }).createComponent(MenubarCascadedSubmenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;
    const importTrigger = fixture.nativeElement.querySelector('[data-testid="file-import"]') as HTMLButtonElement;
    const gitTrigger = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;
    const githubItem = fixture.nativeElement.querySelector('[data-testid="git-github"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('open');

    click(importTrigger);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(importTrigger.getAttribute('aria-expanded')).toBe('true');

    click(gitTrigger);
    fixture.detectChanges();

    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(gitTrigger.getAttribute('aria-expanded')).toBe('true');

    click(githubItem);
    fixture.detectChanges();

    expect(gitMenu.getAttribute('data-state')).toBe('closed');
    expect(importMenu.getAttribute('data-state')).toBe('closed');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(host.events).toEqual([
      {
        value: 'import-github',
        itemId: githubItem.id,
        trigger: 'pointer',
      },
    ]);
  });

  it('resets state correctly after rapid open and close interactions', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarMultipleMenuHostComponent],
    }).createComponent(MenubarMultipleMenuHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    click(file);
    click(file);
    click(edit);
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('false');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(edit.getAttribute('aria-expanded')).toBe('true');
    expect(editMenu.getAttribute('data-state')).toBe('open');

    keydown(editMenu, 'Escape');
    fixture.detectChanges();

    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
    expect(document.activeElement).toBe(edit);
  });

  it('does not leave stale aria-expanded after the owned menu is unmounted while open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTransientMenuHostComponent],
    }).createComponent(MenubarTransientMenuHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

    click(file);
    fixture.detectChanges();

    expect(file.getAttribute('aria-expanded')).toBe('true');

    host.showMenu.set(false);
    fixture.detectChanges();

    expect(file.hasAttribute('aria-expanded')).toBe(false);
    expect(file.hasAttribute('aria-controls')).toBe(false);
  });

  it('closes an open owned menu when its owning menubar item is removed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTransientOwnerHostComponent],
    }).createComponent(MenubarTransientOwnerHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('open');

    host.showOwner.set(false);
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('closed');
  });

  it('does not treat an unmounted owned menu as an open menubar item during sibling hover', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTransientOpenStateHostComponent],
    }).createComponent(MenubarTransientOpenStateHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const editMenu = fixture.nativeElement.querySelector('[data-testid="edit-menu"]') as HTMLElement;

    click(file);
    fixture.detectChanges();

    host.showFileMenu.set(false);
    fixture.detectChanges();

    mouseenter(edit);
    fixture.detectChanges();

    expect(edit.getAttribute('aria-expanded')).toBe('false');
    expect(editMenu.getAttribute('data-state')).toBe('closed');
  });

  it('removes the global pointerdown listener when the menubar host is destroyed with an open menu', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    try {
      const fixture = TestBed.configureTestingModule({
        imports: [MenubarMultipleMenuHostComponent],
      }).createComponent(MenubarMultipleMenuHostComponent);

      fixture.detectChanges();

      const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

      click(file);
      fixture.detectChanges();
      fixture.destroy();

      const pointerAddCalls = addSpy.mock.calls.filter(([type]) => type === 'pointerdown');
      const pointerRemoveCalls = removeSpy.mock.calls.filter(([type]) => type === 'pointerdown');

      expect(pointerAddCalls.length).toBeGreaterThan(0);
      expect(pointerRemoveCalls.length).toBeGreaterThanOrEqual(pointerAddCalls.length);
    } finally {
      addSpy.mockRestore();
      removeSpy.mockRestore();
    }
  });

  it('opens the owned menu when keyboard interaction starts from nested focusable content inside the top-level item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarNestedContentHostComponent],
    }).createComponent(MenubarNestedContentHostComponent);

    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('[data-testid="item-file-label"]') as HTMLSpanElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    label.focus();
    keydown(label, 'Enter');
    fixture.detectChanges();

    expect(fileMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(fileMenu);
  });
});
