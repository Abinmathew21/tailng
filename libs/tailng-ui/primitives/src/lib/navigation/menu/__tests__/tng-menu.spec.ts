import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMenu } from '../tng-menu';

@Component({
  standalone: true,
  imports: [TngMenu],
  template: `
    <div tngMenu data-testid="menu"></div>
  `,
})
class MenuHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenu],
  template: `
    <div tngMenu tabindex="0" data-testid="menu"></div>
  `,
})
class MenuTabindexHostComponent {}

describe('tng-menu primitive', () => {
  it('exports the menu primitive', () => {
    expect(typeof TngMenu).toBe('function');
  });

  it('renders role="menu" with a stable generated id on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuHostComponent],
    }).createComponent(MenuHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.id).toBeTruthy();

    const firstId = menu.id;
    fixture.detectChanges();

    expect(menu.id).toBe(firstId);
  });

  it('makes the menu host focusable by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuHostComponent],
    }).createComponent(MenuHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('tabindex')).toBe('-1');
  });

  it('preserves an explicit consumer tabindex on the host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenuTabindexHostComponent],
    }).createComponent(MenuTabindexHostComponent);

    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[data-testid="menu"]') as HTMLElement;

    expect(menu.getAttribute('tabindex')).toBe('0');
  });
});
