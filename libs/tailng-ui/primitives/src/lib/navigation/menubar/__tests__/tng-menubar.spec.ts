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

@Component({
  standalone: true,
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem id="custom-file-id" data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarIdentityHostComponent {}

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
    expect(menubar.getAttribute('aria-orientation')).toBe('horizontal');
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

  it('preserves a user-provided top-level id and does not generate duplicate ids across siblings', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarIdentityHostComponent],
    }).createComponent(MenubarIdentityHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    expect(file.id).toBe('custom-file-id');
    expect(edit.id).toBeTruthy();
    expect(view.id).toBeTruthy();
    expect(edit.id).not.toBe(view.id);
  });
});
