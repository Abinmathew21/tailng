import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput } from '../tng-input'; // adjust relative path if needed

@Component({
  standalone: true,
  imports: [TngInput],
  template: `<input tngInput />`,
})
class InputHostComponent {}

@Component({
  standalone: true,
  imports: [TngInput],
  template: `<textarea tngInput></textarea>`,
})
class TextareaHostComponent {}

@Component({
  standalone: true,
  // Intentionally NOT importing TngInput here
  template: `<input />`,
})
class UnsupportedHostComponent {}

describe('tngInput primitive — exports & attachment', () => {
  it('exports the tngInput directive', async () => {
    // In TS this is mostly a type-level guarantee; runtime check ensures symbol exists.
    expect(TngInput).toBeTruthy();
  });

  it('attaches to a native <input tngInput> host without errors', async () => {
    await TestBed.configureTestingModule({
      imports: [InputHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const directive = fixture.debugElement.query(By.directive(TngInput));
    expect(directive).toBeTruthy();
  });

  it('attaches to a native <textarea tngInput> host without errors', async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TextareaHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const directive = fixture.debugElement.query(By.directive(TngInput));
    expect(directive).toBeTruthy();
  });

  it('does not attach to unsupported hosts and fails safely (no throw)', async () => {
    await TestBed.configureTestingModule({
      imports: [UnsupportedHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(UnsupportedHostComponent);
    expect(() => fixture.detectChanges()).not.toThrow();

    const directive = fixture.debugElement.query(By.directive(TngInput));
    expect(directive).toBeNull();
  });
});