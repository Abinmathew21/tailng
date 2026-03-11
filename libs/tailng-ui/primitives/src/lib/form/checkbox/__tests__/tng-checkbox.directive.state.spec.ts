import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngCheckbox } from '../tng-checkbox';

@Component({
  standalone: true,
  imports: [TngCheckbox],
  template: `
    <input
      tngCheckbox
      data-testid="checkbox"
      [checked]="checked()"
      [indeterminate]="indeterminate()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [required]="required()"
      [invalid]="invalid()"
      [ariaInvalid]="ariaInvalid()"
      [ariaDescribedBy]="ariaDescribedBy()"
      [name]="name()"
      [value]="value()"
    />
  `,
})
class CheckboxDirectiveStateHostComponent {
  public readonly ariaDescribedBy = signal<string | null>(null);
  public readonly ariaInvalid = signal<boolean | null>(null);
  public readonly checked = signal(false);
  public readonly disabled = signal(false);
  public readonly indeterminate = signal(false);
  public readonly invalid = signal<boolean | null>(null);
  public readonly name = signal<string | null>(null);
  public readonly readonly = signal(false);
  public readonly required = signal(false);
  public readonly value = signal<string | null>(null);
}

function queryCheckbox(fixture: ReturnType<typeof TestBed.createComponent>): HTMLInputElement {
  const checkbox = fixture.nativeElement.querySelector('[data-testid="checkbox"]');
  if (!(checkbox instanceof HTMLInputElement)) {
    throw new Error('Expected checkbox input.');
  }

  return checkbox;
}

describe('tng-checkbox directive state + a11y', () => {
  it('renders unchecked state by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.type).toBe('checkbox');
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect(checkbox.hasAttribute('data-unchecked')).toBe(true);
    expect(checkbox.getAttribute('data-state')).toBe('unchecked');
  });

  it('renders checked state when checked=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(checkbox.hasAttribute('data-checked')).toBe(true);
    expect(checkbox.getAttribute('data-state')).toBe('checked');
  });

  it('renders mixed state when indeterminate=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox.hasAttribute('data-mixed')).toBe(true);
    expect(checkbox.getAttribute('data-state')).toBe('mixed');
  });

  it('renders disabled, readonly, and required state attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.componentInstance.readonly.set(true);
    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.disabled).toBe(true);
    expect(checkbox.hasAttribute('data-disabled')).toBe(true);
    expect(checkbox.getAttribute('aria-readonly')).toBe('true');
    expect(checkbox.hasAttribute('data-readonly')).toBe(true);
    expect(checkbox.required).toBe(true);
    expect(checkbox.hasAttribute('data-required')).toBe(true);
    expect(checkbox.getAttribute('required')).toBe('');
  });

  it('resolves invalid state from invalid input first, then ariaInvalid', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.invalid.set(null);
    fixture.componentInstance.ariaInvalid.set(true);
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox.hasAttribute('data-invalid')).toBe(true);

    fixture.componentInstance.invalid.set(false);
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-invalid')).toBeNull();
    expect(checkbox.hasAttribute('data-invalid')).toBe(false);

    fixture.componentInstance.invalid.set(true);
    fixture.componentInstance.ariaInvalid.set(false);
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-invalid')).toBe('true');
    expect(checkbox.hasAttribute('data-invalid')).toBe(true);
  });

  it('forwards aria-describedby, name, and value when provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.ariaDescribedBy.set('hint-id error-id');
    fixture.componentInstance.name.set('consent');
    fixture.componentInstance.value.set('yes');
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.getAttribute('aria-describedby')).toBe('hint-id error-id');
    expect(checkbox.getAttribute('name')).toBe('consent');
    expect(checkbox.getAttribute('value')).toBe('yes');
  });

  it('drops empty string values for aria-describedby, name, and value', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxDirectiveStateHostComponent],
    }).createComponent(CheckboxDirectiveStateHostComponent);

    fixture.componentInstance.ariaDescribedBy.set('   ');
    fixture.componentInstance.name.set(' ');
    fixture.componentInstance.value.set('');
    fixture.detectChanges();

    const checkbox = queryCheckbox(fixture);
    expect(checkbox.getAttribute('aria-describedby')).toBeNull();
    expect(checkbox.getAttribute('name')).toBeNull();
    expect(checkbox.getAttribute('value')).toBeNull();
  });
});
