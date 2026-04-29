import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TngMenuComponent } from './tng-menu.component';
import { TngMenuItem } from '@tailng-ui/primitives';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';

@Component({
  imports: [TngMenuComponent, TngMenuItem],
  template: `
    <tng-menu ariaLabel="Actions" data-testid="menu">
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class HostComponent {}

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="trigger">Open</button>
    <tng-menu
      #menu="tngMenu"
      ariaLabel="Actions"
      data-testid="menu"
      style="--tng-menu-z-overlay: 7"
    >
      <button type="button" tngMenuItem>Item</button>
    </tng-menu>
  `,
})
class PositionedHostComponent {}

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

  it('uses the themed z-index chain when positioning the overlay host', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).createComponent(PositionedHostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      left: 24,
      top: 40,
      width: 120,
      height: 36,
      right: 144,
      bottom: 76,
      x: 24,
      y: 40,
      toJSON: () => ({}),
    } as DOMRect);
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 180,
      height: 120,
      right: 180,
      bottom: 120,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    trigger.click();
    fixture.detectChanges();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.detectChanges();

    expect(menu.style.zIndex).toBe(
      'var(--tng-menu-z-overlay, var(--tng-menu-overlay-z-index, var(--tng-z-overlay, 50)))',
    );
  });
});
