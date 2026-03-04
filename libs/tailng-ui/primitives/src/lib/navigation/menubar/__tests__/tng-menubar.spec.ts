import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenubar, TngMenubarItem } from '../tng-menubar';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
    </div>
  `,
})
class MenubarHostComponent {}

describe('tng-menubar primitive', () => {
  it('exports the menubar primitive', () => {
    expect(typeof TngMenubar).toBe('function');
  });

  it('applies role="menubar" on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarHostComponent],
    }).createComponent(MenubarHostComponent);

    fixture.detectChanges();

    const menubar = fixture.nativeElement.querySelector('[data-testid="menubar"]') as HTMLElement;

    expect(menubar.getAttribute('role')).toBe('menubar');
  });

  it('applies role="menuitem" to top-level menubar items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarHostComponent],
    }).createComponent(MenubarHostComponent);

    fixture.detectChanges();

    const items = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid^="item-"]'),
    ) as HTMLElement[];

    expect(items).toHaveLength(2);
    expect(items.every((item) => item.getAttribute('role') === 'menuitem')).toBe(true);
  });

  it('moves focus to the next top-level item on ArrowRight', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarHostComponent],
    }).createComponent(MenubarHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;

    file.focus();
    expect(document.activeElement).toBe(file);

    keydown(file, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(edit);
  });
});
