import { Component, Directive, ElementRef, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it, vi } from 'vitest';

import { TngInput, TngInputGroup, TngLabel, TngInputFieldPrefix, TngInputFieldSuffix, TngTextarea } from '@tailng-ui/primitives';
import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../tng-form-field.control';
import { TngInputFieldComponent } from '../../input-field/tng-input-field.component';
import { TngMultiSelectComponent } from '../../multiselect/tng-multiselect.component';
import { TngFormFieldPrefix, TngFormFieldSuffix } from '../tng-form-field-adornment';
import { TngFormFieldComponent } from '../tng-form-field.component';
import { TngError, TngHint } from '../tng-form-field-message';

@Directive({
  selector: '[testFormFieldControl]',
  providers: [{ provide: TNG_FORM_FIELD_CONTROL, useExisting: TestFormFieldControlDirective }],
})
class TestFormFieldControlDirective implements TngFormFieldControl {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;

  public id: string | null = 'custom-control';
  public disabled = false;
  public focused = false;
  public invalid = true;
  public required = true;
  public describedByIds: readonly string[] = [];
  public labelledById: string | null = null;

  public setDescribedByIds(ids: readonly string[]): void {
    this.describedByIds = [...ids];
    if (ids.length > 0) {
      this.host.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.host.removeAttribute('aria-describedby');
    }
  }

  public setLabelledById(id: string | null): void {
    this.labelledById = id;
    if (id === null) {
      this.host.removeAttribute('aria-labelledby');
    } else {
      this.host.setAttribute('aria-labelledby', id);
    }
  }

  public setAriaInvalid(invalid: boolean): void {
    if (invalid) {
      this.host.setAttribute('aria-invalid', 'true');
    } else {
      this.host.removeAttribute('aria-invalid');
    }
  }

  public setAriaRequired(required: boolean): void {
    if (required) {
      this.host.setAttribute('aria-required', 'true');
    } else {
      this.host.removeAttribute('aria-required');
    }
  }
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngInput, TngLabel],
  template: `
    <tng-form-field
      [labelPosition]="labelPosition"
      [size]="size"
      [requiredMarker]="requiredMarker"
      [hideHintWhenError]="hideHintWhenError"
      [disabled]="forcedDisabled"
      [invalid]="forcedInvalid"
      [slot]="slot"
    >
      @if (showLabel) {
        <label tngLabel>Email</label>
      }

      @if (showInput) {
        <input
          tngInput
          [id]="inputId"
          [required]="required"
          [disabled]="disabled"
          aria-describedby="external-help"
          aria-label="Email"
        />
      }

      @if (showHint) {
        <p tngHint [id]="hintId" [align]="hintAlign">Use your work email.</p>
      }

      @if (showError) {
        <p tngError [id]="errorId" [show]="errorVisible" [align]="errorAlign">Email is required.</p>
      }
    </tng-form-field>
  `,
})
class NativeHostComponent {
  public labelPosition = 'above';
  public size = 'md';
  public requiredMarker = true;
  public hideHintWhenError = false;
  public forcedDisabled: boolean | null = null;
  public forcedInvalid: boolean | null = null;
  public slot = { root: 'root-slot', label: 'label-slot', requiredMarker: 'marker-slot' };
  public showLabel = true;
  public showInput = true;
  public showHint = true;
  public showError = false;
  public errorVisible = true;
  public required = false;
  public disabled = false;
  public inputId = '';
  public hintId = 'email-hint';
  public errorId = 'email-error';
  public hintAlign = 'start';
  public errorAlign = 'start';
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngInput, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Email</label>
      <input tngInput id="email-control" required aria-label="Email" />
      <p tngHint id="email-hint">Use your work email.</p>
    </tng-form-field>
  `,
})
class RequiredStaticHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngInput, TngLabel],
  template: `
    <tng-form-field hideHintWhenError>
      <label tngLabel>Email</label>
      <input tngInput aria-describedby="external-help" aria-label="Email" />
      <p tngHint id="email-hint">Use your work email.</p>
      <p tngError id="email-error">Email is required.</p>
    </tng-form-field>
  `,
})
class ErrorStaticHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngLabel, TestFormFieldControlDirective],
  template: `
    <tng-form-field>
      <label tngLabel>Country</label>
      <div testFormFieldControl tngFormFieldControl role="combobox">Select country</div>
      <p tngHint id="country-hint">Use billing country.</p>
      <p tngError id="country-error">Country is required.</p>
    </tng-form-field>
  `,
})
class CustomControlHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngInputGroup, TngInput, TngLabel, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-form-field>
      <label tngLabel>Amount</label>
      <div tngInputGroup>
        <span tngInputFieldPrefix>$</span>
        <input tngInput type="number" />
        <button tngInputFieldSuffix type="button">Clear</button>
      </div>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class InputGroupHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngInputFieldComponent, TngInput, TngLabel, TngInputFieldPrefix, TngInputFieldSuffix],
  template: `
    <tng-form-field>
      <label tngLabel>Amount</label>
      <tng-input-field>
        <span tngInputFieldPrefix>$</span>
        <input tngInput type="number" />
        <span tngInputFieldSuffix>USD</span>
      </tng-input-field>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class InputFieldHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngMultiSelectComponent, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Status</label>
      <tng-multiselect [options]="options" placeholder="Select status"></tng-multiselect>
      <p tngHint>Choose one or more statuses.</p>
    </tng-form-field>
  `,
})
class MultiSelectHostComponent {
  public options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngInput, TngLabel, TngFormFieldPrefix, TngFormFieldSuffix],
  template: `
    <tng-form-field [slot]="slot">
      <label tngLabel>Amount</label>
      <span tngFormFieldPrefix>$</span>
      <input tngInput type="number" />
      <span tngFormFieldSuffix>USD</span>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class FieldAdornmentHostComponent {
  public slot = {
    controlRow: 'control-row-slot',
    prefix: 'prefix-slot',
    suffix: 'suffix-slot',
  };
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngTextarea, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Notes</label>
      <textarea tngTextarea required></textarea>
      <p tngHint id="notes-hint">Short internal note.</p>
    </tng-form-field>
  `,
})
class TextareaHostComponent {}

describe('tng-form-field', () => {
  async function createNativeHost(): Promise<ReturnType<typeof TestBed.createComponent<NativeHostComponent>>> {
    await TestBed.configureTestingModule({ imports: [NativeHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NativeHostComponent);
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
    return fixture;
  }

  async function flush(fixture: { detectChanges: (checkNoChanges?: boolean) => void; whenStable: () => Promise<unknown> }): Promise<void> {
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
  }

  it('renders the field structure and default host state', async () => {
    const fixture = await createNativeHost();
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-slot')).toBe('form-field');
    expect(field.getAttribute('data-size')).toBe('md');
    expect(field.getAttribute('data-label-position')).toBe('above');
    expect(field.hasAttribute('data-appearance')).toBe(false);
    expect(field.hasAttribute('data-orientation')).toBe(false);
    expect(field.className).toContain('tng-form-field');
    expect(field.className).toContain('root-slot');
    expect(fixture.nativeElement.textContent).toContain('Email');
    expect(fixture.nativeElement.textContent).toContain('Use your work email.');
  });

  it('associates a projected label with the native input and preserves external described-by ids', async () => {
    const fixture = await createNativeHost();
    const label = fixture.debugElement.query(By.css('label[tngLabel]')).nativeElement as HTMLLabelElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    expect(input.id).toMatch(/^tng-input-/u);
    expect(label.htmlFor).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-hint');
  });

  it('keeps a user-provided input id and adds required marker/state when required', async () => {
    await TestBed.configureTestingModule({ imports: [RequiredStaticHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(RequiredStaticHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]')).nativeElement as HTMLLabelElement;
    const marker = fixture.debugElement.query(By.css('[data-slot="form-field-required-marker"]')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    expect(input.id).toBe('email-control');
    expect(label.htmlFor).toBe('email-control');
    expect(field.getAttribute('data-required')).toBe('');
    expect(marker.textContent?.trim()).toBe('*');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('hides the required marker when requiredMarker is false', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.required = true;
    fixture.componentInstance.requiredMarker = false;
    await flush(fixture);

    const marker = fixture.debugElement.query(By.css('[data-slot="form-field-required-marker"]')).nativeElement as HTMLElement;
    expect(marker.hasAttribute('hidden')).toBe(true);
  });

  it('adds visible error ids, reflects invalid state, and can hide hints while errors are visible', async () => {
    await TestBed.configureTestingModule({ imports: [ErrorStaticHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ErrorStaticHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;
    const hint = fixture.debugElement.query(By.css('[tngHint]')).nativeElement as HTMLElement;

    expect(hint.hasAttribute('hidden')).toBe(true);
    expect(field.getAttribute('data-invalid')).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-error');
  });

  it('ignores hidden errors in described-by wiring', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.showError = true;
    fixture.componentInstance.errorVisible = false;
    await flush(fixture);

    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-hint');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('reflects left label position for left-of-border label placement', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="left">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class HorizontalPlainHostComponent {}

    await TestBed.configureTestingModule({ imports: [HorizontalPlainHostComponent] }).compileComponents();
    const horizontalFixture = TestBed.createComponent(HorizontalPlainHostComponent);
    await flush(horizontalFixture);

    const horizontalField = horizontalFixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const messages = horizontalFixture.debugElement.query(By.css('[data-slot="form-field-messages"]')).nativeElement as HTMLElement;
    expect(horizontalField.getAttribute('data-label-position')).toBe('left');
    expect(messages.getAttribute('data-slot')).toBe('form-field-messages');
  });

  it('reflects outline and above label positions for bordered field treatments', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="above">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class AboveHostComponent {}

    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="outline">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class OutlineHostComponent {}

    await TestBed.configureTestingModule({ imports: [AboveHostComponent, OutlineHostComponent] }).compileComponents();
    const aboveFixture = TestBed.createComponent(AboveHostComponent);
    await flush(aboveFixture);
    const aboveField = aboveFixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    expect(aboveField.getAttribute('data-label-position')).toBe('above');

    const outlineFixture = TestBed.createComponent(OutlineHostComponent);
    await flush(outlineFixture);
    const outlineField = outlineFixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    expect(outlineField.getAttribute('data-label-position')).toBe('outline');
  });

  it('falls back to above for invalid label positions', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="floating">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class InvalidLabelPositionHostComponent {}

    await TestBed.configureTestingModule({ imports: [InvalidLabelPositionHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InvalidLabelPositionHostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-label-position')).toBe('above');
  });

  it('reflects disabled, invalid, label position, size, and focus state', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.labelPosition = 'outline';
    fixture.componentInstance.size = 'lg';
    fixture.componentInstance.forcedDisabled = true;
    fixture.componentInstance.forcedInvalid = true;
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await flush(fixture);

    expect(field.getAttribute('data-label-position')).toBe('outline');
    expect(field.getAttribute('data-size')).toBe('lg');
    expect(field.getAttribute('data-disabled')).toBe('');
    expect(field.getAttribute('data-invalid')).toBe('');
    expect(field.getAttribute('data-focused')).toBe('');
  });

  it('wires textarea controls through the same label and described-by path', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TextareaHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]')).nativeElement as HTMLLabelElement;
    const textarea = fixture.debugElement.query(By.css('textarea[tngTextarea]')).nativeElement as HTMLTextAreaElement;

    expect(label.htmlFor).toBe(textarea.id);
    expect(field.getAttribute('data-required')).toBe('');
    expect(textarea.getAttribute('aria-describedby')).toBe('notes-hint');
  });

  it('passes label and described-by ids to a custom form-field control', async () => {
    await TestBed.configureTestingModule({ imports: [CustomControlHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CustomControlHostComponent);
    await flush(fixture);

    const customDebug = fixture.debugElement.query(By.directive(TestFormFieldControlDirective));
    const custom = customDebug.injector.get(TestFormFieldControlDirective);
    const host = customDebug.nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]')).nativeElement as HTMLLabelElement;

    expect(custom.describedByIds).toEqual(['country-hint', 'country-error']);
    expect(custom.labelledById).toBe(label.id);
    expect(host.getAttribute('aria-labelledby')).toBe(label.id);
    expect(host.getAttribute('aria-describedby')).toBe('country-hint country-error');
    expect(host.getAttribute('aria-invalid')).toBe('true');
    expect(host.getAttribute('aria-required')).toBe('true');
  });

  it('projects an input group as the control area without disrupting prefix or suffix content', async () => {
    await TestBed.configureTestingModule({ imports: [InputGroupHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputGroupHostComponent);
    await flush(fixture);

    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]')).nativeElement as HTMLElement;
    const group = fixture.debugElement.query(By.css('[tngInputGroup]')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    expect(control.contains(group)).toBe(true);
    expect(input.getAttribute('aria-describedby') ?? '').toMatch(/^tng-hint-/u);
    expect(control.textContent).toContain('$');
    expect(control.textContent).toContain('Clear');
  });

  it('projects an input-field component as the control area with prefix and suffix content', async () => {
    await TestBed.configureTestingModule({ imports: [InputFieldHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputFieldHostComponent);
    await flush(fixture);

    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]')).nativeElement as HTMLElement;
    const inputField = fixture.debugElement.query(By.css('tng-input-field')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    expect(control.contains(inputField)).toBe(true);
    expect(input.getAttribute('aria-describedby') ?? '').toMatch(/^tng-hint-/u);
    expect(control.textContent).toContain('$');
    expect(control.textContent).toContain('USD');
  });

  it('projects a multiselect component as the control area', async () => {
    await TestBed.configureTestingModule({ imports: [MultiSelectHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MultiSelectHostComponent);
    await flush(fixture);

    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]')).nativeElement as HTMLElement;
    const multiselect = fixture.debugElement.query(By.css('tng-multiselect')).nativeElement as HTMLElement;

    expect(control.contains(multiselect)).toBe(true);
    expect(control.textContent).toContain('Select status');
  });

  it('projects form-field prefix and suffix outside the control slot', async () => {
    await TestBed.configureTestingModule({ imports: [FieldAdornmentHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FieldAdornmentHostComponent);
    await flush(fixture);

    const row = fixture.debugElement.query(By.css('[data-slot="form-field-control-row"]')).nativeElement as HTMLElement;
    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]')).nativeElement as HTMLElement;
    const prefix = fixture.debugElement.query(By.css('[tngFormFieldPrefix]')).nativeElement as HTMLElement;
    const suffix = fixture.debugElement.query(By.css('[tngFormFieldSuffix]')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]')).nativeElement as HTMLInputElement;

    expect(row.className).toContain('control-row-slot');
    expect(row.contains(prefix)).toBe(true);
    expect(row.contains(suffix)).toBe(true);
    expect(control.contains(input)).toBe(true);
    expect(control.contains(prefix)).toBe(false);
    expect(control.contains(suffix)).toBe(false);
    expect(prefix.getAttribute('data-slot')).toBe('form-field-prefix');
    expect(suffix.getAttribute('data-slot')).toBe('form-field-suffix');
  });

  it('warns in dev mode when more than one compatible control is projected', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput],
      template: `
        <tng-form-field>
          <input tngInput aria-label="First" />
          <input tngInput aria-label="Second" />
        </tng-form-field>
      `,
    })
    class MultipleControlsHostComponent {}

    const warn = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({ imports: [MultipleControlsHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MultipleControlsHostComponent);
    fixture.detectChanges();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[tng-form-field] Expected at most 1 compatible control'),
      expect.any(HTMLElement),
    );

    warn.mockRestore();
  });
});
