import { Component, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  normalizeTngToastDuration,
  normalizeTngToastMaxVisible,
  resolveTngToastNextSlice,
  shouldDismissTngToastForKey,
  TngToastComponent,
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
  standalone: true,
  imports: [TngToastComponent],
  template: `
    <tng-toast
      data-testid="toast"
      [duration]="duration()"
      [maxVisible]="maxVisible()"
      [mode]="mode()"
      [position]="position()"
      (dismissed)="onDismissed($event)"
    ></tng-toast>
  `,
})
class ToastComponentHostComponent {
  public readonly duration = signal(4000);
  public readonly maxVisible = signal(4);
  public readonly mode = signal<TngToastMode>('toast');
  public readonly position = signal<TngToastPosition>('bottom-right');
  public readonly dismissedIds = signal<readonly string[]>([]);

  @ViewChild(TngToastComponent)
  public toastComponent?: TngToastComponent;

  public onDismissed(id: string): void {
    this.dismissedIds.update((current) => [...current, id]);
  }
}

describe('tng-toast component', () => {
  afterEach(() => {
    vi.useRealTimers();
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

  it('dismisses by id and emits dismissed output exactly once', () => {
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
  });

  it('auto-dismisses toast records after duration and emits dismissed output', () => {
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
