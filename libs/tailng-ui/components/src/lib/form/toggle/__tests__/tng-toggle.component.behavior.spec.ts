import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngToggleComponent } from '../tng-toggle.component';

@Component({
  standalone: true,
  imports: [TngToggleComponent],
  template: `
    <span id="toggle-label">Theme mode</span>
    <span id="toggle-desc">Toggle dark and light mode</span>

    <tng-toggle
      data-testid="toggle"
      [pressed]="pressed()"
      [defaultPressed]="defaultPressed()"
      [disabled]="disabled()"
      [ariaLabel]="ariaLabel()"
      [ariaLabelledby]="ariaLabelledby()"
      [ariaDescribedBy]="ariaDescribedBy()"
      [pressedLabel]="pressedLabel()"
      [unpressedLabel]="unpressedLabel()"
      (pressedChange)="onPressedChange($event)"
    >
      <span offIcon data-testid="off-icon">Off icon</span>
      <span onIcon data-testid="on-icon">On icon</span>
      Toggle label
    </tng-toggle>
  `,
})
class ToggleComponentHostComponent {
  public readonly pressed = signal<boolean | null>(null);
  public readonly defaultPressed = signal(false);
  public readonly disabled = signal(false);
  public readonly ariaLabel = signal<string | null>(null);
  public readonly ariaLabelledby = signal<string | null>(null);
  public readonly ariaDescribedBy = signal<string | null>(null);
  public readonly pressedLabel = signal('On');
  public readonly unpressedLabel = signal('Off');

  public readonly emitted: boolean[] = [];
  public autoSync = false;

  public onPressedChange(nextValue: boolean): void {
    this.emitted.push(nextValue);
    if (this.autoSync) {
      this.pressed.set(nextValue);
    }
  }
}

function queryToggleHost(fixture: ReturnType<typeof TestBed.createComponent>): HTMLElement {
  const host = fixture.nativeElement.querySelector('[data-testid="toggle"]');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected tng-toggle host.');
  }

  return host;
}

function queryButton(toggleHost: HTMLElement): HTMLButtonElement {
  const button = toggleHost.querySelector('button');
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('Expected native button inside tng-toggle.');
  }

  return button;
}

function click(button: HTMLButtonElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 });
  button.dispatchEvent(event);
  return event;
}

function keydown(button: HTMLButtonElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  button.dispatchEvent(event);
  return event;
}

describe('tng-toggle component behavior', () => {
  it('renders as button type=button with aria-pressed=false by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.detectChanges();

    const button = queryButton(queryToggleHost(fixture));
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('off');
  });

  it('renders pressed when controlled pressed=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();

    const button = queryButton(queryToggleHost(fixture));
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });

  it('supports uncontrolled defaultPressed=true', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.defaultPressed.set(true);
    fixture.detectChanges();

    const button = queryButton(queryToggleHost(fixture));
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('on');
  });

  it('is keyboard-focusable when enabled and reports disabled semantics when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.detectChanges();
    const button = queryButton(queryToggleHost(fixture));
    expect(button.tabIndex).toBe(0);
    expect(button.disabled).toBe(false);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
  });

  it('toggles on click in uncontrolled mode and emits pressedChange', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButton(queryToggleHost(fixture));

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([true]);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('does not toggle on click when disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButton(queryToggleHost(fixture));

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([]);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.hasAttribute('data-disabled')).toBe(true);
  });

  it('toggles with Space and Enter keydown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButton(queryToggleHost(fixture));

    const spaceEvent = keydown(button, ' ');
    fixture.detectChanges();
    expect(spaceEvent.defaultPrevented).toBe(true);
    expect(host.emitted).toEqual([true]);

    host.autoSync = true;
    host.pressed.set(true);
    fixture.detectChanges();

    const enterEvent = keydown(button, 'Enter');
    fixture.detectChanges();
    expect(enterEvent.defaultPrevented).toBe(true);
    expect(host.emitted).toEqual([true, false]);
  });

  it('supports controlled mode without visual mutation until host sync', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.pressed.set(false);
    fixture.componentInstance.autoSync = false;
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButton(queryToggleHost(fixture));

    click(button);
    fixture.detectChanges();

    expect(host.emitted).toEqual([true]);
    expect(button.getAttribute('aria-pressed')).toBe('false');

    host.pressed.set(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('resolves aria-label from pressed/unpressed labels by default', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.pressedLabel.set('Enabled label');
    fixture.componentInstance.unpressedLabel.set('Disabled label');
    fixture.detectChanges();

    const button = queryButton(queryToggleHost(fixture));
    expect(button.getAttribute('aria-label')).toBe('Disabled label');

    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-label')).toBe('Enabled label');
  });

  it('respects explicit aria-label, aria-labelledby, and aria-describedby', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.componentInstance.ariaLabel.set('Explicit toggle label');
    fixture.componentInstance.ariaLabelledby.set('toggle-label');
    fixture.componentInstance.ariaDescribedBy.set('toggle-desc');
    fixture.detectChanges();

    const button = queryButton(queryToggleHost(fixture));
    expect(button.getAttribute('aria-label')).toBe('Explicit toggle label');
    expect(button.getAttribute('aria-labelledby')).toBe('toggle-label');
    expect(button.getAttribute('aria-describedby')).toBe('toggle-desc');
  });

  it('renders projected on/off icon slots', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleComponentHostComponent],
    }).createComponent(ToggleComponentHostComponent);

    fixture.detectChanges();
    let toggleHost = queryToggleHost(fixture);
    expect(toggleHost.querySelector('[data-testid="off-icon"]')?.textContent?.trim()).toBe(
      'Off icon',
    );
    expect(toggleHost.querySelector('[data-testid="on-icon"]')).toBeNull();

    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    toggleHost = queryToggleHost(fixture);
    expect(toggleHost.querySelector('[data-testid="on-icon"]')?.textContent?.trim()).toBe(
      'On icon',
    );
  });
});
