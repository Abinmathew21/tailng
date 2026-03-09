import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput, TngInputGroup } from '../tng-input';

@Component({
  standalone: true,
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group class="consumer-class" data-x="123">
      <input tngInput class="consumer-input" />
    </tng-input-group>
  `,
})
class GroupOnlyInputHostComponent {}

@Component({
  standalone: true,
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input tngInput />
    </tng-input-group>
  `,
})
class GroupNoSlotsHostComponent {}

describe('tngInputGroup primitive — exports & basic structure', () => {
  it('exports the tngInputGroup component', async () => {
    expect(TngInputGroup).toBeTruthy();
  });

  it('renders group container without errors with only an input projected', async () => {
    await TestBed.configureTestingModule({ imports: [GroupOnlyInputHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupOnlyInputHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const group = fixture.debugElement.query(By.directive(TngInputGroup));
    expect(group).toBeTruthy();
  });

  it('renders without leading/trailing slots without creating empty wrappers (per contract)', async () => {
    await TestBed.configureTestingModule({ imports: [GroupNoSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupNoSlotsHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    // Only control wrapper should exist
    expect(host.querySelector('[data-slot="input-group-leading"]')).toBeNull();
    expect(host.querySelector('[data-slot="input-group-trailing"]')).toBeNull();
    expect(host.querySelector('[data-slot="input-group-control"]')).toBeTruthy();
  });

  it('preserves consumer-provided classes and unrelated attributes on the group host', async () => {
    await TestBed.configureTestingModule({ imports: [GroupOnlyInputHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(GroupOnlyInputHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host.classList.contains('consumer-class')).toBe(true);
    expect(host.getAttribute('data-x')).toBe('123');

    // Also assert the primitive adds its own slot marker without clobbering
    expect(host.getAttribute('data-slot')).toBe('input-group');
  });
});