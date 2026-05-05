import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngDropdownMenuComponent } from './tng-dropdown-menu.component';

@Component({
  imports: [TngDropdownMenuComponent],
  template: `
    <tng-dropdown-menu label="Actions">
      <li role="menuitem">Archive</li>
    </tng-dropdown-menu>
  `,
})
class HostComponent {}

describe('tng-dropdown-menu component', () => {
  it('exports the dropdown-menu component', () => {
    expect(typeof TngDropdownMenuComponent).toBe('function');
  });

  it('closes when the page scrolls while open', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).not.toBeNull();

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
  });
});
