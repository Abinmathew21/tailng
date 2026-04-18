import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenuItem } from '@tailng-ui/primitives';
import { TngMenuComponent } from './tng-menu.component';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';

@Component({
  imports: [TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <button type="button" [tngMenuTriggerFor]="menu" data-testid="trigger">Open</button>
    <tng-menu #menu="tngMenu" ariaLabel="Actions" data-testid="menu">
      <button type="button" tngMenuItem data-testid="item">Item</button>
    </tng-menu>
  `,
})
class HostComponent {}

describe('tng-menu-trigger-for directive', () => {
  it('injects the trigger slot and aria attributes at runtime', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(trigger.getAttribute('data-slot')).toBe('menu-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens and closes the target menu while syncing trigger aria state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(trigger.getAttribute('data-slot')).toBe('menu-trigger');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.getAttribute('data-state')).toBe('open');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('data-state')).toBe('closed');
  });
});
