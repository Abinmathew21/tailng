import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu, TngMenuItem, TngMenuSelectEvent, TngMenuTrigger } from '../tng-menu';

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
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
      <button tngMenuItem [tngMenuItemValue]="'b'" data-testid="item-b">Item B</button>
      <button tngMenuItem [tngMenuItemValue]="'c'" disabled data-testid="item-c">Item C</button>
    </div>
  `,
})
class MenuSelectionHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div
      tngMenu
      #menu="tngMenu"
      [closeOnSelect]="false"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
      <button tngMenuItem [tngMenuItemValue]="'b'" data-testid="item-b">Item B</button>
    </div>
  `,
})
class MenuSelectionNoCloseHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <div data-testid="menu-pad">Padding</div>
      <button tngMenuItem [tngMenuItemValue]="'a'" data-testid="item-a">Item A</button>
    </div>
  `,
})
class MenuSelectionPadHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div
      tngMenu
      #menu="tngMenu"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button
        tngMenuItem
        [disabled]="itemADisabled()"
        [tngMenuItemValue]="'a'"
        data-testid="item-a"
      >
        Item A
      </button>
      <button tngMenuItem [tngMenuItemValue]="'b'" data-testid="item-b">Item B</button>
    </div>
  `,
})
class MenuKeyboardDisabledSelectionHostComponent {
  readonly itemADisabled = signal(false);
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

@Component({
  standalone: true,
  imports: [TngMenu, TngMenuItem, TngMenuTrigger],
  template: `
    <button type="button" [tngMenuTrigger]="menu" data-testid="trigger">Open</button>

    <div
      tngMenu
      #menu="tngMenu"
      [closeOnSelect]="false"
      (tngMenuSelect)="onSelect($event)"
      data-testid="menu"
    >
      <button
        tngMenuItem
        tngMenuItemRole="menuitemcheckbox"
        [tngMenuItemChecked]="true"
        [tngMenuItemValue]="'toggle-toolbar'"
        data-testid="item-checkbox"
      >
        Show Toolbar
      </button>
      <button
        tngMenuItem
        tngMenuItemRole="menuitemradio"
        [tngMenuItemChecked]="true"
        [tngMenuItemValue]="'sort-name'"
        data-testid="item-radio-a"
      >
        Sort By Name
      </button>
      <button
        tngMenuItem
        tngMenuItemRole="menuitemradio"
        [tngMenuItemValue]="'sort-date'"
        data-testid="item-radio-b"
      >
        Sort By Date
      </button>
    </div>
  `,
})
class MenuItemVariantSelectionHostComponent {
  readonly events: TngMenuSelectEvent[] = [];

  onSelect(event: TngMenuSelectEvent): void {
    this.events.push(event);
  }
}

describe('tng-menu selection contract', () => {
  it('clicking an enabled item emits one menu-level selection event with pointer trigger and closes the menu by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();
    click(itemA);
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('pressing Enter on the active item emits one menu-level selection event with keyboard trigger and closes the menu by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    keydown(menu, 'Enter');
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('pressing Space on the active item emits one menu-level selection event with keyboard trigger and closes the menu by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();
    keydown(menu, ' ');
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not emit selection when a disabled item is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();
    click(itemC);
    fixture.detectChanges();

    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('keeps the menu open after selection when closeOnSelect is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionNoCloseHostComponent],
    }).createComponent(MenuSelectionNoCloseHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();
    click(itemB);
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'b',
        itemId: itemB.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('does not emit selection when Enter or Space is pressed and there is no active item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    click(trigger);
    fixture.detectChanges();

    keydown(menu, 'Enter');
    keydown(menu, ' ');
    fixture.detectChanges();

    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('does not emit selection when clicking menu padding or background content', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionPadHostComponent],
    }).createComponent(MenuSelectionPadHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const menuPad = fixture.nativeElement.querySelector('[data-testid="menu-pad"]') as HTMLElement;

    click(trigger);
    fixture.detectChanges();
    click(menuPad);
    fixture.detectChanges();

    expect(host.events).toEqual([]);
    expect(menu.getAttribute('data-state')).toBe('open');
  });

  it('moves selection to the next enabled item when the active item becomes disabled before Enter or Space', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuKeyboardDisabledSelectionHostComponent],
    }).createComponent(MenuKeyboardDisabledSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLButtonElement;

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemA.id);

    host.itemADisabled.set(true);
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(itemB.id);

    keydown(menu, 'Enter');
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'b',
        itemId: itemB.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('toggles a menuitemcheckbox checked state on selection', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemVariantSelectionHostComponent],
    }).createComponent(MenuItemVariantSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const checkboxItem = fixture.nativeElement.querySelector(
      '[data-testid="item-checkbox"]',
    ) as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    expect(checkboxItem.getAttribute('aria-checked')).toBe('true');

    click(checkboxItem);
    fixture.detectChanges();
    expect(checkboxItem.getAttribute('aria-checked')).toBe('false');

    click(checkboxItem);
    fixture.detectChanges();
    expect(checkboxItem.getAttribute('aria-checked')).toBe('true');

    expect(host.events).toEqual([
      {
        value: 'toggle-toolbar',
        itemId: checkboxItem.id,
        trigger: 'pointer',
      },
      {
        value: 'toggle-toolbar',
        itemId: checkboxItem.id,
        trigger: 'pointer',
      },
    ]);
  });

  it('keeps only one sibling menuitemradio checked after selecting a different radio item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemVariantSelectionHostComponent],
    }).createComponent(MenuItemVariantSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const radioItemA = fixture.nativeElement.querySelector(
      '[data-testid="item-radio-a"]',
    ) as HTMLButtonElement;
    const radioItemB = fixture.nativeElement.querySelector(
      '[data-testid="item-radio-b"]',
    ) as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    expect(radioItemA.getAttribute('aria-checked')).toBe('true');
    expect(radioItemB.getAttribute('aria-checked')).toBe('false');

    click(radioItemB);
    fixture.detectChanges();

    expect(radioItemA.getAttribute('aria-checked')).toBe('false');
    expect(radioItemB.getAttribute('aria-checked')).toBe('true');
    expect(host.events).toEqual([
      {
        value: 'sort-date',
        itemId: radioItemB.id,
        trigger: 'pointer',
      },
    ]);
  });

  it('fires selection only once on rapid double click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    click(trigger);
    fixture.detectChanges();

    click(itemA);
    click(itemA);
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'pointer',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });

  it('does not fire selection twice when a pointer event arrives after keyboard selection closes the menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuSelectionHostComponent],
    }).createComponent(MenuSelectionHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLButtonElement;

    keydown(trigger, 'ArrowDown');
    fixture.detectChanges();

    keydown(menu, 'Enter');
    click(itemA);
    fixture.detectChanges();

    expect(host.events).toEqual([
      {
        value: 'a',
        itemId: itemA.id,
        trigger: 'keyboard',
      },
    ]);
    expect(menu.getAttribute('data-state')).toBe('closed');
  });
});
