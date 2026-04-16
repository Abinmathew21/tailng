import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenubar, TngMenubarItem } from '../tng-menubar';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarKeyboardHostComponent {}

@Component({
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div dir="rtl" tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarRtlHostComponent {}

@Component({
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar [loop]="loop()" data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarNoWrapHostComponent {
  readonly loop = signal(false);
}

describe('tng-menubar keyboard navigation', () => {
  it('moves focus to the previous top-level item on ArrowLeft', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

    edit.focus();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('wraps focus from the first item to the last item on ArrowLeft', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    expect(document.activeElement).toBe(file);

    keydown(file, 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(view);
  });

  it('wraps focus from the last item to the first item on ArrowRight', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    view.focus();
    expect(document.activeElement).toBe(view);

    keydown(view, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('mirrors ArrowLeft and ArrowRight behavior in RTL', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarRtlHostComponent],
    }).createComponent(MenubarRtlHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    edit.focus();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(file);

    keydown(file, 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);
  });

  it('does not wrap at the ends when loop is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarNoWrapHostComponent],
    }).createComponent(MenubarNoWrapHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    keydown(file, 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(file);

    view.focus();
    keydown(view, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);
  });

  it('moves focus to the first item on Home and the last item on End', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    edit.focus();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);

    keydown(view, 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(file);
  });
});

@Component({
  imports: [
    TngMenubar,
    TngMenubarItem,
    import('../../menu/tng-menu').then(m => m.TngMenu) as any,
    import('../../menu/tng-menu').then(m => m.TngMenuItem) as any,
  ],
  template: `
    <div tngMenubar data-testid="menubar">
      <!-- 1st menu -->
      <button tngMenubarItem [tngMenubarMenu]="menu1" data-testid="item-1">Menu 1</button>
      <div tngMenu #menu1="tngMenu">
        <button tngMenuItem tngMenuItemValue="1">Item 1</button>
      </div>

      <!-- 2nd menu -->
      <button tngMenubarItem [tngMenubarMenu]="menu2" data-testid="item-2">Menu 2</button>
      <div tngMenu #menu2="tngMenu">
        <!-- The trigger for the submenu -->
        <button tngMenuItem [tngMenuItemSubmenu]="submenu2" data-testid="submenu-trigger-2">Submenu 2</button>
        <div tngMenu #submenu2="tngMenu" data-testid="submenu-2">
          <button tngMenuItem tngMenuItemValue="sub-2-val" data-testid="submenu-item">Sub 2 Item</button>
        </div>
      </div>

      <!-- 3rd menu -->
      <button tngMenubarItem [tngMenubarMenu]="menu3" data-testid="item-3">Menu 3</button>
      <div tngMenu #menu3="tngMenu">
        <button tngMenuItem tngMenuItemValue="3">Item 3</button>
      </div>
    </div>
  `,
})
class MenubarSubmenuHostComponent {}

describe('tng-menubar submenu interaction bug', () => {
  it('restores focus to menubar trigger after selecting an item from a submenu', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarSubmenuHostComponent],
    }).createComponent(MenubarSubmenuHostComponent);

    fixture.detectChanges();

    const item1 = fixture.nativeElement.querySelector('[data-testid="item-1"]') as HTMLButtonElement;
    const item2 = fixture.nativeElement.querySelector('[data-testid="item-2"]') as HTMLButtonElement;
    const item3 = fixture.nativeElement.querySelector('[data-testid="item-3"]') as HTMLButtonElement;

    // 2. Using TAB focus into the menubar (lands on first item)
    item1.focus();
    expect(document.activeElement).toBe(item1);

    // 3. Using ARROW key and ENTER key open submenus of 2nd menu
    keydown(item1, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(item2);

    keydown(item2, 'Enter');
    fixture.detectChanges();
    await Promise.resolve(); // allow microtasks

    const submenuTrigger2 = fixture.nativeElement.querySelector('[data-testid="submenu-trigger-2"]') as HTMLButtonElement;
    // Down arrow to go into the menu
    keydown(item2, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(submenuTrigger2);

    // Open submenu overlay using Enter or ArrowRight
    keydown(submenuTrigger2, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();

    const submenuItem = fixture.nativeElement.querySelector('[data-testid="submenu-item"]') as HTMLButtonElement;
    // Enter submenu via arrow down
    keydown(submenuTrigger2, 'ArrowDown');
    fixture.detectChanges();
    expect(document.activeElement).toBe(submenuItem);

    // 4. User ARROW key and ENTER key and select one submenu item from opened overlay
    keydown(submenuItem, 'Enter');
    fixture.detectChanges();
    await Promise.resolve();

    // Menu should close, and focus MUST return to item2!
    expect(document.activeElement).toBe(item2);

    // 5. Now LEFT arrow key should move the focus into first menu
    keydown(item2, 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(item1);
  });
});
