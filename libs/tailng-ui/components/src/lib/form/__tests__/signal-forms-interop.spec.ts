import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, form, pattern as patternValidator } from '@angular/forms/signals';
import { describe, expect, it } from 'vitest';

import {
  TngAutocomplete,
  TngMultiAutocomplete,
  TngMultiSelect,
  TngSelect,
} from '@tailng-ui/primitives';

import { TngAutocompleteComponent } from '../autocomplete/tng-autocomplete.component';
import { TngCheckboxComponent } from '../checkbox/tng-checkbox.component';
import { TngInputOtpComponent } from '../input-otp/tng-input-otp.component';
import { TngInputComponent } from '../input/tng-input.component';
import { TngMultiAutocompleteComponent } from '../multi-autocomplete/tng-multi-autocomplete.component';
import { TngMultiSelectComponent } from '../multiselect/tng-multiselect.component';
import { TngSelectComponent } from '../select/tng-select.component';
import { TngToggleComponent } from '../toggle/tng-toggle.component';

type TeamOption = Readonly<{
  id: string;
  label: string;
}>;

const teamOptions: readonly TeamOption[] = Object.freeze([
  { id: 'alpha', label: 'Alpha' },
  { id: 'bravo', label: 'Bravo' },
  { id: 'charlie', label: 'Charlie' },
]);

@Component({
  imports: [FormField, TngInputComponent],
  template: `<tng-input data-testid="input" ariaLabel="Project name" [formField]="projectForm.name"></tng-input>`,
})
class InputSignalFormsHostComponent {
  readonly projectModel = signal({ name: 'Initial name' });
  readonly projectForm = form(this.projectModel);
}

@Component({
  imports: [FormField, TngInputComponent],
  template: `<tng-input data-testid="input" ariaLabel="Project code" [formField]="projectForm.code"></tng-input>`,
})
class InputPatternSignalFormsHostComponent {
  readonly projectModel = signal({ code: 'ABC' });
  readonly projectForm = form(this.projectModel, (project) => {
    patternValidator(project.code, /^[A-Z]+$/);
  });
}

@Component({
  imports: [FormField, TngCheckboxComponent],
  template: `
    <tng-checkbox data-testid="checkbox" [formField]="releaseForm.ready">
      Release ready
    </tng-checkbox>
  `,
})
class CheckboxSignalFormsHostComponent {
  readonly releaseModel = signal({ ready: true });
  readonly releaseForm = form(this.releaseModel);
}

@Component({
  imports: [FormField, TngToggleComponent],
  template: `
    <tng-toggle data-testid="toggle" [formField]="preferencesForm.pinned">
      Pin sidebar
    </tng-toggle>
  `,
})
class ToggleSignalFormsHostComponent {
  readonly preferencesModel = signal({ pinned: false });
  readonly preferencesForm = form(this.preferencesModel);
}

@Component({
  imports: [FormField, TngInputOtpComponent],
  template: `<tng-input-otp data-testid="otp" [length]="4" [formField]="verificationForm.code"></tng-input-otp>`,
})
class InputOtpSignalFormsHostComponent {
  readonly verificationModel = signal({ code: '12' });
  readonly verificationForm = form(this.verificationModel);
}

@Component({
  imports: [FormField, TngInputOtpComponent],
  template: `<tng-input-otp data-testid="otp" type="custom" [length]="4" [formField]="verificationForm.code"></tng-input-otp>`,
})
class InputOtpPatternSignalFormsHostComponent {
  readonly verificationModel = signal({ code: 'AB' });
  readonly verificationForm = form(this.verificationModel, (verification) => {
    patternValidator(verification.code, /^[A-Z]+$/);
  });
}

@Component({
  imports: [FormField, TngSelectComponent],
  template: `
    <tng-select
      data-testid="select"
      aria-label="Team owner"
      [formField]="assigneeForm.owner"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-select>
  `,
})
class SelectSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly assigneeModel = signal({ owner: 'alpha' });
  readonly assigneeForm = form(this.assigneeModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngAutocompleteComponent],
  template: `
    <tng-autocomplete
      data-testid="autocomplete"
      [formField]="assigneeForm.owner"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-autocomplete>
  `,
})
class AutocompleteSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly assigneeModel = signal<{ owner: string | null }>({ owner: 'alpha' });
  readonly assigneeForm = form(this.assigneeModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngMultiSelectComponent],
  template: `
    <tng-multiselect
      data-testid="multiselect"
      aria-label="Reviewers"
      [formField]="reviewForm.reviewers"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-multiselect>
  `,
})
class MultiselectSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly reviewModel = signal({ reviewers: ['alpha'] as readonly string[] });
  readonly reviewForm = form(this.reviewModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

@Component({
  imports: [FormField, TngMultiAutocompleteComponent],
  template: `
    <tng-multi-autocomplete
      data-testid="multi-autocomplete"
      [formField]="reviewForm.reviewers"
      [options]="options"
      [getOptionLabel]="optionLabel"
      [getOptionValue]="optionValue"
    ></tng-multi-autocomplete>
  `,
})
class MultiAutocompleteSignalFormsHostComponent {
  readonly options = teamOptions;
  readonly reviewModel = signal({ reviewers: ['alpha'] as readonly string[] });
  readonly reviewForm = form(this.reviewModel);

  readonly optionLabel = (option: TeamOption): string => option.label;
  readonly optionValue = (option: TeamOption): string => option.id;
}

function queryRequiredElement<T extends Element>(
  fixture: ReturnType<typeof TestBed.createComponent>,
  selector: string,
  expectedType: abstract new (...args: never[]) => T,
): T {
  const element = fixture.nativeElement.querySelector(selector);
  if (!(element instanceof expectedType)) {
    throw new Error(`Expected ${selector} to match ${expectedType.name}.`);
  }

  return element;
}

describe('tailng-ui signal forms interop', () => {
  it('binds tng-input through ControlValueAccessor interop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputSignalFormsHostComponent],
    }).createComponent(InputSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="input"] input',
      HTMLInputElement,
    );

    expect(input.value).toBe('Initial name');

    host.projectModel.set({ name: 'Renamed project' });
    fixture.detectChanges();
    expect(input.value).toBe('Renamed project');

    input.value = 'Signal-ready input';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.projectModel().name).toBe('Signal-ready input');
  });

  it('binds signal form pattern metadata to tng-input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputPatternSignalFormsHostComponent],
    }).createComponent(InputPatternSignalFormsHostComponent);

    fixture.detectChanges();

    const input = queryRequiredElement(
      fixture,
      '[data-testid="input"] input',
      HTMLInputElement,
    );

    expect(input.getAttribute('pattern')).toBe('^[A-Z]+$');
  });

  it('binds tng-checkbox through ControlValueAccessor interop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CheckboxSignalFormsHostComponent],
    }).createComponent(CheckboxSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const input = queryRequiredElement(
      fixture,
      '[data-testid="checkbox"] input[type="checkbox"]',
      HTMLInputElement,
    );

    expect(input.checked).toBe(true);

    host.releaseModel.set({ ready: false });
    fixture.detectChanges();
    expect(input.checked).toBe(false);

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.releaseModel().ready).toBe(true);
  });

  it('binds tng-toggle through ControlValueAccessor interop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleSignalFormsHostComponent],
    }).createComponent(ToggleSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const button = queryRequiredElement(
      fixture,
      '[data-testid="toggle"] button',
      HTMLButtonElement,
    );

    expect(button.getAttribute('aria-pressed')).toBe('false');

    host.preferencesModel.set({ pinned: true });
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(host.preferencesModel().pinned).toBe(false);
  });

  it('binds tng-input-otp through ControlValueAccessor interop', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpSignalFormsHostComponent],
    }).createComponent(InputOtpSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstSlot = queryRequiredElement(
      fixture,
      '[data-testid="otp"] [data-tng-otp-slot="0"]',
      HTMLInputElement,
    );

    expect(firstSlot.value).toBe('1');

    host.verificationModel.set({ code: '98' });
    fixture.detectChanges();
    expect(firstSlot.value).toBe('9');

    firstSlot.value = '4';
    firstSlot.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.verificationModel().code).toBe('48');
  });

  it('binds signal form pattern metadata to tng-input-otp', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [InputOtpPatternSignalFormsHostComponent],
    }).createComponent(InputOtpPatternSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstSlot = queryRequiredElement(
      fixture,
      '[data-testid="otp"] [data-tng-otp-slot="0"]',
      HTMLInputElement,
    );

    firstSlot.value = 'C';
    firstSlot.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(host.verificationModel().code).toBe('CB');
  });

  it('binds tng-select through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SelectSignalFormsHostComponent],
    }).createComponent(SelectSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const selectPrimitive = fixture.debugElement
      .query(By.css('[data-testid="select"]'))
      .injector.get<TngSelect<string>>(TngSelect);

    expect(selectPrimitive.value()).toBe('alpha');

    host.assigneeModel.set({ owner: 'bravo' });
    fixture.detectChanges();
    expect(selectPrimitive.value()).toBe('bravo');

    selectPrimitive.selectValue('charlie');
    fixture.detectChanges();

    expect(host.assigneeModel().owner).toBe('charlie');
  });

  it('binds tng-autocomplete through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [AutocompleteSignalFormsHostComponent],
    }).createComponent(AutocompleteSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const autocompletePrimitive = fixture.debugElement
      .query(By.css('[data-testid="autocomplete"]'))
      .injector.get<TngAutocomplete<string>>(TngAutocomplete);

    expect(autocompletePrimitive.value()).toBe('alpha');

    host.assigneeModel.set({ owner: 'bravo' });
    fixture.detectChanges();
    expect(host.assigneeModel().owner).toBe('bravo');
    expect(autocompletePrimitive.value()).toBe('bravo');
  });

  it('binds tng-multiselect through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiselectSignalFormsHostComponent],
    }).createComponent(MultiselectSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiselectPrimitive = fixture.debugElement
      .query(By.css('[data-testid="multiselect"]'))
      .injector.get<TngMultiSelect<string>>(TngMultiSelect);

    expect(multiselectPrimitive.value()).toEqual(['alpha']);

    host.reviewModel.set({ reviewers: ['alpha', 'bravo'] });
    fixture.detectChanges();
    expect(multiselectPrimitive.value()).toEqual(['alpha', 'bravo']);

    multiselectPrimitive.value.set(['charlie']);
    fixture.detectChanges();

    expect(host.reviewModel().reviewers).toEqual(['charlie']);
  });

  it('binds tng-multi-autocomplete through its host directive model signal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiAutocompleteSignalFormsHostComponent],
    }).createComponent(MultiAutocompleteSignalFormsHostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const multiAutocompletePrimitive = fixture.debugElement
      .query(By.css('[data-testid="multi-autocomplete"]'))
      .injector.get<TngMultiAutocomplete<string>>(TngMultiAutocomplete);

    expect(multiAutocompletePrimitive.value()).toEqual(['alpha']);

    host.reviewModel.set({ reviewers: ['alpha', 'bravo'] });
    fixture.detectChanges();
    expect(multiAutocompletePrimitive.value()).toEqual(['alpha', 'bravo']);

    multiAutocompletePrimitive.value.set(['charlie']);
    fixture.detectChanges();

    expect(host.reviewModel().reviewers).toEqual(['charlie']);
  });
});
