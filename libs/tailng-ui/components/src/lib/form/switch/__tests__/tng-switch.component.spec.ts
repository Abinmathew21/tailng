import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  resolveTngSwitchArrowKey,
  toggleTngSwitchState,
  TngSwitchComponent,
} from '../tng-switch.component';

function querySwitchHost(fixture: ComponentFixture<unknown>, testId: string): HTMLElement {
  const host = (fixture.nativeElement as HTMLElement).querySelector(`[data-testid="${testId}"]`);
  if (!(host instanceof HTMLElement)) {
    throw new Error(`Expected switch host for data-testid="${testId}".`);
  }

  return host;
}

function queryRoot(switchHost: HTMLElement): HTMLDivElement {
  const root = switchHost.querySelector('.tng-switch-root');
  if (!(root instanceof HTMLDivElement)) {
    throw new Error('Expected .tng-switch-root element.');
  }

  return root;
}

function queryControl(switchHost: HTMLElement): HTMLButtonElement {
  const control = switchHost.querySelector('.tng-switch-control');
  if (!(control instanceof HTMLButtonElement)) {
    throw new Error('Expected .tng-switch-control button element.');
  }

  return control;
}

function queryNativeInput(switchHost: HTMLElement): HTMLInputElement {
  const nativeInput = switchHost.querySelector('.tng-switch-native-input');
  if (!(nativeInput instanceof HTMLInputElement)) {
    throw new Error('Expected .tng-switch-native-input input element.');
  }

  return nativeInput;
}

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function click(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `<tng-switch data-testid="default-switch">Projected label</tng-switch>`,
})
class DefaultSwitchHostComponent {}

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `<tng-switch data-testid="no-icon-switch">Label only</tng-switch>`,
})
class NoIconSwitchHostComponent {}

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `
    <tng-switch data-testid="checked-attr" checked="">Checked attr</tng-switch>
    <tng-switch data-testid="disabled-attr" disabled="">Disabled attr</tng-switch>
    <tng-switch data-testid="required-attr" required="">Required attr</tng-switch>
  `,
})
class CoercionSwitchHostComponent {}

@Component({
  standalone: true,
  imports: [TngSwitchComponent],
  template: `
    <tng-switch
      data-testid="binding-switch"
      [ariaLabel]="ariaLabel()"
      [checked]="checked()"
      [disabled]="disabled()"
      [required]="required()"
      [name]="name()"
      [value]="value()"
      (checkedChange)="onCheckedChange($event)"
    >
      {{ label() }}
      <span offIcon data-testid="off-icon">OFF</span>
      <span onIcon data-testid="on-icon">ON</span>
    </tng-switch>
  `,
})
class BindingSwitchHostComponent {
  public readonly ariaLabel = signal<string | null>(null);
  public readonly checked = signal(false);
  public readonly disabled = signal(false);
  public readonly required = signal(false);
  public readonly name = signal<string | null>(null);
  public readonly value = signal('on');
  public readonly label = signal('Switch label');

  public readonly emitted: boolean[] = [];
  public autoSync = false;

  public onCheckedChange(nextValue: boolean): void {
    this.emitted.push(nextValue);
    if (this.autoSync) {
      this.checked.set(nextValue);
    }
  }
}

describe('tng-switch component behavior blocks A-K', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('A) Smoke / render', () => {
    it('renders the switch component without errors with default inputs', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'default-switch');
      expect(queryControl(switchHost)).toBeTruthy();
      expect(queryNativeInput(switchHost)).toBeTruthy();
    });

    it('renders projected label content inside the label slot', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      const label = querySwitchHost(fixture, 'default-switch').querySelector('.tng-switch-label');
      expect(label?.textContent?.trim()).toBe('Projected label');
    });

    it('renders without projected icons and does not throw', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [NoIconSwitchHostComponent],
      }).createComponent(NoIconSwitchHostComponent);

      expect(() => fixture.detectChanges()).not.toThrow();
      const switchHost = querySwitchHost(fixture, 'no-icon-switch');
      expect(queryControl(switchHost)).toBeTruthy();
    });

    it('applies data-disabled attribute on the root only when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();

      let root = queryRoot(querySwitchHost(fixture, 'binding-switch'));
      expect(root.getAttribute('data-disabled')).toBeNull();

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      root = queryRoot(querySwitchHost(fixture, 'binding-switch'));
      expect(root.hasAttribute('data-disabled')).toBe(true);
    });
  });

  describe('B) Defaults & input coercion', () => {
    it('defaults checked to false when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'default-switch');
      const control = queryControl(switchHost);
      const nativeInput = queryNativeInput(switchHost);

      expect(control.getAttribute('aria-checked')).toBe('false');
      expect(nativeInput.checked).toBe(false);
    });

    it('coerces checked="" to true via booleanAttribute', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CoercionSwitchHostComponent],
      }).createComponent(CoercionSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'checked-attr');
      const control = queryControl(switchHost);
      const nativeInput = queryNativeInput(switchHost);

      expect(control.getAttribute('aria-checked')).toBe('true');
      expect(nativeInput.checked).toBe(true);
    });

    it('defaults disabled to false when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      const control = queryControl(querySwitchHost(fixture, 'default-switch'));
      expect(control.disabled).toBe(false);
    });

    it('coerces disabled="" to true via booleanAttribute', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CoercionSwitchHostComponent],
      }).createComponent(CoercionSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'disabled-attr');
      const control = queryControl(switchHost);
      const root = queryRoot(switchHost);

      expect(control.disabled).toBe(true);
      expect(root.hasAttribute('data-disabled')).toBe(true);
    });

    it('defaults required to false when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'default-switch');
      const control = queryControl(switchHost);
      const nativeInput = queryNativeInput(switchHost);

      expect(control.getAttribute('aria-required')).toBeNull();
      expect(nativeInput.required).toBe(false);
    });

    it('coerces required="" to true via booleanAttribute', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [CoercionSwitchHostComponent],
      }).createComponent(CoercionSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'required-attr');
      const control = queryControl(switchHost);
      const nativeInput = queryNativeInput(switchHost);

      expect(control.getAttribute('aria-required')).toBe('true');
      expect(nativeInput.required).toBe(true);
    });

    it('defaults native input value to "on" when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'default-switch')).value).toBe('on');
    });

    it('defaults ariaLabel to null when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      expect(queryControl(querySwitchHost(fixture, 'default-switch')).getAttribute('aria-label')).toBeNull();
    });

    it('defaults name to null when not provided', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [DefaultSwitchHostComponent],
      }).createComponent(DefaultSwitchHostComponent);

      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'default-switch')).getAttribute('name')).toBeNull();
    });
  });

  describe('C) Primitive wiring (integration contract)', () => {
    it('passes ariaLabel to the tngSwitch primitive host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.ariaLabel.set('Toggle notifications');
      fixture.detectChanges();

      expect(queryControl(querySwitchHost(fixture, 'binding-switch')).getAttribute('aria-label')).toBe(
        'Toggle notifications',
      );
    });

    it('passes checked to the tngSwitch primitive host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));
      expect(control.getAttribute('aria-checked')).toBe('true');
      expect(control.getAttribute('data-state')).toBe('checked');
    });

    it('passes disabled to the tngSwitch primitive host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));
      expect(control.disabled).toBe(true);
      expect(control.hasAttribute('data-disabled')).toBe(true);
    });

    it('passes required to the tngSwitch primitive host', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.required.set(true);
      fixture.detectChanges();

      expect(queryControl(querySwitchHost(fixture, 'binding-switch')).getAttribute('aria-required')).toBe('true');
    });
  });

  describe('D) Click toggling behavior', () => {
    it('clicking the control emits checkedChange with the toggled value when enabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      click(queryControl(querySwitchHost(fixture, 'binding-switch')));

      expect(fixture.componentInstance.emitted).toEqual([true]);
    });

    it('clicking the control does not emit checkedChange when disabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      click(queryControl(querySwitchHost(fixture, 'binding-switch')));

      expect(fixture.componentInstance.emitted).toEqual([]);
    });

    it('two consecutive clicks emit alternating checked values when enabled', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.autoSync = true;
      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));
      click(control);
      fixture.detectChanges();
      click(control);

      expect(fixture.componentInstance.emitted).toEqual([true, false]);
    });
  });

  describe('E) Keyboard arrow behavior (onKeydown)', () => {
    it('ArrowLeft sets next checked state to false and emits checkedChange when currently true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'ArrowLeft');

      expect(event.defaultPrevented).toBe(true);
      expect(fixture.componentInstance.emitted).toEqual([false]);
    });

    it('ArrowRight sets next checked state to true and emits checkedChange when currently false', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'ArrowRight');

      expect(event.defaultPrevented).toBe(true);
      expect(fixture.componentInstance.emitted).toEqual([true]);
    });

    it('ArrowLeft does not emit when already unchecked', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'ArrowLeft');

      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.emitted).toEqual([]);
    });

    it('ArrowRight does not emit when already checked', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'ArrowRight');

      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.emitted).toEqual([]);
    });

    it('non-arrow keys do not emit and do not call preventDefault', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'Enter');

      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.emitted).toEqual([]);
    });

    it('when disabled, keydown does not emit and does not call preventDefault', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      const event = keydown(queryControl(querySwitchHost(fixture, 'binding-switch')), 'ArrowLeft');

      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.emitted).toEqual([]);
    });
  });

  describe('F) PreventDefault contract for arrow keys', () => {
    it('calls preventDefault only when ArrowLeft/ArrowRight would change the state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      const leftEvent = keydown(control, 'ArrowLeft');

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      const rightEvent = keydown(control, 'ArrowRight');

      expect(leftEvent.defaultPrevented).toBe(true);
      expect(rightEvent.defaultPrevented).toBe(true);
    });

    it('does not call preventDefault when ArrowLeft/ArrowRight would not change the state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      const leftEvent = keydown(control, 'ArrowLeft');

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      const rightEvent = keydown(control, 'ArrowRight');

      expect(leftEvent.defaultPrevented).toBe(false);
      expect(rightEvent.defaultPrevented).toBe(false);
    });
  });

  describe('G) Icon slot rendering', () => {
    it('when checked is true, renders [onIcon] and hides [offIcon]', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(switchHost.querySelector('[data-testid="on-icon"]')).not.toBeNull();
      expect(switchHost.querySelector('[data-testid="off-icon"]')).toBeNull();
    });

    it('when checked is false, renders [offIcon] and hides [onIcon]', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(switchHost.querySelector('[data-testid="off-icon"]')).not.toBeNull();
      expect(switchHost.querySelector('[data-testid="on-icon"]')).toBeNull();
    });

    it('icon container is marked aria-hidden="true" in both states', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      let iconContainer = querySwitchHost(fixture, 'binding-switch').querySelector('.tng-switch-icon');
      expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      iconContainer = querySwitchHost(fixture, 'binding-switch').querySelector('.tng-switch-icon');
      expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');
    });

    it('switching checked at runtime swaps the rendered icon slot content', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      expect(querySwitchHost(fixture, 'binding-switch').querySelector('[data-testid="off-icon"]')).not.toBeNull();

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      expect(querySwitchHost(fixture, 'binding-switch').querySelector('[data-testid="on-icon"]')).not.toBeNull();
      expect(querySwitchHost(fixture, 'binding-switch').querySelector('[data-testid="off-icon"]')).toBeNull();
    });
  });

  describe('H) Native checkbox mirroring (form support)', () => {
    it('mirrors checked to the hidden native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).checked).toBe(true);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).checked).toBe(false);
    });

    it('mirrors disabled to the hidden native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).disabled).toBe(true);
    });

    it('mirrors required to the hidden native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.required.set(true);
      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).required).toBe(true);
    });

    it('mirrors name to the hidden native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.name.set('feature-flag');
      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).getAttribute('name')).toBe('feature-flag');
    });

    it('mirrors value to the hidden native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.value.set('enabled');
      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).value).toBe('enabled');
    });

    it('native checkbox input has tabindex="-1" and aria-hidden="true"', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.detectChanges();

      const nativeInput = queryNativeInput(querySwitchHost(fixture, 'binding-switch'));
      expect(nativeInput.getAttribute('tabindex')).toBe('-1');
      expect(nativeInput.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('I) Label behavior & accessibility basics', () => {
    it('renders label slot content regardless of checked state', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.label.set('Notifications');
      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      let labelText =
        querySwitchHost(fixture, 'binding-switch').querySelector('.tng-switch-label')?.textContent?.trim() ?? '';
      expect(labelText).toContain('Notifications');

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      labelText = querySwitchHost(fixture, 'binding-switch').querySelector('.tng-switch-label')?.textContent?.trim() ?? '';
      expect(labelText).toContain('Notifications');
    });

    it('does not make the hidden native checkbox focusable (tabindex invariant)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.detectChanges();

      expect(queryNativeInput(querySwitchHost(fixture, 'binding-switch')).tabIndex).toBe(-1);
    });

    it('does not add duplicate focus stops (only the button is focusable)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'binding-switch');
      const control = queryControl(switchHost);

      const focusStops = Array.from(switchHost.querySelectorAll<HTMLElement>('*')).filter(
        (element) => !element.hasAttribute('disabled') && element.tabIndex >= 0,
      );

      expect(focusStops).toHaveLength(1);
      expect(focusStops[0]).toBe(control);
    });
  });

  describe('J) Runtime updates', () => {
    it('updating checked input updates the primitive host and native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();

      let switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(queryControl(switchHost).getAttribute('aria-checked')).toBe('false');
      expect(queryNativeInput(switchHost).checked).toBe(false);

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();

      switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(queryControl(switchHost).getAttribute('aria-checked')).toBe('true');
      expect(queryNativeInput(switchHost).checked).toBe(true);
    });

    it('updating disabled input updates root data-disabled and blocks interactions', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();
      click(queryControl(querySwitchHost(fixture, 'binding-switch')));
      expect(fixture.componentInstance.emitted).toEqual([true]);

      fixture.componentInstance.emitted.length = 0;
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      const switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(queryRoot(switchHost).hasAttribute('data-disabled')).toBe(true);

      click(queryControl(switchHost));
      expect(fixture.componentInstance.emitted).toEqual([]);
    });

    it('updating required input updates the primitive host and native checkbox input', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.required.set(false);
      fixture.detectChanges();

      let switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(queryControl(switchHost).getAttribute('aria-required')).toBeNull();
      expect(queryNativeInput(switchHost).required).toBe(false);

      fixture.componentInstance.required.set(true);
      fixture.detectChanges();

      switchHost = querySwitchHost(fixture, 'binding-switch');
      expect(queryControl(switchHost).getAttribute('aria-required')).toBe('true');
      expect(queryNativeInput(switchHost).required).toBe(true);
    });

    it('updating name and value updates the native checkbox input attributes', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.name.set('delivery-updates');
      fixture.componentInstance.value.set('yes');
      fixture.detectChanges();

      const nativeInput = queryNativeInput(querySwitchHost(fixture, 'binding-switch'));
      expect(nativeInput.getAttribute('name')).toBe('delivery-updates');
      expect(nativeInput.value).toBe('yes');
    });
  });

  describe('K) Edge cases', () => {
    it('handles ariaLabel as empty string by passing it through (or omitting)', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      fixture.componentInstance.ariaLabel.set('');
      fixture.detectChanges();

      const ariaLabel = queryControl(querySwitchHost(fixture, 'binding-switch')).getAttribute('aria-label');
      expect(ariaLabel === '' || ariaLabel === null).toBe(true);
    });

    it('does not throw when name is null and required is true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      expect(() => {
        fixture.componentInstance.name.set(null);
        fixture.componentInstance.required.set(true);
        fixture.detectChanges();
      }).not.toThrow();

      const nativeInput = queryNativeInput(querySwitchHost(fixture, 'binding-switch'));
      expect(nativeInput.required).toBe(true);
      expect(nativeInput.getAttribute('name')).toBeNull();
    });

    it('does not emit checkedChange for repeated ArrowLeft when unchecked or ArrowRight when checked', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [BindingSwitchHostComponent],
      }).createComponent(BindingSwitchHostComponent);

      const control = queryControl(querySwitchHost(fixture, 'binding-switch'));

      fixture.componentInstance.checked.set(false);
      fixture.detectChanges();
      keydown(control, 'ArrowLeft');
      keydown(control, 'ArrowLeft');

      fixture.componentInstance.checked.set(true);
      fixture.detectChanges();
      keydown(control, 'ArrowRight');
      keydown(control, 'ArrowRight');

      expect(fixture.componentInstance.emitted).toEqual([]);
    });
  });

  describe('helper coverage', () => {
    it('exports the switch component', () => {
      expect(typeof TngSwitchComponent).toBe('function');
    });

    it('toggles checked state helper', () => {
      expect(toggleTngSwitchState(true)).toBe(false);
      expect(toggleTngSwitchState(false)).toBe(true);
    });

    it('maps arrow keys to deterministic switch state helper', () => {
      expect(resolveTngSwitchArrowKey('ArrowLeft')).toBe(false);
      expect(resolveTngSwitchArrowKey('ArrowRight')).toBe(true);
      expect(resolveTngSwitchArrowKey('Enter')).toBeNull();
    });
  });
});
