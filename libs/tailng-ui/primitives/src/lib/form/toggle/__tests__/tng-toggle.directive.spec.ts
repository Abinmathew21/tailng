import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { TngToggle } from '../tng-toggle';

@Component({
  imports: [TngToggle],
  template: `
    <button
      tngToggle
      data-testid="toggle"
      [pressed]="pressed()"
      [defaultPressed]="defaultPressed()"
      [disabled]="disabled()"
      [ariaLabel]="ariaLabel()"
      [ariaLabelledby]="ariaLabelledby()"
      [ariaDescribedBy]="ariaDescribedBy()"
      (pressedChange)="onPressedChange($event)"
    >
      Bold
    </button>
    <span id="toggle-label">Bold label</span>
    <span id="toggle-desc">Toggle description</span>
  `,
})
class ToggleDirectiveHostComponent {
  public readonly pressed = signal<boolean | null>(null);
  public readonly defaultPressed = signal(false);
  public readonly disabled = signal(false);
  public readonly ariaLabel = signal<string | null>(null);
  public readonly ariaLabelledby = signal<string | null>(null);
  public readonly ariaDescribedBy = signal<string | null>(null);

  public readonly emitted: boolean[] = [];
  public autoSync = false;

  public onPressedChange(nextValue: boolean): void {
    this.emitted.push(nextValue);
    if (this.autoSync) {
      this.pressed.set(nextValue);
    }
  }
}

function queryToggleButton(fixture: ReturnType<typeof TestBed.createComponent>): HTMLButtonElement {
  const button = fixture.nativeElement.querySelector('[data-testid="toggle"]');
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('Expected toggle button.');
  }

  return button;
}

function click(button: HTMLButtonElement): MouseEvent {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    detail: 1,
  });
  button.dispatchEvent(event);
  return event;
}

function keydown(button: HTMLButtonElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });
  button.dispatchEvent(event);
  return event;
}

describe('tngToggle primitive directive', () => {
  it('renders unpressed by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('off');
  });

  it('renders pressed when pressed=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });

  it('supports uncontrolled defaultPressed=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.defaultPressed.set(true);
    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });

  it('is keyboard-focusable when enabled and reports disabled semantics when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.detectChanges();
    const button = queryToggleButton(fixture);
    expect(button.tabIndex).toBe(0);
    expect(button.disabled).toBe(false);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
  });

  it('renders disabled state correctly', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('data-disabled')).toBe(true);
  });

  it('wires aria-label, aria-labelledby, and aria-describedby', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.ariaLabel.set('Bold toggle');
    fixture.componentInstance.ariaLabelledby.set('toggle-label');
    fixture.componentInstance.ariaDescribedBy.set('toggle-desc');
    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.getAttribute('aria-label')).toBe('Bold toggle');
    expect(button.getAttribute('aria-labelledby')).toBe('toggle-label');
    expect(button.getAttribute('aria-describedby')).toBe('toggle-desc');
  });

  it('drops empty aria string values', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.ariaLabel.set('   ');
    fixture.componentInstance.ariaLabelledby.set(' ');
    fixture.componentInstance.ariaDescribedBy.set('');
    fixture.detectChanges();

    const button = queryToggleButton(fixture);
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-labelledby')).toBeNull();
    expect(button.getAttribute('aria-describedby')).toBeNull();
  });

  it('toggles on click in uncontrolled mode and emits pressedChange', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryToggleButton(fixture);

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([true]);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });

  it('toggles with Space and Enter keydown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryToggleButton(fixture);

    const spaceEvent = keydown(button, ' ');
    fixture.detectChanges();
    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(host.emitted).toEqual([true]);
    expect(button.getAttribute('aria-pressed')).toBe('true');

    const enterEvent = keydown(button, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(host.emitted).toEqual([true, false]);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('does not toggle on click when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryToggleButton(fixture);

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([]);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('supports controlled mode without visual mutation until host update', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.componentInstance.pressed.set(false);
    fixture.componentInstance.autoSync = false;
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const button = queryToggleButton(fixture);

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([true]);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('off');
  });

  it('applies focused and focus-visible data attributes on focus lifecycle', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleDirectiveHostComponent],
    }).createComponent(ToggleDirectiveHostComponent);

    fixture.detectChanges();
    const button = queryToggleButton(fixture);

    const originalMatches = button.matches.bind(button);
    const matchesSpy = vi.spyOn(button, 'matches').mockImplementation((selector: string) => {
      if (selector === ':focus-visible') {
        return true;
      }

      return originalMatches(selector);
    });

    button.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    expect(button.hasAttribute('data-focused')).toBe(true);
    expect(button.hasAttribute('data-focus-visible')).toBe(true);

    button.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    expect(button.hasAttribute('data-focused')).toBe(false);
    expect(button.hasAttribute('data-focus-visible')).toBe(false);
    matchesSpy.mockRestore();
  });
});
