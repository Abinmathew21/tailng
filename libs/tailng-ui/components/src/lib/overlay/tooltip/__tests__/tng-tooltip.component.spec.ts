import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  normalizeTngTooltipDelay,
  shouldCloseTngTooltipForKey,
  TngTooltipComponent,
} from '../tng-tooltip.component';

function findTrigger(fixture: { nativeElement: HTMLElement }): HTMLButtonElement | null {
  return fixture.nativeElement.querySelector('.tng-tooltip-trigger') as HTMLButtonElement | null;
}

function findContent(fixture: { nativeElement: HTMLElement }): HTMLElement | null {
  return fixture.nativeElement.querySelector('.tng-tooltip-content');
}

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect;
}

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

@Component({
  imports: [TngTooltipComponent],
  template: `
    <tng-tooltip
      [ariaLabel]="ariaLabel()"
      [openDelay]="openDelay()"
      [closeDelay]="closeDelay()"
      [disabled]="disabled()"
      [side]="side()"
      [text]="text()"
      [triggerLabel]="triggerLabel()"
      (openChange)="openChanges.push($event)"
    />
  `,
})
class TooltipHostComponent {
  readonly ariaLabel = signal<string | null>('More info');
  readonly openDelay = signal(120);
  readonly closeDelay = signal(60);
  readonly disabled = signal(false);
  readonly side = signal<'top' | 'right' | 'bottom' | 'left'>('top');
  readonly text = signal('Tooltip body');
  readonly triggerLabel = signal('Info');
  readonly openChanges: boolean[] = [];
}

describe('tng-tooltip component behavior', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports the tooltip component', () => {
    expect(typeof TngTooltipComponent).toBe('function');
  });

  it('normalizes invalid delay values', () => {
    expect(normalizeTngTooltipDelay(-1)).toBe(0);
    expect(normalizeTngTooltipDelay(Number.NaN)).toBe(0);
    expect(normalizeTngTooltipDelay(125)).toBe(125);
  });

  it('closes on escape key only', () => {
    expect(shouldCloseTngTooltipForKey('Escape')).toBe(true);
    expect(shouldCloseTngTooltipForKey('Enter')).toBe(false);
  });

  it('renders closed by default with tooltip semantics', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();
    expect(trigger?.textContent?.trim()).toBe('Info');
    expect(trigger?.getAttribute('aria-label')).toBe('More info');
    expect(trigger?.getAttribute('aria-describedby')).toBeNull();
    expect(trigger?.getAttribute('data-state')).toBe('closed');
    expect(content?.textContent?.trim()).toBe('Tooltip body');
    expect(content?.getAttribute('role')).toBe('tooltip');
    expect(content?.getAttribute('data-slot')).toBe('tooltip-content');
    expect(content?.getAttribute('data-state')).toBe('closed');
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('opens on mouseenter after delay and closes on mouseleave after delay', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(40);
    fixture.componentInstance.closeDelay.set(30);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    trigger?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await settle(fixture);

    vi.advanceTimersByTime(39);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');

    vi.advanceTimersByTime(1);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();
    expect(trigger?.getAttribute('aria-describedby')).toBe(content?.id ?? null);

    trigger?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await settle(fixture);

    vi.advanceTimersByTime(29);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    vi.advanceTimersByTime(1);
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');
    expect(trigger?.getAttribute('aria-describedby')).toBeNull();
    expect(fixture.componentInstance.openChanges).toEqual([true, false]);
  });

  it('opens on focus and closes on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    trigger?.dispatchEvent(new FocusEvent('blur'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('closes when Escape is pressed while open', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);
    expect(content?.getAttribute('hidden')).toBeNull();

    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' });
    trigger?.dispatchEvent(event);
    await settle(fixture);

    expect(event.defaultPrevented).toBe(true);
    expect(content?.getAttribute('hidden')).toBe('');
  });

  it('disabled prevents opening and exposes disabled data hook', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);
    fixture.componentInstance.disabled.set(true);

    await settle(fixture);

    const root = fixture.nativeElement.querySelector('.tng-tooltip-root') as HTMLElement | null;
    const trigger = findTrigger(fixture);
    const content = findContent(fixture);

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);

    expect(root?.getAttribute('data-disabled')).toBe('');
    expect(trigger?.hasAttribute('disabled')).toBe(true);
    expect(content?.getAttribute('hidden')).toBe('');
    expect(fixture.componentInstance.openChanges).toEqual([]);
  });

  it('reacts to side changes through content data-side', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.side.set('left');

    await settle(fixture);
    expect(findContent(fixture)?.getAttribute('data-side')).toBe('left');

    fixture.componentInstance.side.set('bottom');
    await settle(fixture);
    expect(findContent(fixture)?.getAttribute('data-side')).toBe('bottom');
  });

  it('uses edge-aware CDK positioning and flips tooltip side near viewport bounds', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 360 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 220 });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      callback(0);
      return 1;
    });

    const fixture = TestBed.configureTestingModule({
      imports: [TooltipHostComponent],
    }).createComponent(TooltipHostComponent);
    fixture.componentInstance.openDelay.set(0);
    fixture.componentInstance.closeDelay.set(0);
    fixture.componentInstance.side.set('bottom');

    await settle(fixture);

    const trigger = findTrigger(fixture);
    const content = findContent(fixture);
    expect(trigger).not.toBeNull();
    expect(content).not.toBeNull();

    vi.spyOn(trigger!, 'getBoundingClientRect').mockReturnValue(createRect(120, 170, 80, 20));
    vi.spyOn(content!, 'getBoundingClientRect').mockReturnValue(createRect(0, 0, 160, 72));

    trigger?.dispatchEvent(new FocusEvent('focus'));
    await settle(fixture);

    expect(content?.getAttribute('data-side')).toBe('top');
    expect(content?.style.left).toBe('80px');
    expect(content?.style.top).toBe('90px');
  });
});
