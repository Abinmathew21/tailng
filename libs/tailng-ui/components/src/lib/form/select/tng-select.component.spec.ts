import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngSelectComponent } from './tng-select.component';

@Component({
  standalone: true,
  imports: [TngSelectComponent],
  template: `
    <tng-select [ariaLabel]="'Choose item'" data-testid="host">
      <span>Content</span>
    </tng-select>
  `,
})
class HostComponent {}

describe('tng-select component (headless wrapper)', () => {
  it('attaches the primitive [tngSelect] to the host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[data-testid="host"]') as HTMLElement;
    expect(host).toBeTruthy();

    // From primitive HostBinding('attr.data-slot') => 'select'
    expect(host.getAttribute('data-slot')).toBe('select');

    // From wrapper HostBinding('attr.aria-label')
    expect(host.getAttribute('aria-label')).toBe('Choose item');
  });
});