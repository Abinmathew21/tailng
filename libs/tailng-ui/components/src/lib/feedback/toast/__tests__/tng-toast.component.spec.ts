import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tngOverlayRuntime } from '../../../overlay/tng-overlay-runtime';
import {
  normalizeTngToastDuration,
  normalizeTngToastMaxVisible,
  resolveTngToastNextSlice,
  shouldDismissTngToastForKey,
  TngToastComponent,
  type TngToastDismissEvent,
  type TngToastMode,
  type TngToastPosition,
} from '../tng-toast.component';

function getByTestId<TElement extends Element>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): TElement {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  if (!(element instanceof Element)) {
    throw new Error(`Expected element for data-testid="${testId}".`);
  }

  return element as TElement;
}

function queryToastItems(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll<HTMLElement>('[data-slot="toast-item"]'),
  );
}

@Component({
  imports: [TngToastComponent],
  template: `
    <button type="button" data-testid="before-toast-focus">Before toast focus</button>
    <button type="button" data-testid="after-toast-focus">After toast focus</button>
    <tng-toast
      data-testid="toast"
      [duration]="duration()"
      [maxVisible]="maxVisible()"
      [mode]="mode()"
      [position]="position()"
      (dismissed)="onDismissed($event)"
      (dismissedWithReason)="onDismissedWithReason($event)"
    ></tng-toast>
  `,
})
class ToastComponentHostComponent {
  public readonly duration = signal(4000);
  public readonly maxVisible = signal(4);
  public readonly mode = signal<TngToastMode>('toast');
  public readonly position = signal<TngToastPosition>('bottom-right');
  public readonly dismissedIds = signal<readonly string[]>([]);
  public readonly dismissedEvents = signal<readonly TngToastDismissEvent[]>([]);
  public readonly dismissEventOrder = signal<readonly string[]>([]);

  @ViewChild(TngToastComponent)
  public toastComponent?: TngToastComponent;

  public onDismissed(id: string): void {
    this.dismissedIds.update((current) => [...current, id]);
    this.dismissEventOrder.update((current) => [...current, `dismissed:${id}`]);
  }

  public onDismissedWithReason(event: TngToastDismissEvent): void {
    this.dismissedEvents.update((current) => [...current, event]);
    this.dismissEventOrder.update((current) => [
      ...current,
      `reason:${event.id}:${event.reason}`,
    ]);
  }
}

describe('tng-toast component', () => {
  afterEach(() => {
    vi.useRealTimers();
    tngOverlayRuntime.clearLayers();
    TestBed.resetTestingModule();
  });

  it('exports the toast component', () => {
    expect(typeof TngToastComponent).toBe('function');
  });

  it('normalizes duration values', () => {
    expect(normalizeTngToastDuration(-10, 4000)).toBe(4000);
    expect(normalizeTngToastDuration(Number.NaN, 4000)).toBe(4000);
    expect(normalizeTngToastDuration(0, 4000)).toBe(0);
    expect(normalizeTngToastDuration(2500, 4000)).toBe(2500);
  });

  it('normalizes max visible values', () => {
    expect(normalizeTngToastMaxVisible(0)).toBe(1);
    expect(normalizeTngToastMaxVisible(Number.NaN)).toBe(1);
    expect(normalizeTngToastMaxVisible(3.8)).toBe(3);
  });

  it('keeps only the latest values based on max visible', () => {
    expect(resolveTngToastNextSlice([1, 2], 4)).toEqual([1, 2]);
    expect(resolveTngToastNextSlice([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });

  it('dismisses on escape key only', () => {
    expect(shouldDismissTngToastForKey('Escape')).toBe(true);
    expect(shouldDismissTngToastForKey('Enter')).toBe(false);
  });

  it('generates deterministic toast ids using the shared id pattern', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const first = toastComponent.show('First');
    const second = toastComponent.show('Second');

    expect(first).toMatch(/^tng-toast-\d+$/);
    expect(second).toMatch(/^tng-toast-\d+$/);
    expect(first).not.toBe(second);
    expect(first).toBe('tng-toast-1');
    expect(second).toBe('tng-toast-2');
  });

  it('renders viewport mode and position attributes from wrapper inputs', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);

    fixture.componentInstance.mode.set('snackbar');
    fixture.componentInstance.position.set('top-left');
    fixture.detectChanges();

    const viewport = getByTestId<HTMLElement>(fixture, 'toast').querySelector(
      '[data-slot="toast-viewport"]',
    );
    expect(viewport).not.toBeNull();
    expect(viewport?.getAttribute('data-mode')).toBe('snackbar');
    expect(viewport?.getAttribute('data-position')).toBe('top-left');
  });

  it('registers an overlay runtime layer while toasts exist and disables outside-pointer dismiss', () => {
    const registerLayerSpy = vi.spyOn(tngOverlayRuntime, 'registerLayer');
    const unregisterLayerSpy = vi.spyOn(tngOverlayRuntime, 'unregisterLayer');

    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const id = toastComponent.show('Overlay registered');
    fixture.detectChanges();

    expect(registerLayerSpy).toHaveBeenCalledTimes(1);
    const registeredLayer = registerLayerSpy.mock.calls[0]?.[0];
    expect(registeredLayer?.dismissOnEscape).toBe(true);
    expect(registeredLayer?.dismissOnOutsidePointer).toBe(false);
    expect(registeredLayer?.id).toMatch(/^tng-toast-layer-\d+$/);

    toastComponent.dismiss(id);
    fixture.detectChanges();

    expect(unregisterLayerSpy).toHaveBeenCalledTimes(1);
    expect(unregisterLayerSpy.mock.calls[0]?.[0]).toBe(registeredLayer?.id);

    registerLayerSpy.mockRestore();
    unregisterLayerSpy.mockRestore();
  });

  it('shows toast items and applies tone semantics from options', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const id = toastComponent.show('Deployment completed', {
      title: 'Success',
      tone: 'success',
    });
    fixture.detectChanges();

    const toastItems = queryToastItems(fixture);
    expect(id).toBe('tng-toast-1');
    expect(toastItems).toHaveLength(1);
    expect(toastItems[0]?.textContent).toContain('Success');
    expect(toastItems[0]?.textContent).toContain('Deployment completed');
    expect(toastItems[0]?.getAttribute('data-tone')).toBe('success');
    expect(toastItems[0]?.getAttribute('role')).toBe('status');
    expect(toastItems[0]?.getAttribute('aria-live')).toBe('polite');
  });

  it('renders an action button and invokes callback before manual dismissal', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const onSelect = vi.fn();
    const id = toastComponent.show('Actionable toast', {
      action: {
        label: 'Undo',
        onSelect,
      },
      title: 'Info',
      tone: 'neutral',
    });
    fixture.detectChanges();

    const actionButton = fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-toast-action');
    if (!(actionButton instanceof HTMLButtonElement)) {
      throw new Error('Expected toast action button.');
    }

    actionButton.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(id);
    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'manual',
      },
    ]);
  });

  it('keeps actionable toast visible when dismissOnSelect is false', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const onSelect = vi.fn();
    const id = toastComponent.show('Pinned action toast', {
      action: {
        dismissOnSelect: false,
        label: 'Retry',
        onSelect,
      },
      title: 'Warning',
      tone: 'warning',
    });
    fixture.detectChanges();

    const actionButton = fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-toast-action');
    if (!(actionButton instanceof HTMLButtonElement)) {
      throw new Error('Expected toast action button.');
    }

    actionButton.click();
    fixture.detectChanges();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(id);
    expect(queryToastItems(fixture)).toHaveLength(1);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([]);
  });

  it('dismisses the latest toast when Escape is pressed globally', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const first = toastComponent.show('First toast');
    const second = toastComponent.show('Second toast');
    fixture.detectChanges();

    const escapeEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    document.dispatchEvent(escapeEvent);
    fixture.detectChanges();

    const remainingItems = queryToastItems(fixture);
    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(remainingItems).toHaveLength(1);
    expect(remainingItems[0]?.textContent).toContain('First toast');
    expect(remainingItems[0]?.textContent).not.toContain('Second toast');
    expect(fixture.componentInstance.dismissedIds()).toEqual([second]);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id: second,
        reason: 'escape',
      },
    ]);
    expect(fixture.componentInstance.dismissEventOrder()).toEqual([
      `reason:${second}:escape`,
      `dismissed:${second}`,
    ]);

    toastComponent.dismiss(first);
    fixture.detectChanges();
  });

  it('restores focus to previously active element when interactive toast is closed with Escape', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const beforeButton = getByTestId<HTMLButtonElement>(fixture, 'before-toast-focus');
    beforeButton.focus();

    const id = toastComponent.show('Interactive focus restore');
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-toast-close');
    if (!(closeButton instanceof HTMLButtonElement)) {
      throw new Error('Expected toast close button.');
    }

    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Escape',
      }),
    );
    fixture.detectChanges();

    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(document.activeElement).toBe(beforeButton);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'escape',
      },
    ]);
  });

  it('restores focus in snackbar mode after Escape when action button is focused', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.componentInstance.mode.set('snackbar');
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const beforeButton = getByTestId<HTMLButtonElement>(fixture, 'before-toast-focus');
    beforeButton.focus();

    const id = toastComponent.show('Snackbar with action', {
      action: {
        dismissOnSelect: false,
        label: 'Undo',
      },
      tone: 'neutral',
    });
    fixture.detectChanges();

    const actionButton = fixture.nativeElement.querySelector<HTMLButtonElement>('.tng-toast-action');
    if (!(actionButton instanceof HTMLButtonElement)) {
      throw new Error('Expected toast action button.');
    }

    actionButton.focus();
    expect(document.activeElement).toBe(actionButton);

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Escape',
      }),
    );
    fixture.detectChanges();

    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(document.activeElement).toBe(beforeButton);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'escape',
      },
    ]);
  });

  it('limits the visible queue to maxVisible latest items', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.componentInstance.maxVisible.set(2);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    toastComponent.show('First toast');
    toastComponent.show('Second toast');
    toastComponent.show('Third toast');
    fixture.detectChanges();

    const messages = queryToastItems(fixture).map((item) => item.textContent?.trim() ?? '');
    expect(messages.join('\n')).not.toContain('First toast');
    expect(messages.join('\n')).toContain('Second toast');
    expect(messages.join('\n')).toContain('Third toast');
  });

  it('dismisses by id and emits reasoned + legacy outputs in deterministic order', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const id = toastComponent.show('Dismiss me');
    fixture.detectChanges();
    expect(queryToastItems(fixture)).toHaveLength(1);

    toastComponent.dismiss(id);
    toastComponent.dismiss(id);
    fixture.detectChanges();

    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(fixture.componentInstance.dismissedIds()).toEqual([id]);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'manual',
      },
    ]);
    expect(fixture.componentInstance.dismissEventOrder()).toEqual([
      `reason:${id}:manual`,
      `dismissed:${id}`,
    ]);
  });

  it('auto-dismisses toast records after duration and emits timeout reason', () => {
    vi.useFakeTimers();

    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.componentInstance.duration.set(120);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const id = toastComponent.show('Auto dismiss');
    fixture.detectChanges();
    expect(queryToastItems(fixture)).toHaveLength(1);

    vi.advanceTimersByTime(121);
    fixture.detectChanges();

    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(fixture.componentInstance.dismissedIds()).toEqual([id]);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'timeout',
      },
    ]);
    expect(fixture.componentInstance.dismissEventOrder()).toEqual([
      `reason:${id}:timeout`,
      `dismissed:${id}`,
    ]);
  });

  it('keeps pinned toasts open when duration is set to 0', () => {
    vi.useFakeTimers();

    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    toastComponent.show('Pinned warning', {
      duration: 0,
      tone: 'warning',
      title: 'Warning',
    });
    fixture.detectChanges();

    vi.advanceTimersByTime(20_000);
    fixture.detectChanges();

    const toastItems = queryToastItems(fixture);
    expect(toastItems).toHaveLength(1);
    expect(toastItems[0]?.getAttribute('role')).toBe('alert');
    expect(toastItems[0]?.getAttribute('aria-live')).toBe('assertive');
  });

  it('does not steal focus on timeout when focus has moved outside the toast viewport', () => {
    vi.useFakeTimers();

    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.componentInstance.duration.set(120);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const beforeButton = getByTestId<HTMLButtonElement>(fixture, 'before-toast-focus');
    const afterButton = getByTestId<HTMLButtonElement>(fixture, 'after-toast-focus');
    beforeButton.focus();
    toastComponent.show('Auto-dismiss focus guard');
    fixture.detectChanges();

    afterButton.focus();
    expect(document.activeElement).toBe(afterButton);

    vi.advanceTimersByTime(121);
    fixture.detectChanges();

    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(document.activeElement).toBe(afterButton);
  });

  it('dismisses an item when Escape is pressed on the focused toast', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    const id = toastComponent.show('Keyboard dismiss');
    fixture.detectChanges();

    const toastItem = queryToastItems(fixture)[0];
    if (toastItem === undefined) {
      throw new Error('Expected rendered toast item.');
    }

    const escapeEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    toastItem.dispatchEvent(escapeEvent);
    fixture.detectChanges();

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(queryToastItems(fixture)).toHaveLength(0);
    expect(fixture.componentInstance.dismissedIds()).toEqual([id]);
    expect(fixture.componentInstance.dismissedEvents()).toEqual([
      {
        id,
        reason: 'escape',
      },
    ]);
  });

  it('ignores non-Escape keys on toast item keydown', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToastComponentHostComponent],
    }).createComponent(ToastComponentHostComponent);
    fixture.detectChanges();

    const toastComponent = fixture.componentInstance.toastComponent;
    if (toastComponent === undefined) {
      throw new Error('Expected toast component instance.');
    }

    toastComponent.show('Still visible');
    fixture.detectChanges();

    const toastItem = queryToastItems(fixture)[0];
    if (toastItem === undefined) {
      throw new Error('Expected rendered toast item.');
    }

    const enterEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
    });
    toastItem.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(false);
    expect(queryToastItems(fixture)).toHaveLength(1);
    expect(fixture.componentInstance.dismissedIds()).toEqual([]);
  });
});
