import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngMenuItem } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';
import { TngMenuTriggerFor } from './tng-menu-trigger-for.directive';
import { TngMenuComponent } from './tng-menu.component';
import { TngButtonComponent } from '../../utility/button/tng-button.component';

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

@Component({
  imports: [TngButtonComponent, TngMenuComponent, TngMenuItem, TngMenuTriggerFor],
  template: `
    <tng-button id="button-trigger-host" [tngMenuTriggerFor]="menu" data-testid="trigger">
      Options
    </tng-button>
    <tng-menu #menu="tngMenu" ariaLabel="Options" data-testid="menu">
      <button type="button" tngMenuItem data-testid="item">Pin</button>
    </tng-menu>
  `,
})
class ButtonTriggerHostComponent {}

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

  it('uses the inner native button as the trigger target for tng-button hosts', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ButtonTriggerHostComponent],
    }).createComponent(ButtonTriggerHostComponent);

    fixture.detectChanges();

    const hostTrigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const innerTrigger = hostTrigger.querySelector('button')!;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(hostTrigger.getAttribute('data-slot')).toBeNull();
    expect(hostTrigger.getAttribute('aria-haspopup')).toBeNull();
    expect(hostTrigger.id).toBe('button-trigger-host');
    expect(innerTrigger.id).toMatch(/^tng-menu-trigger-/);
    expect(innerTrigger.getAttribute('data-slot')).toBe('menu-trigger');
    expect(innerTrigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(innerTrigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(innerTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(menu.getAttribute('aria-labelledby')).toBe(innerTrigger.id);

    innerTrigger.click();
    fixture.detectChanges();

    expect(innerTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(menu.getAttribute('data-state')).toBe('open');
    expect(menu.getAttribute('aria-labelledby')).toBe(innerTrigger.id);
  });

  it('restores focus to the inner native button after selecting from a tng-button trigger menu', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ButtonTriggerHostComponent],
    }).createComponent(ButtonTriggerHostComponent);

    fixture.detectChanges();

    const hostTrigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    const innerTrigger = hostTrigger.querySelector('button')!;
    const item = fixture.nativeElement.querySelector('[data-testid="item"]') as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    innerTrigger.click();
    fixture.detectChanges();

    item.click();
    fixture.detectChanges();

    expect(menu.getAttribute('data-state')).toBe('closed');
    expect(innerTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(innerTrigger);
  });
});
