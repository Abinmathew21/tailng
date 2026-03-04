import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  standalone: true,
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-help">Help</button>
      <button tngMenubarItem data-testid="item-history">History</button>
      <button tngMenubarItem disabled data-testid="item-hidden">Hidden</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarTypeaheadHostComponent {}

afterEach(() => {
  vi.useRealTimers();
});

describe('tng-menubar typeahead', () => {
  it('moves focus to the next matching top-level item when typing printable characters', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTypeaheadHostComponent],
    }).createComponent(MenubarTypeaheadHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    const event = keydown(file, 'v');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(view);
  });

  it('cycles through matching top-level items on repeated key presses and skips disabled matches', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTypeaheadHostComponent],
    }).createComponent(MenubarTypeaheadHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;
    const history = fixture.nativeElement.querySelector('[data-testid="item-history"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    keydown(file, 'h');
    fixture.detectChanges();
    expect(document.activeElement).toBe(help);

    keydown(help, 'h');
    fixture.detectChanges();
    expect(document.activeElement).toBe(history);
  });

  it('resets the typeahead buffer after the timeout', () => {
    vi.useFakeTimers();

    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTypeaheadHostComponent],
    }).createComponent(MenubarTypeaheadHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const help = fixture.nativeElement.querySelector('[data-testid="item-help"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    keydown(file, 'h');
    fixture.detectChanges();
    expect(document.activeElement).toBe(help);

    vi.advanceTimersByTime(600);

    keydown(help, 'v');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);
  });
});
