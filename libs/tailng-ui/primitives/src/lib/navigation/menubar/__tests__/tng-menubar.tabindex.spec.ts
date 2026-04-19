import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenubar, TngMenubarItem } from '../tng-menubar';

@Component({
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <button type="button" data-testid="before">Before</button>

    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem disabled data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>

    <button type="button" data-testid="after">After</button>
  `,
})
class MenubarTabindexHostComponent {}

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

function dispatchTabAndSimulateBrowserFocus(
  source: HTMLElement,
  nextFocusTarget: HTMLElement,
  shiftKey = false,
): KeyboardEvent {
  const event = keydown(source, 'Tab', shiftKey);
  if (!event.defaultPrevented) {
    nextFocusTarget.focus();
  }

  return event;
}

describe('tng-menubar roving tabindex contract', () => {
  it('makes only the first enabled top-level item tabbable by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    expect(file.getAttribute('tabindex')).toBe('0');
    expect(edit.getAttribute('tabindex')).toBe('-1');
    expect(view.getAttribute('tabindex')).toBe('-1');
  });

  it('moves the tab stop to the last focused enabled item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    view.focus();
    fixture.detectChanges();

    expect(document.activeElement).toBe(view);
    expect(file.getAttribute('tabindex')).toBe('-1');
    expect(view.getAttribute('tabindex')).toBe('0');
  });

  it('uses the current tab stop as the focus-entry target for the menubar', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    view.focus();
    fixture.detectChanges();

    const currentTabStop = fixture.nativeElement.querySelector(
      '[data-testid="menubar"] [tabindex="0"]',
    ) as HTMLButtonElement;

    currentTabStop.focus();
    fixture.detectChanges();

    expect(currentTabStop).toBe(view);
    expect(document.activeElement).toBe(view);
  });

  it('allows Tab to leave the menubar at the end and Shift+Tab to leave at the start', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    const shiftTabEvent = keydown(file, 'Tab', true);
    view.focus();
    fixture.detectChanges();
    const tabEvent = keydown(view, 'Tab');
    fixture.detectChanges();

    expect(tabEvent.defaultPrevented).toBe(false);
    expect(shiftTabEvent.defaultPrevented).toBe(false);
  });

  it('allows native Tab traversal to move focus to the next focusable element outside the menubar', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;
    const after = fixture.nativeElement.querySelector('[data-testid="after"]') as HTMLButtonElement;

    view.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(view, after);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(after);
  });

  it('allows native Shift+Tab traversal to move focus to the previous focusable element outside the menubar', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const before = fixture.nativeElement.querySelector('[data-testid="before"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(file, before, true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(before);
  });

  it('allows Tab to leave the menubar from a focused item instead of moving to another top-level item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const after = fixture.nativeElement.querySelector('[data-testid="after"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(file, after);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(after);
    expect(file.getAttribute('tabindex')).toBe('0');
    expect(view.getAttribute('tabindex')).toBe('-1');
  });

  it('keeps the current tab stop when Tab leaves the menubar', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const after = fixture.nativeElement.querySelector('[data-testid="after"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(file, after);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(after);
    expect(file.getAttribute('tabindex')).toBe('0');
    expect(view.getAttribute('tabindex')).toBe('-1');
  });

  it('keeps the current tab stop when Shift+Tab leaves the menubar', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarTabindexHostComponent],
    }).createComponent(MenubarTabindexHostComponent);

    fixture.detectChanges();

    const before = fixture.nativeElement.querySelector('[data-testid="before"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    view.focus();
    fixture.detectChanges();

    const event = dispatchTabAndSimulateBrowserFocus(view, before, true);
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(before);
    expect(view.getAttribute('tabindex')).toBe('0');
  });
});
