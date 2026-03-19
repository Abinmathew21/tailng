import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngCheckbox } from '../tng-checkbox';

@Component({
  imports: [TngCheckbox],
  template: `
    <input
      tngCheckbox
      data-testid="checkbox"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [readonly]="readonly()"
      [disabled]="disabled()"
    />
  `,
})
class CheckboxDirectiveInteractionHostComponent {
  public readonly checked = signal(false);
  public readonly disabled = signal(false);
  public readonly indeterminate = signal(false);
  public readonly readonly = signal(false);
}

function queryCheckbox(fixture: ReturnType<typeof TestBed.createComponent>): HTMLInputElement {
  const checkbox = fixture.nativeElement.querySelector('[data-testid="checkbox"]');
  if (!(checkbox instanceof HTMLInputElement)) {
    throw new Error('Expected checkbox input.');
  }

  return checkbox;
}

describe('tng-checkbox directive interaction', () => {
  it('applies data-focused on focus and clears it on blur', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveInteractionHostComponent],
    }).createComponent(CheckboxDirectiveInteractionHostComponent);

    fixture.detectChanges();
    const checkbox = queryCheckbox(fixture);

    checkbox.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    expect(checkbox.hasAttribute('data-focused')).toBe(true);

    checkbox.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(checkbox.hasAttribute('data-focused')).toBe(false);
  });

  it('applies data-focus-visible when host matches :focus-visible', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveInteractionHostComponent],
    }).createComponent(CheckboxDirectiveInteractionHostComponent);

    fixture.detectChanges();
    const checkbox = queryCheckbox(fixture);
    const originalMatches = checkbox.matches.bind(checkbox);

    const matchesSpy = vi.spyOn(checkbox, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }

      return originalMatches(selector);
    });

    checkbox.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(checkbox.hasAttribute('data-focus-visible')).toBe(true);

    matchesSpy.mockRestore();
  });

  it('reverts DOM checked state on change when readonly=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveInteractionHostComponent],
    }).createComponent(CheckboxDirectiveInteractionHostComponent);

    fixture.componentInstance.checked.set(true);
    fixture.componentInstance.indeterminate.set(false);
    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.checked).toBe(true);

    checkbox.checked = false;
    checkbox.indeterminate = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('does not revert DOM checked state on change when readonly=false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveInteractionHostComponent],
    }).createComponent(CheckboxDirectiveInteractionHostComponent);

    fixture.componentInstance.checked.set(true);
    fixture.componentInstance.readonly.set(false);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(checkbox.checked).toBe(false);
  });

  it('does not run readonly revert path when disabled=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveInteractionHostComponent],
    }).createComponent(CheckboxDirectiveInteractionHostComponent);

    fixture.componentInstance.checked.set(true);
    fixture.componentInstance.readonly.set(true);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(checkbox.checked).toBe(false);
  });
});
