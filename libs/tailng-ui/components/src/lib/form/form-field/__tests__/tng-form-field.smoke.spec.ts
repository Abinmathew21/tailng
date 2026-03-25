import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

// TODO: update import paths once implemented
import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';
import { TngFormFieldComponent } from '../tng-form-field.component';

@Component({
  imports: [TngFormFieldComponent, TngInput],
  template: `
    <tng-form-field>
      <input tngInput />
    </tng-form-field>
  `,
})
class StyledSmokeHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix],
  template: `
    <tng-form-field>
      <span tngPrefix>Leading</span>
      <input tngInput />
      <span tngSuffix>Trailing</span>
    </tng-form-field>
  `,
})
class StyledSlotsHostComponent {}

describe('<tng-form-field> shell — smoke & composition', () => {
  it.skip('renders <tng-form-field> without errors with a projected <input tngInput>', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it.skip('renders <tng-form-field> with both leading and trailing content without errors', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSlotsHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSlotsHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    expect(host.textContent).toContain('Leading');
    expect(host.textContent).toContain('Trailing');
  });

  it.skip('applies expected base styling class hooks on the group and control (if asserted)', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    fixture.detectChanges();

    // Example: if your component renders a group wrapper with class hooks
    const group = fixture.debugElement.query(By.css('[data-slot="input-group"]'));
    expect(group).toBeTruthy();
  });

  it.skip('does not require consumers to pass any optional styling inputs', async () => {
    await TestBed.configureTestingModule({ imports: [StyledSmokeHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(StyledSmokeHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});