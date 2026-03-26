import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngPrefix, TngSuffix } from '../tng-adornment';
import { TngInput } from '../tng-input';
import { TngInputGroup } from '../tng-input-group';

@Component({
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group class="consumer-class" data-x="123">
      <input tngInput class="consumer-input" />
    </tng-input-group>
  `,
})
class GroupOnlyInputHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput, TngPrefix],
  template: `
    <tng-input-group>
      <span tngPrefix>@</span>
      <input tngInput />
    </tng-input-group>
  `,
})
class GroupWithPrefixHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput, TngSuffix],
  template: `
    <tng-input-group>
      <input tngInput />
      <button tngSuffix type="button">X</button>
    </tng-input-group>
  `,
})
class GroupWithSuffixHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput, TngPrefix, TngSuffix],
  template: `
    <tng-input-group style="width: 240px;">
      <span tngPrefix>@</span>
      <input tngInput value="Ada Lovelace" />
      <button tngSuffix type="button">X</button>
    </tng-input-group>
  `,
})
class GroupWithPrefixAndSuffixNarrowHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput, TngPrefix, TngSuffix],
  template: `
    <tng-input-group style="width: 640px;">
      <span tngPrefix>@</span>
      <input tngInput value="Ada Lovelace" />
      <button tngSuffix type="button">X</button>
    </tng-input-group>
  `,
})
class GroupWithPrefixAndSuffixWideHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input tngInput disabled />
    </tng-input-group>
  `,
})
class GroupDisabledHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input tngInput readonly />
    </tng-input-group>
  `,
})
class GroupReadonlyHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput],
  template: `
    <tng-input-group>
      <input tngInput required />
    </tng-input-group>
  `,
})
class GroupInvalidHostComponent {}

describe('tngInputGroup primitive — structure', () => {
  it('renders host with data-slot=input-group', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOnlyInputHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupOnlyInputHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.getAttribute('data-slot')).toBe('input-group');
    expect(groupEl.classList.contains('consumer-class')).toBe(true);
    expect(groupEl.getAttribute('data-x')).toBe('123');
  });

  it('renders control wrapper even when no prefix/suffix exist', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOnlyInputHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupOnlyInputHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.querySelector('[data-slot="input-group-control"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-group-leading"]')).toBeNull();
    expect(groupEl.querySelector('[data-slot="input-group-trailing"]')).toBeNull();
  });
});

describe('tngInputGroup primitive — prefix/suffix wrappers', () => {
  it('renders leading wrapper when prefix exists', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithPrefixHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithPrefixHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.getAttribute('data-has-leading')).toBe('');
    expect(groupEl.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-leading"]')).toBeTruthy();
  });

  it('renders trailing wrapper when suffix exists', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithSuffixHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithSuffixHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.getAttribute('data-has-trailing')).toBe('');
    expect(groupEl.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-trailing"]')).toBeTruthy();
  });
});


describe('tngInputGroup primitive — slot hooks', () => {
  it('assigns expected data-slot values to all rendered parts', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithPrefixAndSuffixNarrowHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithPrefixAndSuffixNarrowHostComponent);
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('[data-slot="input-group"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input-group-control"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input-leading"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input"]')).toBeTruthy();
    expect(root.querySelector('[data-slot="input-trailing"]')).toBeTruthy();
  });
});

describe('tngInputGroup primitive — focus state', () => {
  it('adds data-focused when input receives focus', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithSuffixHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithSuffixHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;
    const inputEl = groupEl.querySelector('input')!;

    inputEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();

    expect(groupEl.getAttribute('data-focused')).toBe('');
  });

  it('removes data-focused when focus leaves the group', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithSuffixHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithSuffixHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;
    const inputEl = groupEl.querySelector('input')!;

    inputEl.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(groupEl.getAttribute('data-focused')).toBe('');

    groupEl.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    fixture.detectChanges();

    expect(groupEl.hasAttribute('data-focused')).toBe(false);
  });
});

describe('tngInputGroup primitive — reflected state', () => {
  it('reflects disabled from input to host', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDisabledHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupDisabledHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;
    expect(groupEl.getAttribute('data-disabled')).toBe('');
  });

  it('reflects readonly from input to host', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupReadonlyHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupReadonlyHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;
    expect(groupEl.getAttribute('data-readonly')).toBe('');
  });

  it('reflects invalid from input to host', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupInvalidHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupInvalidHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;
    expect(groupEl.getAttribute('data-invalid')).toBe('');
  });
});

describe('tngInputGroup primitive — width variants', () => {
  it('keeps prefix and suffix wrappers rendered at narrow width', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithPrefixAndSuffixNarrowHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithPrefixAndSuffixNarrowHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-group-control"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
  });

  it('keeps prefix and suffix wrappers rendered at wide width', async () => {
    await TestBed.configureTestingModule({
      imports: [GroupWithPrefixAndSuffixWideHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GroupWithPrefixAndSuffixWideHostComponent);
    fixture.detectChanges();

    const groupEl: HTMLElement = fixture.debugElement.query(By.directive(TngInputGroup)).nativeElement;

    expect(groupEl.querySelector('[data-slot="input-group-leading"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-group-control"]')).toBeTruthy();
    expect(groupEl.querySelector('[data-slot="input-group-trailing"]')).toBeTruthy();
  });
});

