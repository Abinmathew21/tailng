import {
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { TngSkeleton as TngSkeletonPrimitive } from '@tailng-ui/primitives';

export type TngSkeletonMessageMode = 'none' | 'static' | 'random';
export type TngSkeletonMessageStrategy = 'once' | 'interval';

const defaultTngSkeletonMessageInterval = 5000;

export function resolveTngSkeletonCssSize(value: string, fallback: string): string {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

export function resolveTngSkeletonMessageInterval(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : defaultTngSkeletonMessageInterval;
}

function normalizeTngSkeletonMessage(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim() ?? '';
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeTngSkeletonMessages(
  messages: readonly string[] | null | undefined,
): readonly string[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => normalizeTngSkeletonMessage(message))
    .filter((message): message is string => message !== null);
}

function resolveTngSkeletonMessageMode(
  mode: TngSkeletonMessageMode | undefined,
  message: string | null,
  messages: readonly string[],
): TngSkeletonMessageMode {
  if (mode !== undefined) {
    return mode;
  }

  if (message !== null) {
    return 'static';
  }

  return messages.length > 0 ? 'random' : 'static';
}

function resolveTngSkeletonMessageStrategy(
  strategy: TngSkeletonMessageStrategy,
): TngSkeletonMessageStrategy {
  return strategy === 'interval' ? 'interval' : 'once';
}

function selectRandomTngSkeletonMessage(messages: readonly string[]): string | null {
  if (messages.length === 0) {
    return null;
  }

  const selectedIndex = Math.floor(Math.random() * messages.length);
  return messages[Math.min(selectedIndex, messages.length - 1)] ?? null;
}

@Component({
  selector: 'tng-skeleton',
  imports: [TngSkeletonPrimitive],
  templateUrl: './tng-skeleton.component.html',
  styleUrl: './tng-skeleton.component.css',
})
export class TngSkeletonComponent {
  private readonly randomMessage = signal<string | null>(null);

  public readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly height = input<string>('1rem');
  public readonly message = input<string | null | undefined>(undefined);
  public readonly messageInterval = input<number, number | string>(
    defaultTngSkeletonMessageInterval,
    {
      transform: numberAttribute,
    },
  );
  public readonly messageMode = input<TngSkeletonMessageMode | undefined>(undefined);
  public readonly messages = input<readonly string[] | null | undefined>([]);
  public readonly messageStrategy = input<TngSkeletonMessageStrategy>('once');
  public readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly width = input<string>('100%');

  protected readonly normalizedMessage = computed((): string | null =>
    normalizeTngSkeletonMessage(this.message()),
  );
  protected readonly normalizedMessages = computed((): readonly string[] =>
    normalizeTngSkeletonMessages(this.messages()),
  );
  protected readonly resolvedMessageMode = computed(
    (): TngSkeletonMessageMode =>
      resolveTngSkeletonMessageMode(
        this.messageMode(),
        this.normalizedMessage(),
        this.normalizedMessages(),
      ),
  );
  protected readonly resolvedMessageStrategy = computed(
    (): TngSkeletonMessageStrategy => resolveTngSkeletonMessageStrategy(this.messageStrategy()),
  );
  protected readonly resolvedMessageInterval = computed((): number =>
    resolveTngSkeletonMessageInterval(this.messageInterval()),
  );
  protected readonly statusMessage = computed((): string | null => {
    if (this.resolvedMessageMode() === 'static') {
      return this.normalizedMessage();
    }

    if (this.resolvedMessageMode() === 'random') {
      return this.randomMessage();
    }

    return null;
  });
  protected readonly shouldRenderProjectedMessage = computed(
    (): boolean => this.resolvedMessageMode() === 'static' && this.normalizedMessage() === null,
  );

  public constructor() {
    effect((onCleanup): void => {
      const mode = this.resolvedMessageMode();
      const messages = this.normalizedMessages();
      const strategy = this.resolvedMessageStrategy();
      const interval = this.resolvedMessageInterval();

      if (mode !== 'random' || messages.length === 0) {
        this.randomMessage.set(null);
        return;
      }

      const selectMessage = (): void => {
        this.randomMessage.set(selectRandomTngSkeletonMessage(messages));
      };

      selectMessage();

      if (strategy !== 'interval') {
        return;
      }

      const timer = setInterval(selectMessage, interval);
      onCleanup((): void => {
        clearInterval(timer);
      });
    });
  }

  public resolveHeight(): string {
    return resolveTngSkeletonCssSize(this.height(), '1rem');
  }

  public resolveWidth(): string {
    return resolveTngSkeletonCssSize(this.width(), '100%');
  }
}
export { TngSkeletonComponent as TngSkeleton };
