import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngLabel } from '../tng-label';

function getByTestId<T extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as T;
}

@Component({
  standalone: true,
  imports: [TngLabel],
  template: `
    <label
      tngLabel
      #explicitLabelRef="tngLabel"
      data-testid="explicit-label"
      [attr.for]="controlId()"
      [required]="required()"
      [disabled]="disabled()"
    >
      Email address
    </label>
    <input [id]="controlId()" data-testid="explicit-input" />

    <label tngLabel data-testid="wrapped-label">
      Wrapped field
      <input data-testid="wrapped-input" />
    </label>

    <label tngLabel data-testid="checkbox-label" for="terms-input">Accept terms</label>
    <input id="terms-input" type="checkbox" data-testid="terms-input" />
  `,
})
class LabelHostComponent {
  public readonly controlId = signal('email-input');
  public readonly required = signal(false);
  public readonly disabled = signal(false);

  @ViewChild('explicitLabelRef', { static: true })
  public explicitLabelRef?: TngLabel;
}

describe('tng-label primitive', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the public TngLabel symbol', () => {
    expect(typeof TngLabel).toBe('function');
  });

  it('supports exportAs=tngLabel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.explicitLabelRef).toBeInstanceOf(TngLabel);
  });

  it('applies label slot hook and default optional state attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const label = getByTestId<HTMLLabelElement>(fixture, 'explicit-label');
    expect(label.getAttribute('data-slot')).toBe('label');
    expect(label.getAttribute('data-required')).toBeNull();
    expect(label.getAttribute('data-disabled')).toBeNull();
  });

  it('reflects required and disabled state hooks when inputs are true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.componentInstance.required.set(true);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const label = getByTestId<HTMLLabelElement>(fixture, 'explicit-label');
    expect(label.getAttribute('data-required')).toBe('');
    expect(label.getAttribute('data-disabled')).toBe('');
  });

  it('resolves explicit label control association for click-to-focus behavior', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const label = getByTestId<HTMLLabelElement>(fixture, 'explicit-label');
    const input = getByTestId<HTMLInputElement>(fixture, 'explicit-input');

    label.click();

    expect(label.control).toBe(input);
  });

  it('wrapped control gets native implicit label association', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const wrappedInput = getByTestId<HTMLInputElement>(fixture, 'wrapped-input');
    const wrappedLabel = getByTestId<HTMLLabelElement>(fixture, 'wrapped-label');

    expect(wrappedInput.labels?.item(0)).toBe(wrappedLabel);
  });

  it('associates one visible explicit label with one control', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const explicitInput = getByTestId<HTMLInputElement>(fixture, 'explicit-input');
    const explicitLabel = getByTestId<HTMLLabelElement>(fixture, 'explicit-label');

    expect(explicitInput.labels?.length).toBe(1);
    expect(explicitInput.labels?.item(0)).toBe(explicitLabel);
  });

  it('clicking associated label toggles checkbox controls', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const label = getByTestId<HTMLLabelElement>(fixture, 'checkbox-label');
    const checkbox = getByTestId<HTMLInputElement>(fixture, 'terms-input');
    expect(checkbox.checked).toBe(false);

    label.click();
    expect(checkbox.checked).toBe(true);

    label.click();
    expect(checkbox.checked).toBe(false);
  });

  it('keeps explicit association in sync when the control id changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelHostComponent],
    }).createComponent(LabelHostComponent);
    fixture.detectChanges();

    const label = getByTestId<HTMLLabelElement>(fixture, 'explicit-label');
    const input = getByTestId<HTMLInputElement>(fixture, 'explicit-input');
    expect(label.getAttribute('for')).toBe('email-input');
    expect(input.id).toBe('email-input');

    fixture.componentInstance.controlId.set('email-input-next');
    fixture.detectChanges();

    expect(label.getAttribute('for')).toBe('email-input-next');
    expect(input.id).toBe('email-input-next');
  });
});
