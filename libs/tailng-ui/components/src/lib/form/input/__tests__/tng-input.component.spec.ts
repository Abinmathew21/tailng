import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

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
  public type: 'text' | 'search' | 'number' = 'text';
  public ariaLabel = 'Example input';
  public emittedValue: string | null = null;

  public onValueChange(value: string): void {
    this.emittedValue = value;
  }
}

@Component({
  imports: [TngInputComponent],
  styles: [
    `
      .host-styled-input {
        --tng-input-bg: rgb(255, 248, 220);
        --tng-input-border: rgb(203, 213, 225);
        --tng-input-font-size: 19px;
        --tng-input-font-weight: 600;
        --tng-input-line-height: 1.4;
        --tng-input-placeholder: rgb(148, 163, 184);
      }
    `,
  ],
  template: `
    <tng-input
      class="host-styled-input"
      placeholder="Search docs"
      ariaLabel="Search docs"
    />
  `,
})
class HostStyledInputComponent {}

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      type="number"
      [value]="value"
      [step]="step"
      [min]="min"
      [max]="max"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class NumberInputHostComponent {
  public value = '1';
  public step: number | string | null = 0.5;
  public min: number | string | null = 0;
  public max: number | string | null = 2;
  public emittedValue: string | null = null;

  public onValueChange(value: string): void {
    this.emittedValue = value;
    this.value = value;
  }
}

const themeContractCss = [
  readFileSync(
    join(
      process.cwd(),
      'libs/tailng-ui/theme/src/lib/component-contracts/form/form-field/form-field.css',
    ),
    'utf8',
  ),
  readFileSync(
    join(
      process.cwd(),
      'libs/tailng-ui/theme/src/lib/component-contracts/form/input/input.css',
    ),
    'utf8',
  ),
].join('\n');

describe('<tng-input> component', () => {
  let themeStyleElement: HTMLStyleElement | null = null;

  beforeAll(() => {
    themeStyleElement = document.createElement('style');
    themeStyleElement.textContent = themeContractCss;
    document.head.appendChild(themeStyleElement);
  });

  afterAll(() => {
    themeStyleElement?.remove();
    themeStyleElement = null;
  });

  it('renders an internal native input with the provided value and placeholder', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.value).toBe('Nitrogen');
    expect(inputEl.placeholder).toBe('Search');
    expect(inputEl.getAttribute('aria-label')).toBe('Example input');
    expect(inputEl.getAttribute('data-slot')).toBe('input');
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

  it('surfaces host-level CSS variables for the theme contract to consume', async () => {
    await TestBed.configureTestingModule({ imports: [HostStyledInputComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostStyledInputComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(getComputedStyle(host).getPropertyValue('--tng-input-bg').trim()).toBe('rgb(255, 248, 220)');
    expect(getComputedStyle(host).getPropertyValue('--tng-input-font-size').trim()).toBe('19px');
    expect(getComputedStyle(host).getPropertyValue('--tng-input-font-weight').trim()).toBe('600');
    expect(getComputedStyle(host).getPropertyValue('--tng-input-placeholder').trim()).toBe(
      'rgb(148, 163, 184)',
    );
    expect(themeContractCss).toContain("--_tng-input-bg: var(--tng-input-bg, var(--_tng-input-bg-default));");
    expect(themeContractCss).toContain(
      "--_tng-input-font-size: var(--tng-input-font-size, var(--_tng-input-font-size-default));",
    );
    expect(themeContractCss).toContain(
      "color: var(--_tng-input-placeholder, var(--tng-semantic-foreground-muted));",
    );
    expect(inputEl.placeholder).toBe('Search docs');
  });

  it('renders custom controls and passes number constraints to the native input', async () => {
    await TestBed.configureTestingModule({ imports: [NumberInputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const controls = fixture.debugElement.query(By.css('.tng-input-number-controls')).nativeElement as HTMLElement;
    const buttons = fixture.debugElement.queryAll(By.css('.tng-input-number-button'));

    expect(inputEl.type).toBe('number');
    expect(inputEl.getAttribute('min')).toBe('0');
    expect(inputEl.getAttribute('max')).toBe('2');
    expect(inputEl.getAttribute('step')).toBe('0.5');
    expect(controls).toBeInstanceOf(HTMLElement);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].nativeElement.getAttribute('aria-label')).toBe('Increment value');
    expect(buttons[1].nativeElement.getAttribute('aria-label')).toBe('Decrement value');
  });

  it('increments and decrements number values with the configured step', async () => {
    await TestBed.configureTestingModule({ imports: [NumberInputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const [incrementButton, decrementButton] = fixture.debugElement.queryAll(
      By.css('.tng-input-number-button'),
    );

    incrementButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('1.5');
    expect(inputEl.value).toBe('1.5');

    decrementButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('1');
    expect(inputEl.value).toBe('1');
  });

  it('allows the custom number controls to be hidden with a CSS override', async () => {
    await TestBed.configureTestingModule({ imports: [NumberInputHostComponent] }).compileComponents();
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      tng-input.hide-number-controls .tng-input-number-controls {
        display: none;
      }
    `;
    document.head.appendChild(styleElement);

    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const controls = fixture.debugElement.query(By.css('.tng-input-number-controls')).nativeElement as HTMLElement;

    host.classList.add('hide-number-controls');

    expect(getComputedStyle(controls).display).toBe('none');

    styleElement.remove();
  });
});
