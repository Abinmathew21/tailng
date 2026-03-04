import { Component } from '@angular/core';
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
});
