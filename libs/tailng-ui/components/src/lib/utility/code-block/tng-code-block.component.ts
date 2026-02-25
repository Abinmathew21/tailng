import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core';
import {
  TngCodeBlock as TngCodeBlockPrimitive,
  TngCodeBlockBody as TngCodeBlockBodyPrimitive,
  TngCodeBlockCode as TngCodeBlockCodePrimitive,
  TngCodeBlockGutter as TngCodeBlockGutterPrimitive,
  TngCodeBlockHeader as TngCodeBlockHeaderPrimitive,
  TngCopy,
} from '@tailng-ui/primitives';
import {
  escapeTngCodeHtml,
  highlightWithTngCodeHighlightingConfig,
  normalizeTngCodeLanguage,
  TNG_CODE_HIGHLIGHTING_CONFIG,
} from './highlighting';
import type { TngResolvedCodeHighlightingConfig } from './highlighting';

type TngCodeBlockCopyState = 'copied' | 'error' | 'idle';
type TngCodeBlockRenderRequest = Readonly<{
  adapter: string | null;
  code: string;
  highlightMode: TngCodeBlockHighlightMode;
  language: string | null;
}>;

const defaultCopyResetDuration = 1500;
const highlightModes = ['auto', 'off', 'on'] as const;
const highlightModeSet = new Set<TngCodeBlockHighlightMode>(highlightModes);

export type TngCodeBlockHighlightMode = (typeof highlightModes)[number];

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

function shouldHighlight(mode: TngCodeBlockHighlightMode): boolean {
  return mode === 'auto' || mode === 'on';
}

export function coerceTngCodeBlockHighlightMode(value: string): TngCodeBlockHighlightMode {
  if (highlightModeSet.has(value as TngCodeBlockHighlightMode)) {
    return value as TngCodeBlockHighlightMode;
  }

  return 'auto';
}

export function coerceTngCodeBlockCopyResetDuration(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultCopyResetDuration;
  }

  return toRoundedPositiveNumber(numericValue);
}

export function normalizeTngCodeBlockCode(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  return value.replace(/\r\n?/g, '\n');
}

export function toTngCodeBlockLineNumbers(code: string): readonly number[] {
  if (code.length === 0) {
    return [1];
  }

  const lineCount = code.split('\n').length;
  return Array.from({ length: lineCount }, (_, index) => index + 1);
}

@Component({
  selector: 'tng-code-block',
  imports: [
    TngCodeBlockPrimitive,
    TngCodeBlockHeaderPrimitive,
    TngCodeBlockBodyPrimitive,
    TngCodeBlockGutterPrimitive,
    TngCodeBlockCodePrimitive,
    TngCopy,
  ],
  templateUrl: './tng-code-block.component.html',
  styleUrl: './tng-code-block.component.css',
})
export class TngCodeBlockComponent implements OnDestroy {
  public readonly adapter = input<string | null>(null);
  public readonly code = input<string>('');
  public readonly copy = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly copyLabel = input<string>('Copy');
  public readonly copiedLabel = input<string>('Copied');
  public readonly copyResetDuration = input<number, number | string>(defaultCopyResetDuration, {
    transform: coerceTngCodeBlockCopyResetDuration,
  });
  public readonly errorLabel = input<string>('Copy failed');
  public readonly highlightMode = input<TngCodeBlockHighlightMode, string>('auto', {
    transform: coerceTngCodeBlockHighlightMode,
  });
  public readonly language = input<string | null>(null);
  public readonly showHeader = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showLineNumbers = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly wrap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();

  protected readonly copyButtonLabel = computed((): string => {
    const state = this.copyState();
    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return this.copyLabel();
  });

  protected readonly copyDisabled = computed((): boolean => {
    return !this.copy() || this.normalizedCode().length === 0;
  });

  protected readonly highlightedHtml = signal<string>('');
  protected readonly isHighlighting = signal<boolean>(false);

  protected readonly languageLabel = computed((): string => {
    return normalizeTngCodeLanguage(this.language()) ?? 'text';
  });

  protected readonly lineNumbers = computed((): readonly number[] => {
    return toTngCodeBlockLineNumbers(this.normalizedCode());
  });

  protected readonly normalizedCode = computed((): string => {
    return normalizeTngCodeBlockCode(this.code());
  });

  private readonly copyState = signal<TngCodeBlockCopyState>('idle');
  private readonly highlightingConfig = inject<TngResolvedCodeHighlightingConfig>(
    TNG_CODE_HIGHLIGHTING_CONFIG,
  );
  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private highlightRequestId = 0;
  private destroyed = false;

  public constructor() {
    effect((): void => {
      void this.updateHighlightedHtml({
        adapter: normalizeTngCodeLanguage(this.adapter()),
        code: this.normalizedCode(),
        highlightMode: this.highlightMode(),
        language: normalizeTngCodeLanguage(this.language()),
      });
    });
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this.highlightRequestId += 1;
    this.clearCopyResetTimer();
  }

  protected onCopyError(...args: readonly unknown[]): void {
    const [error] = args;
    const normalizedError = error instanceof Error ? error : new Error('Copy failed.');
    this.copyState.set('error');
    this.tngCopyError.emit(normalizedError);
    this.scheduleCopyStateReset();
  }

  protected onCopied(...args: readonly unknown[]): void {
    const [payload] = args;
    if (typeof payload !== 'string') {
      return;
    }

    this.copyState.set('copied');
    this.tngCopied.emit(payload);
    this.scheduleCopyStateReset();
  }

  private clearCopyResetTimer(): void {
    if (this.copyResetTimer === null) {
      return;
    }

    clearTimeout(this.copyResetTimer);
    this.copyResetTimer = null;
  }

  private isStaleRequest(requestId: number): boolean {
    return this.destroyed || requestId !== this.highlightRequestId;
  }

  private scheduleCopyStateReset(): void {
    this.clearCopyResetTimer();
    this.copyResetTimer = setTimeout((): void => {
      this.copyState.set('idle');
      this.copyResetTimer = null;
    }, this.copyResetDuration());
  }

  private async updateHighlightedHtml(request: TngCodeBlockRenderRequest): Promise<void> {
    const requestId = this.highlightRequestId + 1;
    this.highlightRequestId = requestId;

    if (!shouldHighlight(request.highlightMode)) {
      this.isHighlighting.set(false);
      this.highlightedHtml.set(escapeTngCodeHtml(request.code));
      return;
    }

    this.isHighlighting.set(true);

    try {
      const highlightedHtml = await highlightWithTngCodeHighlightingConfig({
        adapter: request.adapter,
        code: request.code,
        language: request.language,
      }, this.highlightingConfig);
      if (this.isStaleRequest(requestId)) {
        return;
      }

      this.highlightedHtml.set(highlightedHtml);
    } catch {
      if (this.isStaleRequest(requestId)) {
        return;
      }

      this.highlightedHtml.set(escapeTngCodeHtml(request.code));
    } finally {
      if (!this.isStaleRequest(requestId)) {
        this.isHighlighting.set(false);
      }
    }
  }
}
