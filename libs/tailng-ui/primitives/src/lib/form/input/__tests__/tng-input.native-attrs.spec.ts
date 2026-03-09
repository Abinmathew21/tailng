import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput } from '../tng-input'; // adjust relative path if needed

@Component({
  standalone: true,
  imports: [TngInput],
  template: `
    <input
      tngInput
      [disabled]="disabled"
      [readonly]="readonly"
      [required]="required"
      [attr.type]="type"
      [attr.name]="name"
      [attr.placeholder]="placeholder"
      [attr.autocomplete]="autocomplete"
      [attr.tabindex]="tabindex"
    />
  `,
})
class NativeAttrHostComponent {
  public disabled = false;
  public readonly = false;
  public required = false;

  public type: string | null = 'text';
  public name: string | null = 'email';
  public placeholder: string | null = 'Enter value';
  public autocomplete: string | null = 'off';
  public tabindex: string | null = '3';
}

@Component({
  standalone: true,
  imports: [TngInput],
  template: `
    <input tngInput disabled readonly required />
  `,
})
class BooleanAttrHostComponent {}

describe('tngInput primitive — native attributes & coercion', () => {
  it('coerces disabled="" to true (boolean attribute behavior)', async () => {
    await TestBed.configureTestingModule({ imports: [BooleanAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(BooleanAttrHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.disabled).toBe(true);
  });

  it('coerces readonly="" to true (boolean attribute behavior)', async () => {
    await TestBed.configureTestingModule({ imports: [BooleanAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(BooleanAttrHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.hasAttribute('readonly')).toBe(true);
    // readonly is reflected as property on inputs
    expect(el.readOnly).toBe(true);
  });

  it('coerces required="" to true (boolean attribute behavior)', async () => {
    await TestBed.configureTestingModule({ imports: [BooleanAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(BooleanAttrHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.required).toBe(true);
  });

  it('applies native disabled attribute only when disabled=true', async () => {
    await TestBed.configureTestingModule({ imports: [NativeAttrHostComponent] }).compileComponents();
  
    const fixture = TestBed.createComponent(NativeAttrHostComponent);
    fixture.detectChanges(); // initial render OK
  
    const host = fixture.componentInstance;
    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  
    host.disabled = false;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('disabled')).toBe(false);
  
    host.disabled = true;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('applies native readonly attribute only when readonly=true', async () => {
    await TestBed.configureTestingModule({ imports: [NativeAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NativeAttrHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    host.readonly = false;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('readonly')).toBe(false);

    host.readonly = true;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('readonly')).toBe(true);
  });

  it('applies native required attribute only when required=true', async () => {
    await TestBed.configureTestingModule({ imports: [NativeAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NativeAttrHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    host.required = false;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('required')).toBe(false);

    host.required = true;
    fixture.changeDetectorRef.detectChanges();
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('preserves consumer-provided type, name, placeholder, autocomplete attributes (no clobber)', async () => {
    await TestBed.configureTestingModule({ imports: [NativeAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NativeAttrHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(el.getAttribute('type')).toBe('text');
    expect(el.getAttribute('name')).toBe('email');
    expect(el.getAttribute('placeholder')).toBe('Enter value');
    expect(el.getAttribute('autocomplete')).toBe('off');
  });

  it('preserves consumer-provided tabindex (does not override)', async () => {
    await TestBed.configureTestingModule({ imports: [NativeAttrHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NativeAttrHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(el.getAttribute('tabindex')).toBe('3');
  });

});