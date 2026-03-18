import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createOverlayOpenCloseDelayController,
  normalizeOverlayOpenCloseDelay,
} from '../open-close-delay';

describe('overlay open-close delay controller — normalize', () => {
  it('normalizes invalid delay values to zero', () => {
    expect(normalizeOverlayOpenCloseDelay(-1)).toBe(0);
    expect(normalizeOverlayOpenCloseDelay(Number.NaN)).toBe(0);
    expect(normalizeOverlayOpenCloseDelay(0)).toBe(0);
    expect(normalizeOverlayOpenCloseDelay(125)).toBe(125);
  });
});

describe('overlay open-close delay controller — immediate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('applies immediate state transitions when delay is zero', () => {
    const states: boolean[] = [];
    const controller = createOverlayOpenCloseDelayController({
      onStateChange: (nextOpen) => states.push(nextOpen),
    });

    controller.requestOpen(0);
    controller.requestClose(0);

    expect(states).toEqual([true, false]);
  });
});

describe('overlay open-close delay controller — cancellation + lifecycle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('cancels pending open when close is requested', () => {
    vi.useFakeTimers();
    const states: boolean[] = [];
    const controller = createOverlayOpenCloseDelayController({
      onStateChange: (nextOpen) => states.push(nextOpen),
    });

    controller.requestOpen(100);
    vi.advanceTimersByTime(40);
    controller.requestClose(50);
    vi.advanceTimersByTime(49);

    expect(states).toEqual([]);

    vi.advanceTimersByTime(1);
    expect(states).toEqual([false]);
  });

  it('cancels pending close when open is requested', () => {
    vi.useFakeTimers();
    const states: boolean[] = [];
    const controller = createOverlayOpenCloseDelayController({
      onStateChange: (nextOpen) => states.push(nextOpen),
    });

    controller.requestClose(100);
    vi.advanceTimersByTime(30);
    controller.requestOpen(25);
    vi.advanceTimersByTime(24);

    expect(states).toEqual([]);

    vi.advanceTimersByTime(1);
    expect(states).toEqual([true]);
  });

  it('stops emitting after destroy', () => {
    vi.useFakeTimers();
    const states: boolean[] = [];
    const controller = createOverlayOpenCloseDelayController({
      onStateChange: (nextOpen) => states.push(nextOpen),
    });

    controller.requestOpen(50);
    controller.destroy();
    vi.advanceTimersByTime(50);
    controller.requestClose(0);

    expect(states).toEqual([]);
  });
});