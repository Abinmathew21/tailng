import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenubar, TngMenubarItem } from '../tng-menubar';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
    }),
  );
}

@Component({
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      @if (showLeading()) {
        <button id="item-extra" tngMenubarItem data-testid="item-extra">Extra</button>
      }

      <button id="item-file" tngMenubarItem data-testid="item-file">File</button>

      @if (showEdit()) {
        <button id="item-edit" tngMenubarItem data-testid="item-edit">Edit</button>
      }

      <button id="item-view" tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarDynamicHostComponent {
  readonly showLeading = signal(false);
  readonly showEdit = signal(true);
}

describe('tng-menubar dynamic lifecycle', () => {
  it('preserves the last-focused item after rerender when that item still exists', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDynamicHostComponent],
    }).createComponent(MenubarDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;

    edit.focus();
    fixture.detectChanges();

    host.showLeading.set(true);
    fixture.detectChanges();

    const extra = fixture.nativeElement.querySelector('[data-testid="item-extra"]') as HTMLButtonElement;

    expect(document.activeElement).toBe(edit);
    expect(extra.getAttribute('tabindex')).toBe('-1');
    expect(file.getAttribute('tabindex')).toBe('-1');
    expect(edit.getAttribute('tabindex')).toBe('0');
  });

  it('recalculates the roving tabindex when the current tab stop is removed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDynamicHostComponent],
    }).createComponent(MenubarDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;

    edit.focus();
    fixture.detectChanges();

    host.showEdit.set(false);
    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    expect(file.getAttribute('tabindex')).toBe('0');
    expect(view.getAttribute('tabindex')).toBe('-1');
  });

  it('continues keyboard navigation correctly after items are added and removed dynamically', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarDynamicHostComponent],
    }).createComponent(MenubarDynamicHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

    host.showLeading.set(true);
    host.showEdit.set(false);
    fixture.detectChanges();

    file.focus();
    fixture.detectChanges();

    keydown(file, 'ArrowRight');
    fixture.detectChanges();

    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    expect(document.activeElement).toBe(view);
  });
});
