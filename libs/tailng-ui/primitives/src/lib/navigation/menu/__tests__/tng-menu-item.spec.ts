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
    </div>
  `,
})
class MenuItemHostComponent {
  readonly itemBDisabled = signal(true);
}

describe('tng-menu-item primitive contract', () => {
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
});
