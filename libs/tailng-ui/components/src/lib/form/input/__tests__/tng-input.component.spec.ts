import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInputComponent } from '../tng-input.component';

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      [appearance]="appearance"
      [size]="size"
      [tone]="tone"
      [fullWidth]="fullWidth"
      [placeholder]="placeholder"
      [value]="value"
      [type]="type"
      [ariaLabel]="ariaLabel"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class InputHostComponent {
  public appearance: 'outline' | 'solid' | 'ghost' = 'outline';
  public size: 'sm' | 'md' | 'lg' = 'md';
  public tone: 'neutral' | 'primary' | 'success' | 'danger' = 'neutral';
  public fullWidth = true;
  public placeholder = 'Search';
  public value = 'Nitrogen';
  public type: 'text' | 'search' = 'text';
  public ariaLabel = 'Example input';
  public emittedValue: string | null = null;

  public onValueChange(value: string): void {
    this.emittedValue = value;
  }
}

describe('<tng-input> component', () => {
  it('renders an internal native input with the provided value and placeholder', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.value).toBe('Nitrogen');
    expect(inputEl.placeholder).toBe('Search');
    expect(inputEl.getAttribute('aria-label')).toBe('Example input');
  });

  it('emits valueChange when the internal input changes', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = 'Oxygen';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('Oxygen');
  });

  it('passes visual tokens through to the internal form field', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.componentInstance.appearance = 'solid';
    fixture.componentInstance.tone = 'primary';
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const formField = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(host.getAttribute('data-size')).toBe('lg');
    expect(host.getAttribute('data-appearance')).toBe('solid');
    expect(host.getAttribute('data-tone')).toBe('primary');
    expect(formField.getAttribute('data-size')).toBe('lg');
    expect(formField.getAttribute('data-appearance')).toBe('solid');
    expect(formField.getAttribute('data-tone')).toBe('primary');
  });
});
