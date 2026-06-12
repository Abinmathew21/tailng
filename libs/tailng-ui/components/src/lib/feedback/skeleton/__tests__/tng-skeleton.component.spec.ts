import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  resolveTngSkeletonCssSize,
  resolveTngSkeletonMessageInterval,
  TngSkeletonComponent,
  type TngSkeletonMessageMode,
  type TngSkeletonMessageStrategy,
} from '../tng-skeleton.component';

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

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (!(element instanceof Element)) {
    throw new Error(`Expected selector "${selector}" to resolve.`);
  }

  return element as T;
}

@Component({
  imports: [TngSkeletonComponent],
  template: `
    <tng-skeleton
      data-testid="skeleton-host"
      [animated]="animated()"
      [height]="height()"
      [message]="message()"
      [messageInterval]="messageInterval()"
      [messageMode]="messageMode()"
      [messages]="messages()"
      [messageStrategy]="messageStrategy()"
      [rounded]="rounded()"
      [width]="width()"
    ></tng-skeleton>
  `,
})
class SkeletonComponentHostComponent {
  public readonly animated = signal(true);
  public readonly height = signal('1.25rem');
  public readonly message = signal<string | null | undefined>(undefined);
  public readonly messageInterval = signal(5000);
  public readonly messageMode = signal<TngSkeletonMessageMode | undefined>(undefined);
  public readonly messages = signal<readonly string[]>([]);
  public readonly messageStrategy = signal<TngSkeletonMessageStrategy>('once');
  public readonly rounded = signal(true);
  public readonly width = signal('75%');
}

@Component({
  imports: [TngSkeletonComponent],
  template: `
    <tng-skeleton data-testid="projected-skeleton" width="100%" height="1.1rem">
      Preparing projected content...
    </tng-skeleton>
  `,
})
class ProjectedSkeletonHostComponent {}

describe('tng-skeleton component', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('exports skeleton component', () => {
    expect(typeof TngSkeletonComponent).toBe('function');
  });

  it('resolves css size values', () => {
    expect(resolveTngSkeletonCssSize('2rem', '1rem')).toBe('2rem');
    expect(resolveTngSkeletonCssSize('  ', '1rem')).toBe('1rem');
  });

  it('resolves message interval values', () => {
    expect(resolveTngSkeletonMessageInterval(3000)).toBe(3000);
    expect(resolveTngSkeletonMessageInterval(0)).toBe(5000);
    expect(resolveTngSkeletonMessageInterval(Number.NaN)).toBe(5000);
  });

  it('renders skeleton root with decorative semantics and resolved size styles', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const skeleton = getRequired<HTMLElement>(host, '[data-slot="skeleton"]');

    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.getAttribute('role')).toBe('presentation');
    expect(skeleton.getAttribute('data-animated')).toBe('true');
    expect(skeleton.getAttribute('data-rounded')).toBe('true');
    expect(skeleton.style.width).toBe('75%');
    expect(skeleton.style.height).toBe('1.25rem');
  });

  it('updates state and falls back to default size when empty values are provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.animated.set(false);
    fixture.componentInstance.rounded.set(false);
    fixture.componentInstance.width.set('  ');
    fixture.componentInstance.height.set('');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const skeleton = getRequired<HTMLElement>(host, '[data-slot="skeleton"]');

    expect(skeleton.getAttribute('data-animated')).toBe('false');
    expect(skeleton.getAttribute('data-rounded')).toBe('false');
    expect(skeleton.style.width).toBe('100%');
    expect(skeleton.style.height).toBe('1rem');
  });

  it('renders message input as polite status text', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);

    fixture.componentInstance.message.set('Preparing your dashboard...');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const status = getRequired<HTMLElement>(host, '[role="status"]');

    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent?.trim()).toBe('Preparing your dashboard...');
  });

  it('renders projected content when no message input is provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ProjectedSkeletonHostComponent],
    }).createComponent(ProjectedSkeletonHostComponent);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'projected-skeleton');
    const status = getRequired<HTMLElement>(host, '[role="status"]');

    expect(status.textContent?.trim()).toBe('Preparing projected content...');
  });

  it('uses messages as the random source in auto mode', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.65);
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);

    fixture.componentInstance.messages.set([
      'Preparing your dashboard...',
      'Crunching the numbers...',
      'Almost ready...',
    ]);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const status = getRequired<HTMLElement>(host, '[role="status"]');

    expect(status.textContent?.trim()).toBe('Crunching the numbers...');
  });

  it('suppresses messages in none mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);

    fixture.componentInstance.message.set('Preparing your dashboard...');
    fixture.componentInstance.messages.set(['Crunching the numbers...']);
    fixture.componentInstance.messageMode.set('none');
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');

    expect(host.querySelector('[role="status"]')).toBeNull();
  });

  it('does not rotate random messages with once strategy', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9);
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);

    fixture.componentInstance.messageMode.set('random');
    fixture.componentInstance.messageStrategy.set('once');
    fixture.componentInstance.messages.set(['Preparing your dashboard...', 'Almost ready...']);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const status = getRequired<HTMLElement>(host, '[role="status"]');

    expect(status.textContent?.trim()).toBe('Preparing your dashboard...');

    vi.advanceTimersByTime(10000);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('Preparing your dashboard...');
  });

  it('rotates random messages with interval strategy and cleans up old timers', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9).mockReturnValueOnce(0);
    const fixture = TestBed.configureTestingModule({
      imports: [SkeletonComponentHostComponent],
    }).createComponent(SkeletonComponentHostComponent);

    fixture.componentInstance.messageMode.set('random');
    fixture.componentInstance.messageStrategy.set('interval');
    fixture.componentInstance.messageInterval.set(1000);
    fixture.componentInstance.messages.set(['Preparing your dashboard...', 'Almost ready...']);
    fixture.detectChanges();

    const host = getByTestId<HTMLElement>(fixture, 'skeleton-host');
    const status = getRequired<HTMLElement>(host, '[role="status"]');

    expect(status.textContent?.trim()).toBe('Preparing your dashboard...');

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(status.textContent?.trim()).toBe('Almost ready...');

    fixture.componentInstance.messageMode.set('none');
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(host.querySelector('[role="status"]')).toBeNull();
  });
});
