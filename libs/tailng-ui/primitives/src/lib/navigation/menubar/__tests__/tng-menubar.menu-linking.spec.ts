import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenu, TngMenuItem } from '../../menu/tng-menu';
import { TngMenubar, TngMenubarItem } from '../tng-menubar';

@Component({
  imports: [TngMenubar, TngMenubarItem, TngMenu, TngMenuItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <div>
        <div tngMenu #fileMenu="tngMenu" data-testid="file-menu">
          <button tngMenuItem [tngMenuItemValue]="'new'" data-testid="file-new">New</button>
        </div>
        <button tngMenubarItem [tngMenubarMenu]="fileMenu" data-testid="item-file">File</button>
      </div>
    </div>
  `,
})
class MenubarPrecedingMenuHostComponent {}

describe('tng-menubar menu linking', () => {
  it('does not throw when an owned menu appears before its menubar item in the DOM', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarPrecedingMenuHostComponent],
    }).createComponent(MenubarPrecedingMenuHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;

    expect(fileMenu.getAttribute('aria-labelledby')).toBe(file.id);
  });
});
