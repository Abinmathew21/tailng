import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveTngLabelForAttr, TngLabelComponent } from '../tng-label.component';

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

function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!(element instanceof Element)) {
    throw new Error(`Expected selector "${selector}" to resolve.`);
  }

  return element as T;
}

@Component({
  standalone: true,
  imports: [TngLabelComponent],
  template: `
    <tng-label
      data-testid="label-host"
      [forId]="forId()"
      [required]="required()"
      [disabled]="disabled()"
    >
      Display Name
    </tng-label>
    <input [id]="forId()" data-testid="control" />
  `,
})
class LabelComponentHostComponent {
  public readonly forId = signal('display-name');
  public readonly required = signal(false);
  public readonly disabled = signal(false);
}

describe('tng-label component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports label component', () => {
    expect(typeof TngLabelComponent).toBe('function');
  });

  it('resolves for attribute value', () => {
    expect(resolveTngLabelForAttr('field-id')).toBe('field-id');
    expect(resolveTngLabelForAttr('  account-name ')).toBe('account-name');
    expect(resolveTngLabelForAttr('   ')).toBeNull();
  });

  it('renders primitive-backed label slot and projected text', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelComponentHostComponent],
    }).createComponent(LabelComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'label-host');
    const label = queryRequired<HTMLLabelElement>(host, 'label.tng-label');
    expect(label.getAttribute('data-slot')).toBe('label');
    expect(label.textContent).toContain('Display Name');
  });

  it('maps forId to native for attr and updates association at runtime', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelComponentHostComponent],
    }).createComponent(LabelComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'label-host');
    const label = queryRequired<HTMLLabelElement>(host, 'label.tng-label');
    const control = getByTestId<HTMLInputElement>(fixture, 'control');

    expect(label.getAttribute('for')).toBe('display-name');
    expect(control.id).toBe('display-name');

    fixture.componentInstance.forId.set('display-name-next');
    fixture.detectChanges();

    expect(label.getAttribute('for')).toBe('display-name-next');
    expect(control.id).toBe('display-name-next');
  });

  it('renders and removes required indicator while forwarding required state hook', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelComponentHostComponent],
    }).createComponent(LabelComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'label-host');
    const label = queryRequired<HTMLLabelElement>(host, 'label.tng-label');
    expect(label.getAttribute('data-required')).toBeNull();
    expect(host.querySelector('.tng-label-required')).toBeNull();

    fixture.componentInstance.required.set(true);
    fixture.detectChanges();

    const requiredMarker = queryRequired<HTMLElement>(host, '.tng-label-required');
    expect(requiredMarker.textContent?.trim()).toBe('*');
    expect(requiredMarker.getAttribute('aria-hidden')).toBe('true');
    expect(label.getAttribute('data-required')).toBe('');
  });

  it('forwards disabled state hook to the primitive label element', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelComponentHostComponent],
    }).createComponent(LabelComponentHostComponent);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'label-host');
    const label = queryRequired<HTMLLabelElement>(host, 'label.tng-label');
    expect(label.getAttribute('data-disabled')).toBe('');
  });

  it('keeps rendered label associated with the control for click-to-focus behavior', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [LabelComponentHostComponent],
    }).createComponent(LabelComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'label-host');
    const label = queryRequired<HTMLLabelElement>(host, 'label.tng-label');
    const input = getByTestId<HTMLInputElement>(fixture, 'control');

    label.click();

    expect(label.control).toBe(input);
  });
});
