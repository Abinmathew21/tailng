import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TngMenu, TngMenuItem } from '../tng-menu';

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
  imports: [TngMenu, TngMenuItem],
  template: `
    <div tngMenu #menu="tngMenu" data-testid="menu">
      <button tngMenuItem data-testid="item-apple">Apple</button>
      <button tngMenuItem data-testid="item-banana">Banana</button>
      <button tngMenuItem data-testid="item-blueberry">  Blueberry  </button>
      <button tngMenuItem disabled data-testid="item-blackberry">Blackberry</button>
    </div>
  `,
})
class MenuTypeaheadHostComponent {
  @ViewChild('menu', { static: true }) menu!: TngMenu;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('tng-menu typeahead', () => {
  it('moves the active item to the next matching enabled item when typing printable characters', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTypeaheadHostComponent],
    }).createComponent(MenuTypeaheadHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const banana = fixture.nativeElement.querySelector('[data-testid="item-banana"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'b');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(banana.id);
  });

  it('cycles through matching items on repeated key presses and skips disabled matches', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTypeaheadHostComponent],
    }).createComponent(MenuTypeaheadHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const banana = fixture.nativeElement.querySelector('[data-testid="item-banana"]') as HTMLButtonElement;
    const blueberry = fixture.nativeElement.querySelector('[data-testid="item-blueberry"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'b');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(banana.id);

    keydown(menu, 'b');
    fixture.detectChanges();
    expect(menu.getAttribute('aria-activedescendant')).toBe(blueberry.id);
  });

  it('uses a buffered query and resets that buffer after the timeout', () => {
    vi.useFakeTimers();

    const fixture = TestBed.configureTestingModule({
      imports: [MenuTypeaheadHostComponent],
    }).createComponent(MenuTypeaheadHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    const blueberry = fixture.nativeElement.querySelector('[data-testid="item-blueberry"]') as HTMLButtonElement;
    const apple = fixture.nativeElement.querySelector('[data-testid="item-apple"]') as HTMLButtonElement;

    host.menu.open();
    fixture.detectChanges();

    keydown(menu, 'b');
    fixture.detectChanges();
    keydown(menu, 'l');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(blueberry.id);

    vi.advanceTimersByTime(600);

    keydown(menu, 'a');
    fixture.detectChanges();

    expect(menu.getAttribute('aria-activedescendant')).toBe(apple.id);
  });
});
