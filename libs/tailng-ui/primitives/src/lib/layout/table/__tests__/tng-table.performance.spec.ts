import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TableVirtualHarnessComponent, getByTestId } from './tng-table.test-harness';

function dispatchScroll(element: HTMLElement, scrollTop: number): void {
  element.scrollTop = scrollTop;
  element.dispatchEvent(new Event('scroll'));
}

describe('tng-table performance and memory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('coalesces rapid virtual scroll bursts into a single rangeChange emission per frame', () => {
    const scheduledFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      scheduledFrames.push(callback);
      return scheduledFrames.length;
    });

    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);
    fixture.detectChanges();

    const scrollContainer = getByTestId<HTMLElement>(fixture, 'virtual-scroll');
    const frameBaseline = scheduledFrames.length;

    dispatchScroll(scrollContainer, 40);
    dispatchScroll(scrollContainer, 80);
    dispatchScroll(scrollContainer, 120);
    fixture.detectChanges();

    const newFrames = scheduledFrames.slice(frameBaseline);
    expect(fixture.componentInstance.rangeChanges()).toEqual([]);

    for (const callback of newFrames) {
      callback(16);
    }
    fixture.detectChanges();

    expect(fixture.componentInstance.rangeChanges()).toEqual([
      Object.freeze({
        end: 6,
        start: 3,
      }),
    ]);
  });

  it('cancels a queued virtual scroll emission when the table tears down', () => {
    const scheduledFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      scheduledFrames.push(callback);
      return scheduledFrames.length;
    });
    const cancelSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation((): void => undefined);

    const fixture = TestBed.configureTestingModule({
      imports: [TableVirtualHarnessComponent],
    }).createComponent(TableVirtualHarnessComponent);
    fixture.detectChanges();
    const cancelBaseline = cancelSpy.mock.calls.length;

    dispatchScroll(getByTestId<HTMLElement>(fixture, 'virtual-scroll'), 200);
    fixture.destroy();

    expect(cancelSpy.mock.calls.length - cancelBaseline).toBe(1);
  });
});
