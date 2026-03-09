import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput } from '../tng-input';

@Component({
  standalone: true,
  imports: [TngInput],
  template: `
    <input
      tngInput
      [ariaLabel]="ariaLabel"
      [ariaLabelledby]="ariaLabelledby"
      [ariaDescribedBy]="ariaDescribedBy"
      [ariaInvalid]="ariaInvalid"
    />
  `,
})
class AriaHostComponent {
  public ariaLabel: string | null = null;
  public ariaLabelledby: string | null = null;
  public ariaDescribedBy: string | null = null;
  public ariaInvalid: boolean | null = null;
}

describe('tngInput primitive — ARIA pass-through', () => {
  it('reflects ariaLabel as aria-label when provided', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.componentInstance.ariaLabel = 'Email address';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('aria-label')).toBe('Email address');
  });

  it('reflects ariaLabelledby as aria-labelledby when provided', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.componentInstance.ariaLabelledby = 'label-id';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('aria-labelledby')).toBe('label-id');
  });

  it('reflects ariaDescribedBy as aria-describedby when provided', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.componentInstance.ariaDescribedBy = 'hint-id error-id';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('aria-describedby')).toBe('hint-id error-id');
  });

  it('reflects ariaInvalid=true as aria-invalid="true"', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.componentInstance.ariaInvalid = true;
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('omits ARIA attributes when inputs are null/empty per normalization contract', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);
    fixture.componentInstance.ariaLabel = '   ';
    fixture.componentInstance.ariaLabelledby = '';
    fixture.componentInstance.ariaDescribedBy = null;
    fixture.componentInstance.ariaInvalid = false; // contract: omit when false
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(el.hasAttribute('aria-label')).toBe(false);
    expect(el.hasAttribute('aria-labelledby')).toBe(false);
    expect(el.hasAttribute('aria-describedby')).toBe(false);
    expect(el.hasAttribute('aria-invalid')).toBe(false);
  });

  it('does not generate invalid ARIA values for booleans (uses correct string mapping)', async () => {
    await TestBed.configureTestingModule({ imports: [AriaHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AriaHostComponent);

    // Test coercion via string inputs if your input() transform supports it.
    // If ariaInvalid input is strictly boolean|null, remove these and keep the true/false tests only.
    (fixture.componentInstance as unknown as { ariaInvalid: any }).ariaInvalid = 'true';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
    expect(el.getAttribute('aria-invalid')).not.toBe('True');
    expect(el.getAttribute('aria-invalid')).not.toBe('1');
  });
});