import {
  booleanAttribute,
  Component,
  computed,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core';
import { TngCopy } from '@tailng-ui/primitives';
import type { TngCopyFromTarget, TngCopyIgnoreSelectorsInput } from '@tailng-ui/primitives';

const defaultResetDelay = 1500;

type TngCopyButtonState = 'copied' | 'copying' | 'error' | 'idle';
export type TngCopyButtonAppearance = 'ghost' | 'outline' | 'solid';
export type TngCopyButtonSize = 'md' | 'sm';

function toRoundedPositiveNumber(value: number): number {
  return Math.max(0, Math.round(value));
}

export function coerceTngCopyButtonResetDelay(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return defaultResetDelay;
  }

  return toRoundedPositiveNumber(numericValue);
}

@Component({
  selector: 'tng-copy-button',
  imports: [TngCopy],
  templateUrl: './tng-copy-button.component.html',
  styleUrl: './tng-copy-button.component.css',
})
export class TngCopyButtonComponent implements OnDestroy {
  public readonly appearance = input<TngCopyButtonAppearance>('outline');
  public readonly copyLabel = input<string>('Copy');
  public readonly copiedLabel = input<string>('Copied');
  public readonly copyingLabel = input<string>('Copying...');
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly errorLabel = input<string>('Copy failed');
  public readonly from = input<TngCopyFromTarget>(null);
  public readonly ignoreSelectors = input<TngCopyIgnoreSelectorsInput>(null);
  public readonly resetDelay = input<number, number | string>(defaultResetDelay, {
    transform: coerceTngCopyButtonResetDelay,
  });
  public readonly size = input<TngCopyButtonSize>('md');
  public readonly text = input<string | null | undefined>(undefined);

  public readonly tngCopied = output<string>();
  public readonly tngCopyError = output<Error>();

  protected readonly liveMessage = computed((): string => {
    const state = this.state();
    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return '';
  });

  protected readonly label = computed((): string => {
    const state = this.state();
    if (state === 'copying') {
      return this.copyingLabel();
    }

    if (state === 'copied') {
      return this.copiedLabel();
    }

    if (state === 'error') {
      return this.errorLabel();
    }

    return this.copyLabel();
  });

  protected readonly state = signal<TngCopyButtonState>('idle');

  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  public ngOnDestroy(): void {
    this.clearResetTimer();
  }

  protected onHostClick(): void {
    if (this.disabled()) {
      return;
    }

    this.state.set('copying');
  }

  protected onPrimitiveCopied(payload: string): void {
    this.state.set('copied');
    this.tngCopied.emit(payload);
    this.scheduleReset();
  }

  protected onPrimitiveCopyError(...args: readonly unknown[]): void {
    const [error] = args;
    const normalizedError = error instanceof Error ? error : new Error('Copy failed.');
    this.state.set('error');
    this.tngCopyError.emit(normalizedError);
    this.scheduleReset();
  }

  private clearResetTimer(): void {
    if (this.resetTimer === null) {
      return;
    }

    clearTimeout(this.resetTimer);
    this.resetTimer = null;
  }

  private scheduleReset(): void {
    this.clearResetTimer();
    this.resetTimer = setTimeout((): void => {
      this.state.set('idle');
      this.resetTimer = null;
    }, this.resetDelay());
  }
}
