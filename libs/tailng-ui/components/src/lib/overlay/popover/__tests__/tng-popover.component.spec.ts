import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngPopoverComponent,
  type TngPopoverCloseReason,
} from '../tng-popover.component';

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
}

function findTrigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement | null {
  return fixture.nativeElement.querySelector('.tng-popover-trigger') as HTMLButtonElement | null;
}

function findPanel(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-popover-panel');
}

function keydown(target: EventTarget, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function pointerdown(target: EventTarget): PointerEvent {
  const event = new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  imports: [TngPopoverComponent],
  template: `
    <tng-popover
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [closeOnEscape]="closeOnEscape()"
      [closeOnOutsidePointer]="closeOnOutsidePointer()"
      [ariaLabel]="ariaLabel()"
      [ariaHasPopup]="ariaHasPopup()"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button" data-testid="inside-first" data-tng-popover-initial-focus>
        First
      </button>
      <button type="button" data-testid="inside-last">Last</button>
    </tng-popover>

    <button type="button" data-testid="outside">Outside</button>
  `,
})
class UncontrolledPopoverHostComponent {
  readonly defaultOpen = signal(false);
  readonly disabled = signal(false);
  readonly closeOnEscape = signal(true);
  readonly closeOnOutsidePointer = signal(true);
  readonly ariaLabel = signal('Actions');
  readonly ariaHasPopup = signal<'dialog' | 'menu' | 'listbox'>('dialog');
  readonly openChanges: boolean[] = [];
  readonly closeReasons: TngPopoverCloseReason[] = [];
}

@Component({
  imports: [TngPopoverComponent],
  template: `
    <tng-popover
      [open]="open()"
      [closeOnEscape]="true"
      [closeOnOutsidePointer]="true"
      (openChange)="openChanges.push($event)"
      (closed)="closeReasons.push($event)"
    >
      <button type="button">Inside</button>
    </tng-popover>
  `,
})
class ControlledPopoverHostComponent {
  readonly open = signal(true);
  readonly openChanges: boolean[] = [];
  readonly closeReasons: TngPopoverCloseReason[] = [];
}

describe('tng-popover component behavior', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the popover component', () => {
    expect(typeof TngPopoverComponent).toBe('function');
  });

  it('renders closed by default with aria/data attributes on trigger and panel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const panel = findPanel(fixture);

    expect(trigger).not.toBeNull();
    expect(panel).not.toBeNull();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog');
    expect(panel?.id).not.toBe('');
    expect(trigger?.getAttribute('aria-controls')).toBe(panel?.id ?? null);
    expect(panel?.getAttribute('hidden')).toBe('');
    expect(panel?.getAttribute('data-slot')).toBe('popover-panel');
  });

  it('supports defaultOpen in uncontrolled mode', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const panel = findPanel(fixture);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(panel?.getAttribute('hidden')).toBeNull();
    expect(panel?.getAttribute('role')).toBe('dialog');
    expect(panel?.getAttribute('aria-label')).toBe('Actions');
  });

  it('trigger toggles uncontrolled open state and emits close reason', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    expect(trigger).not.toBeNull();
    trigger?.click();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();

    trigger?.click();
    await settle(fixture);

    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBe('');
  });

  it('Escape closes when enabled and restores focus to trigger', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    expect(trigger).not.toBeNull();
    trigger?.focus();
    trigger?.click();
    await settle(fixture);

    const event = keydown(document, 'Escape');
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.closeReasons).toEqual(['escape']);
    expect(document.activeElement).toBe(trigger);
  });

  it('outside pointer closes when enabled and does not close when disabled', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.defaultOpen.set(true);

    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['outside-pointer']);

    fixture.componentInstance.closeOnOutsidePointer.set(false);
    fixture.componentInstance.closeReasons.length = 0;
    findTrigger(fixture)?.click();
    await settle(fixture);

    pointerdown(getByTestId<HTMLButtonElement>(fixture, 'outside'));
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual([]);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
  });

  it('disabled prevents opening via trigger click', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    trigger?.click();
    await settle(fixture);

    expect(trigger?.getAttribute('data-disabled')).toBe('');
    expect(findPanel(fixture)?.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('auto-focuses first projected focusable element when opened', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledPopoverHostComponent],
    }).createComponent(UncontrolledPopoverHostComponent);

    await settle(fixture);

    findTrigger(fixture)?.click();
    await settle(fixture);

    expect(document.activeElement).toBe(getByTestId<HTMLButtonElement>(fixture, 'inside-first'));
  });

  it('controlled mode emits close events without mutating host input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledPopoverHostComponent],
    }).createComponent(ControlledPopoverHostComponent);

    await settle(fixture);

    findTrigger(fixture)?.click();
    await settle(fixture);

    expect(fixture.componentInstance.closeReasons).toEqual(['trigger-toggle']);
    expect(fixture.componentInstance.openChanges).toEqual([false]);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(findPanel(fixture)?.getAttribute('hidden')).toBeNull();
  });
});
