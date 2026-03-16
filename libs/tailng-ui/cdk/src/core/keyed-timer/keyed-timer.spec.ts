import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createTngKeyedTimerController,
  normalizeTngKeyedTimerDelay,
} from './keyed-timer';

describe('keyed timer controller', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('normalizes invalid delays to zero', () => {
    expect(normalizeTngKeyedTimerDelay(-1)).toBe(0);
    expect(normalizeTngKeyedTimerDelay(Number.NaN)).toBe(0);
    expect(normalizeTngKeyedTimerDelay(0)).toBe(0);
    expect(normalizeTngKeyedTimerDelay(120)).toBe(120);
  });

  it('schedules callback per key and forwards the same key', () => {
    vi.useFakeTimers();
    const controller = createTngKeyedTimerController<string>();
    const fired: string[] = [];

    controller.schedule('toast-1', 80, (key) => fired.push(key));
    vi.advanceTimersByTime(79);
    expect(fired).toEqual([]);

    vi.advanceTimersByTime(1);
    expect(fired).toEqual(['toast-1']);
  });

  it('replaces an existing timer when scheduling same key again', () => {
    vi.useFakeTimers();
    const controller = createTngKeyedTimerController<string>();
    const fired: string[] = [];

    controller.schedule('toast-1', 100, (key) => fired.push(`first-${key}`));
    vi.advanceTimersByTime(40);
    controller.schedule('toast-1', 30, (key) => fired.push(`second-${key}`));

    vi.advanceTimersByTime(29);
    expect(fired).toEqual([]);

    vi.advanceTimersByTime(1);
    expect(fired).toEqual(['second-toast-1']);
  });

  it('cancels only the provided key', () => {
    vi.useFakeTimers();
    const controller = createTngKeyedTimerController<string>();
    const fired: string[] = [];

    controller.schedule('toast-1', 40, (key) => fired.push(key));
    controller.schedule('toast-2', 50, (key) => fired.push(key));
    controller.cancel('toast-1');

    vi.advanceTimersByTime(50);
    expect(fired).toEqual(['toast-2']);
  });

  it('clears all scheduled timers', () => {
    vi.useFakeTimers();
    const controller = createTngKeyedTimerController<string>();
    const fired: string[] = [];

    controller.schedule('toast-1', 30, (key) => fired.push(key));
    controller.schedule('toast-2', 35, (key) => fired.push(key));
    controller.clearAll();

    vi.advanceTimersByTime(40);
    expect(fired).toEqual([]);
  });
});
