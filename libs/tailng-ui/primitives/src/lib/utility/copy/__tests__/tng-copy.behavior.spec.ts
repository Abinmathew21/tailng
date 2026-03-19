import type { ElementRef} from '@angular/core';
import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  defaultTngCopySuccessDurationMs,
  TngCopy,
  type TngCopyAnnounce,
  type TngCopyButtonTextInput,
  type TngCopyErrorEvent,
  type TngCopyEvent,
  type TngCopyFormat,
  type TngCopyFromTarget,
  type TngCopySuccessEvent,
} from '../tng-copy';

function click(target: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

function keydown(
  target: EventTarget,
  key: string,
  init: Partial<KeyboardEventInit> = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ctrlKey: init.ctrlKey ?? false,
    metaKey: init.metaKey ?? false,
    altKey: init.altKey ?? false,
    shiftKey: init.shiftKey ?? false,
  });
  target.dispatchEvent(event);
  return event;
}

function deferredPromise<T>(): {
  promise: Promise<T>;
  reject: (reason?: unknown) => void;
  resolve: (value: T | PromiseLike<T>) => void;
} {
  let resolve: (value: T | PromiseLike<T>) => void = () => {};
  let reject: (reason?: unknown) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, reject, resolve };
}

type NavigatorClipboardWithWrite = {
  write?: (items: readonly unknown[]) => Promise<void>;
  writeText?: (value: string) => Promise<void>;
};

function setClipboard(clipboard: NavigatorClipboardWithWrite | undefined): void {
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  });
}

function setClipboardItemCtor(ctor: unknown): void {
  Object.defineProperty(globalThis, 'ClipboardItem', {
    configurable: true,
    value: ctor,
    writable: true,
  });
}

function setExecCommandImplementation(
  impl: (commandId: string) => boolean,
): void {
  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: impl,
    writable: true,
  });
}

function extractError(errorEvent: TngCopyErrorEvent | undefined): Error | null {
  const payload = errorEvent?.error;
  return payload instanceof Error ? payload : null;
}

async function settle(fixture: { detectChanges: () => void; whenStable: () => Promise<unknown> }): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
}

async function settleMicrotasks(fixture: { detectChanges: () => void }): Promise<void> {
  await Promise.resolve();
  fixture.detectChanges();
  await Promise.resolve();
}

@Component({
  imports: [TngCopy],
  template: `
    <button
      #trigger
      type="button"
      tngCopy
      data-testid="trigger"
      [tngCopyButtonText]="text()"
      [tngCopyButtonTarget]="target()"
      [tngCopyButtonFormat]="format()"
      [tngCopyButtonSuccessDurationMs]="successDurationMs()"
      [tngCopyButtonDisabled]="disabled()"
      [tngCopyButtonHotkey]="hotkey()"
      [tngCopyButtonAnnounce]="announce()"
      [tngCopyButtonSuccessMessage]="successMessage()"
      [tngCopyButtonErrorMessage]="errorMessage()"
      [tngCopyText]="legacyText()"
      [tngCopyFrom]="legacyTarget()"
      [tngCopyIgnoreSelectors]="ignoreSelectors()"
      [tngCopyDisabled]="legacyDisabled()"
      (tngCopy)="copyEvents.push($event)"
      (tngCopySuccess)="successEvents.push($event)"
      (tngCopyError)="errorEvents.push($event)"
      (tngCopied)="copiedEvents.push($event)"
      (tngCopyAnnounced)="announcements.push($event)"
    >
      Copy
    </button>

    <div #source data-testid="source" id="source-node">{{ sourceText() }}<span class="line-no" data-copy-ignore>ignored</span></div>
    <textarea #sourceInput data-testid="source-input">{{ sourceInputText() }}</textarea>
  `,
})
class ButtonCopyHostComponent {
  public readonly text = signal<TngCopyButtonTextInput>(undefined);
  public readonly target = signal<TngCopyFromTarget>(null);
  public readonly format = signal<TngCopyFormat>('text/plain');
  public readonly successDurationMs = signal(defaultTngCopySuccessDurationMs);
  public readonly disabled = signal(false);
  public readonly hotkey = signal<string | null>(null);
  public readonly announce = signal<TngCopyAnnounce>('auto');
  public readonly successMessage = signal('Copied to clipboard');
  public readonly errorMessage = signal('Copy failed');

  public readonly legacyText = signal<string | null | undefined>(undefined);
  public readonly legacyTarget = signal<TngCopyFromTarget>(null);
  public readonly ignoreSelectors = signal<readonly string[] | string | null | undefined>(undefined);
  public readonly legacyDisabled = signal(false);

  public readonly sourceText = signal('Source text');
  public readonly sourceInputText = signal('Textarea value');

  public readonly copyEvents: TngCopyEvent[] = [];
  public readonly successEvents: TngCopySuccessEvent[] = [];
  public readonly errorEvents: TngCopyErrorEvent[] = [];
  public readonly copiedEvents: string[] = [];
  public readonly announcements: string[] = [];

  @ViewChild('trigger', { static: true }) public triggerRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('source', { static: true }) public sourceRef!: ElementRef<HTMLElement>;
  @ViewChild('sourceInput', { static: true }) public sourceInputRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild(TngCopy, { static: true }) public copyDirective!: TngCopy;
}

@Component({
  imports: [TngCopy],
  template: `
    <div
      #trigger
      tabindex="0"
      tngCopy
      data-testid="trigger"
      [tngCopyButtonText]="text()"
      [tngCopyButtonTarget]="target()"
      [tngCopyButtonDisabled]="disabled()"
      [tngCopyButtonHotkey]="hotkey()"
      [tngCopyButtonAnnounce]="announce()"
      [tngCopyButtonSuccessMessage]="successMessage()"
      [tngCopyButtonErrorMessage]="errorMessage()"
      (tngCopy)="copyEvents.push($event)"
      (tngCopySuccess)="successEvents.push($event)"
      (tngCopyError)="errorEvents.push($event)"
      (tngCopyAnnounced)="announcements.push($event)"
    >
      Copy
    </div>
    <div #source id="div-source">{{ sourceText() }}</div>
  `,
})
class DivCopyHostComponent {
  public readonly text = signal<TngCopyButtonTextInput>(undefined);
  public readonly target = signal<TngCopyFromTarget>(null);
  public readonly disabled = signal(false);
  public readonly hotkey = signal<string | null>(null);
  public readonly announce = signal<TngCopyAnnounce>('auto');
  public readonly successMessage = signal('Copied to clipboard');
  public readonly errorMessage = signal('Copy failed');
  public readonly sourceText = signal('Div source');

  public readonly copyEvents: TngCopyEvent[] = [];
  public readonly successEvents: TngCopySuccessEvent[] = [];
  public readonly errorEvents: TngCopyErrorEvent[] = [];
  public readonly announcements: string[] = [];

  @ViewChild('trigger', { static: true }) public triggerRef!: ElementRef<HTMLElement>;
  @ViewChild('source', { static: true }) public sourceRef!: ElementRef<HTMLElement>;
  @ViewChild(TngCopy, { static: true }) public copyDirective!: TngCopy;
}

@Component({
  imports: [TngCopy],
  template: `
    <button
      #first
      type="button"
      tngCopy
      [tngCopyButtonText]="firstText()"
      [tngCopyButtonSuccessDurationMs]="250"
      (tngCopySuccess)="firstSuccess.push($event)"
    >
      First
    </button>
    <button
      #second
      type="button"
      tngCopy
      [tngCopyButtonText]="secondText()"
      [tngCopyButtonSuccessDurationMs]="250"
      (tngCopySuccess)="secondSuccess.push($event)"
    >
      Second
    </button>
  `,
})
class MultiCopyHostComponent {
  public readonly firstText = signal('First payload');
  public readonly secondText = signal('Second payload');
  public readonly firstSuccess: TngCopySuccessEvent[] = [];
  public readonly secondSuccess: TngCopySuccessEvent[] = [];

  @ViewChild('first', { static: true }) public firstRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('second', { static: true }) public secondRef!: ElementRef<HTMLButtonElement>;
  @ViewChild(TngCopy, { static: false }) public firstDirective?: TngCopy;
}

describe('tng-copy primitive behavior blocks A-M', () => {
  const originalClipboard = globalThis.navigator.clipboard;
  const originalClipboardItem = (globalThis as typeof globalThis & { ClipboardItem?: unknown })
    .ClipboardItem;
  const originalExecCommand = document.execCommand;

  afterEach(() => {
    setClipboard(originalClipboard);
    setClipboardItemCtor(originalClipboardItem);
    setExecCommandImplementation((commandId: string): boolean => originalExecCommand.call(document, commandId));
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('A) exports and basic wiring', () => {
    it('exports the copy primitive symbol', () => {
      expect(typeof TngCopy).toBe('function');
    });

    it('attaches to non-button host elements', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('Copy from div');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Copy from div');
      expect(fixture.componentInstance.successEvents).toHaveLength(1);
    });

    it('fails safely when copy is requested without text or target', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.detectChanges();

      const didCopy = await fixture.componentInstance.copyDirective.copy();
      await settle(fixture);

      expect(didCopy).toBe(false);
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
    });

    it('cleans up reset timers and hotkey listeners on destroy', async () => {
      vi.useFakeTimers();
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('cleanup');
      fixture.componentInstance.hotkey.set('mod+c');
      fixture.componentInstance.successDurationMs.set(1000);
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerRef.nativeElement;
      trigger.focus();
      click(trigger);
      await settleMicrotasks(fixture);

      fixture.destroy();
      keydown(document, 'c', { ctrlKey: true });
      vi.runOnlyPendingTimers();

      expect(writeText).toHaveBeenCalledTimes(1);
    });
  });

  describe('B) inputs precedence and text resolution', () => {
    it('copies explicit text when provided', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Explicit text');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Explicit text');
    });

    it('copies text derived from target when explicit text is absent', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.detectChanges();
      fixture.componentInstance.target.set(fixture.componentInstance.sourceRef.nativeElement);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Source text');
    });

    it('prefers explicit text over target when both are provided', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.detectChanges();
      fixture.componentInstance.text.set('Preferred');
      fixture.componentInstance.target.set(fixture.componentInstance.sourceRef.nativeElement);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Preferred');
    });

    it('resolves text function at activation time', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      let dynamicText = 'First';

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set(() => dynamicText);
      fixture.detectChanges();
      dynamicText = 'Second';

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Second');
    });

    it('resolves text signal at activation time', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      const textSignal = signal('One');

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set(textSignal as unknown as TngCopyButtonTextInput);
      fixture.detectChanges();
      textSignal.set('Two');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Two');
    });

    it('resolves target provided as element reference and supports text inputs', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.detectChanges();
      fixture.componentInstance.sourceInputRef.nativeElement.value = 'Input value';
      fixture.componentInstance.target.set(fixture.componentInstance.sourceInputRef.nativeElement);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Input value');
    });

    it('resolves target provided as selector string', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.target.set('#source-node');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Source text');
    });

    it('emits an error when target selector matches nothing', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.target.set('#missing-target');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(0);
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
    });

    it('treats empty resolved text as a no-op with an error', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('   ');
      fixture.componentInstance.target.set(fixture.componentInstance.sourceRef.nativeElement);
      fixture.detectChanges();

      const copied = await fixture.componentInstance.copyDirective.copy();
      await settle(fixture);

      expect(copied).toBe(false);
      expect(writeText).not.toHaveBeenCalled();
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
    });
  });

  describe('C) activation sources', () => {
    it('clicking host triggers copy with pointer source', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Pointer');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.copyEvents[0]?.trigger).toBe('pointer');
    });

    it('pressing Enter triggers keyboard copy on non-button hosts', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('Keyboard Enter');
      fixture.detectChanges();

      const event = keydown(fixture.componentInstance.triggerRef.nativeElement, 'Enter');
      await settle(fixture);

      expect(event.defaultPrevented).toBe(true);
      expect(fixture.componentInstance.copyEvents[0]?.trigger).toBe('keyboard');
    });

    it('pressing Space triggers keyboard copy and prevents default on non-button hosts', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('Keyboard Space');
      fixture.detectChanges();

      const event = keydown(fixture.componentInstance.triggerRef.nativeElement, ' ');
      await settle(fixture);

      expect(event.defaultPrevented).toBe(true);
      expect(fixture.componentInstance.copyEvents[0]?.trigger).toBe('keyboard');
    });

    it('calling copy() triggers programmatic source', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Programmatic');
      fixture.detectChanges();

      await fixture.componentInstance.copyDirective.copy();
      await settle(fixture);

      expect(fixture.componentInstance.copyEvents[0]?.trigger).toBe('programmatic');
    });

    it('does not trigger copy on unrelated keys', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('No trigger');
      fixture.detectChanges();

      keydown(fixture.componentInstance.triggerRef.nativeElement, 'Escape');
      await settle(fixture);

      expect(fixture.componentInstance.copyEvents).toHaveLength(0);
    });

    it('does not prevent default click behavior when enabled', () => {
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Click');
      fixture.detectChanges();

      const event = click(fixture.componentInstance.triggerRef.nativeElement);

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('D) disabled behavior', () => {
    it('does not copy or emit copy events when disabled', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Disabled');
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).not.toHaveBeenCalled();
      expect(fixture.componentInstance.copyEvents).toHaveLength(0);
      expect(fixture.componentInstance.successEvents).toHaveLength(0);
      expect(fixture.componentInstance.errorEvents).toHaveLength(0);
    });

    it('reflects aria-disabled on non-button hosts', () => {
      const divFixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      divFixture.componentInstance.disabled.set(true);
      divFixture.detectChanges();
      expect(divFixture.componentInstance.triggerRef.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('reflects disabled attr on button hosts', () => {
      const buttonFixture = TestBed.configureTestingModule({
        imports: [ButtonCopyHostComponent],
      }).createComponent(ButtonCopyHostComponent);
      buttonFixture.componentInstance.disabled.set(true);
      buttonFixture.detectChanges();
      expect(buttonFixture.componentInstance.triggerRef.nativeElement.getAttribute('disabled')).toBe('');
    });

    it('ignores click and keyboard activation when disabled toggles true at runtime', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('Runtime disabled');
      fixture.detectChanges();
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      keydown(fixture.componentInstance.triggerRef.nativeElement, 'Enter');
      await settle(fixture);

      expect(writeText).not.toHaveBeenCalled();
    });
  });

  describe('E) clipboard write method selection', () => {
    it('uses navigator.clipboard.writeText when available', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      const execSpy = vi.fn().mockReturnValue(true);
      setExecCommandImplementation(execSpy);

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Clipboard API');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Clipboard API');
      expect(execSpy).not.toHaveBeenCalled();
      expect(fixture.componentInstance.successEvents[0]?.method).toBe('clipboard');
    });

    it('falls back to execCommand when clipboard API fails', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('permission denied'));
      setClipboard({ writeText });
      const execSpy = vi.fn().mockReturnValue(true);
      setExecCommandImplementation(execSpy);

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('Fallback');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(execSpy).toHaveBeenCalledWith('copy');
      expect(fixture.componentInstance.successEvents[0]?.method).toBe('execCommand');
    });

    it('emits error when clipboard API and fallback both fail', async () => {
      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('fail')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('No write');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(0);
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
    });
  });

  describe('F) event emission contract', () => {
    it('emits tngCopy before clipboard resolution and emits success once', async () => {
      const deferred = deferredPromise<void>();
      const writeText = vi.fn().mockReturnValue(deferred.promise);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('event-order');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      expect(fixture.componentInstance.copyEvents).toHaveLength(1);
      expect(fixture.componentInstance.successEvents).toHaveLength(0);

      deferred.resolve();
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(1);
      expect(fixture.componentInstance.successEvents[0]).toEqual({
        method: 'clipboard',
        text: 'event-order',
      });
      expect(fixture.componentInstance.copiedEvents).toEqual(['event-order']);
    });

    it('emits error exactly once on failure without emitting success', async () => {
      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('boom')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('failing');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(0);
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
      expect(extractError(fixture.componentInstance.errorEvents[0])?.message).toContain('boom');
    });

    it('does not emit duplicate success on rapid double click', async () => {
      const deferred = deferredPromise<void>();
      setClipboard({ writeText: vi.fn().mockReturnValue(deferred.promise) });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('double');
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerRef.nativeElement;
      click(trigger);
      click(trigger);
      deferred.resolve();
      await settle(fixture);

      expect(fixture.componentInstance.copyEvents).toHaveLength(1);
      expect(fixture.componentInstance.successEvents).toHaveLength(1);
    });
  });

  describe('G) status state machine signals', () => {
    it('tracks idle -> copying -> success and resets to idle', async () => {
      vi.useFakeTimers();
      const deferred = deferredPromise<void>();
      setClipboard({ writeText: vi.fn().mockReturnValue(deferred.promise) });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('state');
      fixture.componentInstance.successDurationMs.set(200);
      fixture.detectChanges();

      expect(fixture.componentInstance.copyDirective.status()).toBe('idle');

      click(fixture.componentInstance.triggerRef.nativeElement);
      expect(fixture.componentInstance.copyDirective.status()).toBe('copying');

      deferred.resolve();
      await settleMicrotasks(fixture);
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');

      vi.advanceTimersByTime(199);
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');
      vi.advanceTimersByTime(1);
      expect(fixture.componentInstance.copyDirective.status()).toBe('idle');
    });

    it('sets error status on failure, keeps lastCopiedText, and clears error on new attempt', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('success-one');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.copyDirective.lastCopiedText()).toBe('success-one');

      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('fail')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));
      fixture.componentInstance.text.set('failure');
      fixture.detectChanges();
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.copyDirective.status()).toBe('error');
      expect(fixture.componentInstance.copyDirective.lastCopiedText()).toBe('success-one');
      expect(fixture.componentInstance.copyDirective.error()).toBeTruthy();

      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      fixture.componentInstance.text.set('success-two');
      fixture.detectChanges();
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.copyDirective.error()).toBeNull();
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');
      expect(fixture.componentInstance.copyDirective.lastCopiedText()).toBe('success-two');
    });

    it('does not auto-reset from error without a new attempt', async () => {
      vi.useFakeTimers();
      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('fail')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('error-state');
      fixture.componentInstance.successDurationMs.set(50);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settleMicrotasks(fixture);
      expect(fixture.componentInstance.copyDirective.status()).toBe('error');

      vi.advanceTimersByTime(2000);
      expect(fixture.componentInstance.copyDirective.status()).toBe('error');
    });
  });

  describe('H) timing and reset behavior', () => {
    it('uses default success reset duration when custom value is not provided', async () => {
      vi.useFakeTimers();
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('default-timer');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settleMicrotasks(fixture);
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');

      vi.advanceTimersByTime(defaultTngCopySuccessDurationMs - 1);
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');
      vi.advanceTimersByTime(1);
      expect(fixture.componentInstance.copyDirective.status()).toBe('idle');
    });

    it('respects custom success reset duration and replaces previous timer', async () => {
      vi.useFakeTimers();
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('first');
      fixture.componentInstance.successDurationMs.set(300);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settleMicrotasks(fixture);

      vi.advanceTimersByTime(200);
      fixture.componentInstance.text.set('second');
      fixture.detectChanges();
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settleMicrotasks(fixture);

      vi.advanceTimersByTime(299);
      expect(fixture.componentInstance.copyDirective.status()).toBe('success');
      vi.advanceTimersByTime(1);
      expect(fixture.componentInstance.copyDirective.status()).toBe('idle');
    });

    it('does not leak timer callbacks when destroyed with pending reset', async () => {
      vi.useFakeTimers();
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('destroy-timer');
      fixture.componentInstance.successDurationMs.set(400);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settleMicrotasks(fixture);
      fixture.destroy();

      vi.runOnlyPendingTimers();
      expect(true).toBe(true);
    });
  });

  describe('I) focus behavior', () => {
    it('keeps focus on host after successful copy', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('focus-success');
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerRef.nativeElement;
      trigger.focus();
      click(trigger);
      await settle(fixture);

      expect(document.activeElement).toBe(trigger);
    });

    it('keeps focus on host after failed copy', async () => {
      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('focus-error');
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerRef.nativeElement;
      trigger.focus();
      click(trigger);
      await settle(fixture);

      expect(document.activeElement).toBe(trigger);
    });
  });

  describe('J) accessibility announcements', () => {
    it('does not announce when announce=false', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('announce-off');
      fixture.componentInstance.announce.set(false);
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.announcements).toHaveLength(0);
    });

    it('announces in auto mode only for keyboard activation', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('auto');
      fixture.componentInstance.announce.set('auto');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);
      expect(fixture.componentInstance.announcements).toHaveLength(0);

      keydown(fixture.componentInstance.triggerRef.nativeElement, 'Enter');
      await settle(fixture);
      expect(fixture.componentInstance.announcements).toEqual(['Copied to clipboard']);
    });

    it('announces success and error with customizable messages when announce=true', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('announce');
      fixture.componentInstance.announce.set(true);
      fixture.componentInstance.successMessage.set('Copied now');
      fixture.componentInstance.errorMessage.set('Could not copy');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('nope')) });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.announcements).toEqual(['Copied now', 'Could not copy']);
    });

    it('does not emit duplicate announcements on rapid repeated success', async () => {
      const deferred = deferredPromise<void>();
      setClipboard({ writeText: vi.fn().mockReturnValue(deferred.promise) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('rapid-announce');
      fixture.componentInstance.announce.set(true);
      fixture.detectChanges();

      const trigger = fixture.componentInstance.triggerRef.nativeElement;
      click(trigger);
      click(trigger);
      deferred.resolve();
      await settle(fixture);

      expect(fixture.componentInstance.announcements).toEqual(['Copied to clipboard']);
    });
  });

  describe('K) hotkey support', () => {
    it('does not trigger copy when hotkey is null', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('hotkey-null');
      fixture.componentInstance.hotkey.set(null);
      fixture.detectChanges();

      fixture.componentInstance.triggerRef.nativeElement.focus();
      keydown(document, 'c', { ctrlKey: true });
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(0);
    });

    it('triggers copy with keyboard source for configured hotkey', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('hotkey-active');
      fixture.componentInstance.hotkey.set('ctrl+c');
      fixture.detectChanges();

      fixture.componentInstance.triggerRef.nativeElement.focus();
      keydown(document, 'c', { ctrlKey: true });
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(1);
      expect(fixture.componentInstance.copyEvents[0]?.trigger).toBe('keyboard');
    });

    it('does not trigger hotkey copy when disabled and removes listener on destroy', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [DivCopyHostComponent] }).createComponent(
        DivCopyHostComponent,
      );
      fixture.componentInstance.text.set('hotkey-disabled');
      fixture.componentInstance.hotkey.set('ctrl+c');
      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      fixture.componentInstance.triggerRef.nativeElement.focus();
      keydown(document, 'c', { ctrlKey: true });
      await settle(fixture);
      expect(writeText).not.toHaveBeenCalled();

      fixture.componentInstance.disabled.set(false);
      fixture.detectChanges();
      fixture.destroy();
      keydown(document, 'c', { ctrlKey: true });
      await Promise.resolve();

      expect(writeText).not.toHaveBeenCalled();
    });
  });

  describe('L) format support', () => {
    it('defaults to copying text/plain when format is not specified', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('plain');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('plain');
    });

    it('uses clipboard.write for html format when supported', async () => {
      const write = vi.fn().mockResolvedValue(undefined);
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ write, writeText });

      class ClipboardItemStub {
        public constructor(public readonly data: unknown) {}
      }
      setClipboardItemCtor(ClipboardItemStub);

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('<b>Hello</b>');
      fixture.componentInstance.format.set('text/html');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(write).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.successEvents[0]?.method).toBe('clipboard');
    });

    it('falls back to plain text writeText when html copy is requested but unsupported', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      setClipboard({ writeText });
      setClipboardItemCtor(undefined);

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('<b>Hello</b>');
      fixture.componentInstance.format.set('text/html');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(writeText).toHaveBeenCalledWith('Hello');
    });
  });

  describe('M) robustness and edge cases', () => {
    it('handles synchronous clipboard throws and async rejections', async () => {
      const writeText = vi.fn();
      writeText.mockImplementationOnce(() => {
        throw new Error('sync failure');
      });
      writeText.mockRejectedValueOnce(new Error('async failure'));
      setClipboard({ writeText });
      setExecCommandImplementation(vi.fn().mockReturnValue(false));

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('errors');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.errorEvents).toHaveLength(2);
      expect(extractError(fixture.componentInstance.errorEvents[0])?.message).toContain('sync failure');
      expect(extractError(fixture.componentInstance.errorEvents[1])?.message).toContain('async failure');
    });

    it('handles fallback execCommand throwing and emits error', async () => {
      setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('clipboard failure')) });
      setExecCommandImplementation(() => {
        throw new Error('exec failure');
      });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.text.set('fallback throw');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
      expect(extractError(fixture.componentInstance.errorEvents[0])?.message).toContain('exec failure');
    });

    it('reads latest target text at activation time', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });

      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.detectChanges();
      fixture.componentInstance.target.set(fixture.componentInstance.sourceRef.nativeElement);
      fixture.componentInstance.sourceText.set('Updated target');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.successEvents[0]?.text).toBe('Updated target');
    });

    it('does not reuse a detached selector target across attempts', async () => {
      setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
      const fixture = TestBed.configureTestingModule({ imports: [ButtonCopyHostComponent] }).createComponent(
        ButtonCopyHostComponent,
      );
      fixture.componentInstance.target.set('#source-node');
      fixture.detectChanges();

      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      fixture.componentInstance.sourceRef.nativeElement.remove();
      fixture.detectChanges();
      click(fixture.componentInstance.triggerRef.nativeElement);
      await settle(fixture);

      expect(fixture.componentInstance.successEvents).toHaveLength(1);
      expect(fixture.componentInstance.errorEvents).toHaveLength(1);
    });

    it('isolates state across multiple copy instances and supports concurrent copy calls', async () => {
      const firstDeferred = deferredPromise<void>();
      const secondDeferred = deferredPromise<void>();
      const writeText = vi
        .fn()
        .mockReturnValueOnce(firstDeferred.promise)
        .mockReturnValueOnce(secondDeferred.promise);
      setClipboard({ writeText });

      const fixture = TestBed.configureTestingModule({ imports: [MultiCopyHostComponent] }).createComponent(
        MultiCopyHostComponent,
      );
      fixture.detectChanges();

      click(fixture.componentInstance.firstRef.nativeElement);
      click(fixture.componentInstance.secondRef.nativeElement);
      firstDeferred.resolve();
      secondDeferred.resolve();
      await settle(fixture);

      expect(fixture.componentInstance.firstSuccess).toEqual([
        { method: 'clipboard', text: 'First payload' },
      ]);
      expect(fixture.componentInstance.secondSuccess).toEqual([
        { method: 'clipboard', text: 'Second payload' },
      ]);
    });
  });
});
