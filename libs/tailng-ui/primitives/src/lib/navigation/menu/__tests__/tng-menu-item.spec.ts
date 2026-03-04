import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenuItem } from '../tng-menu';

@Component({
  standalone: true,
  imports: [TngMenuItem],
  template: `
    <div data-testid="menu">
      <button tngMenuItem data-testid="item-a">A</button>
      <button tngMenuItem [disabled]="itemBDisabled()" data-testid="item-b">B</button>
      <button tngMenuItem id="custom-item-id" data-testid="item-c">C</button>
      <button
        tngMenuItem
        tngMenuItemRole="menuitemcheckbox"
        [tngMenuItemChecked]="checkboxChecked()"
        data-testid="item-d"
      >
        D
      </button>
      <button
        tngMenuItem
        tngMenuItemRole="menuitemradio"
        [tngMenuItemChecked]="radioChecked()"
        data-testid="item-e"
      >
        E
      </button>
    </div>
  `,
})
class MenuItemHostComponent {
  readonly itemBDisabled = signal(true);
  readonly checkboxChecked = signal(true);
  readonly radioChecked = signal(false);
}

describe('tng-menu-item primitive contract', () => {
  it('exports the menu-item primitive', () => {
    expect(typeof TngMenuItem).toBe('function');
  });

  it('applies role="menuitem" and a stable generated id', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLElement;

    expect(itemA.getAttribute('role')).toBe('menuitem');
    expect(itemA.id).toBeTruthy();

    const firstId = itemA.id;
    fixture.detectChanges();

    expect(itemA.id).toBe(firstId);
  });

  it('reflects disabled state with aria-disabled="true"', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLElement;

    expect(itemB.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not set aria-disabled when the item is enabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLElement;

    expect(itemA.hasAttribute('aria-disabled')).toBe(false);
  });

  it('does not generate duplicate ids across generated items and preserves a user-provided id', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemA = fixture.nativeElement.querySelector('[data-testid="item-a"]') as HTMLElement;
    const itemB = fixture.nativeElement.querySelector('[data-testid="item-b"]') as HTMLElement;
    const itemC = fixture.nativeElement.querySelector('[data-testid="item-c"]') as HTMLElement;

    expect(itemA.id).toBeTruthy();
    expect(itemB.id).toBeTruthy();
    expect(itemA.id).not.toBe(itemB.id);
    expect(itemC.id).toBe('custom-item-id');
  });

  it('supports the menuitemcheckbox variant and reflects aria-checked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemD = fixture.nativeElement.querySelector('[data-testid="item-d"]') as HTMLElement;

    expect(itemD.getAttribute('role')).toBe('menuitemcheckbox');
    expect(itemD.getAttribute('aria-checked')).toBe('true');
  });

  it('supports the menuitemradio variant and reflects aria-checked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuItemHostComponent],
    }).createComponent(MenuItemHostComponent);

    fixture.detectChanges();

    const itemE = fixture.nativeElement.querySelector('[data-testid="item-e"]') as HTMLElement;

    expect(itemE.getAttribute('role')).toBe('menuitemradio');
    expect(itemE.getAttribute('aria-checked')).toBe('false');
  });
});
