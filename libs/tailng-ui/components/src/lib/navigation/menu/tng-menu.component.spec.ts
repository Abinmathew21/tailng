import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenuComponent } from './tng-menu.component';
import { TngMenuItem } from '@tailng-ui/primitives';

@Component({
  imports: [TngMenuComponent, TngMenuItem],
  template: `
    <tng-menu ariaLabel="Actions" data-testid="menu">
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class HostComponent {}

describe('tng-menu component', () => {
  it('attaches the primitive menu directive to host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;
    expect(menu).toBeTruthy();
    expect(menu.getAttribute('data-slot')).toBe('menu');
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('aria-label')).toBe('Actions');
  });
});
