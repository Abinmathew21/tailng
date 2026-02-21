import {
  type TngTypeaheadController,
  type TngTypeaheadItem,
  type TngTypeaheadMatchStrategy,
  type TngTypeaheadOptions,
  type TngTypeaheadResult,
} from './typeahead.types';

const defaultBufferResetMs = 500;

type TngMatchOptions = Readonly<{
  activeId: string | null;
  buffer: string;
  enabledItems: readonly TngTypeaheadItem[];
  loop: boolean;
  matchStrategy: TngTypeaheadMatchStrategy;
}>;

type TngCandidateOptions = Readonly<{
  activeId: string | null;
  enabledItems: readonly TngTypeaheadItem[];
  loop: boolean;
  shouldSearchFromActive: boolean;
}>;

function getEnabledItems(items: readonly TngTypeaheadItem[]): readonly TngTypeaheadItem[] {
  return items.filter((item) => item.disabled !== true);
}

function getSearchBuffer(value: string): string {
  if (value.length === 0) {
    return value;
  }

  const firstCharacter = value[0] ?? '';
  const isRepeatedCharacter = [...value].every((character) => character === firstCharacter);
  return isRepeatedCharacter ? firstCharacter : value;
}

function getOrderedCandidates(options: TngCandidateOptions): readonly TngTypeaheadItem[] {
  if (!options.shouldSearchFromActive || options.enabledItems.length === 0) {
    return options.enabledItems;
  }

  const currentIndex = options.enabledItems.findIndex((item) => item.id === options.activeId);
  if (currentIndex < 0) {
    return options.enabledItems;
  }

  const nextStartIndex = currentIndex + 1;
  if (!options.loop) {
    return options.enabledItems.slice(nextStartIndex);
  }

  return [
    ...options.enabledItems.slice(nextStartIndex),
    ...options.enabledItems.slice(0, nextStartIndex),
  ];
}

function findMatch(options: TngMatchOptions): string | null {
  const normalizedBuffer = getSearchBuffer(options.buffer.toLowerCase());
  if (normalizedBuffer.length === 0) {
    return null;
  }

  const shouldSearchFromActive =
    options.matchStrategy === 'active' && normalizedBuffer.length === 1;
  const candidates = getOrderedCandidates({
    activeId: options.activeId,
    enabledItems: options.enabledItems,
    loop: options.loop,
    shouldSearchFromActive,
  });

  for (const candidate of candidates) {
    if (candidate.text.toLowerCase().startsWith(normalizedBuffer)) {
      return candidate.id;
    }
  }

  return null;
}

function isPrintableCharacter(value: string): boolean {
  return value.length === 1 && value.trim().length > 0;
}

function canUseActiveId(
  enabledItems: readonly TngTypeaheadItem[],
  id: string | null,
): boolean {
  if (id === null) {
    return true;
  }

  return enabledItems.some((item) => item.id === id);
}

class TypeaheadController implements TngTypeaheadController {
  private activeId: string | null;
  private buffer = '';
  private enabledItems: readonly TngTypeaheadItem[];
  private items: readonly TngTypeaheadItem[];
  private readonly loop: boolean;
  private readonly matchStrategy: TngTypeaheadMatchStrategy;
  private previousTimestamp = 0;
  private readonly resetMs: number;

  public constructor(options: TngTypeaheadOptions) {
    this.activeId = options.initialActiveId ?? null;
    this.items = options.items;
    this.enabledItems = getEnabledItems(options.items);
    this.loop = options.loop ?? true;
    this.matchStrategy = options.matchStrategy ?? 'active';
    this.resetMs = options.bufferResetMs ?? defaultBufferResetMs;
    this.ensureActiveIdStillValid();
  }

  public getState(): TngTypeaheadResult {
    return { activeId: this.activeId, buffer: this.buffer };
  }

  public handleKey(key: string, timestampMs: number = Date.now()): TngTypeaheadResult {
    if (!isPrintableCharacter(key)) {
      return this.getState();
    }

    this.updateBuffer(key, timestampMs);
    const nextId = findMatch({
      activeId: this.activeId,
      buffer: this.buffer,
      enabledItems: this.enabledItems,
      loop: this.loop,
      matchStrategy: this.matchStrategy,
    });

    if (nextId !== null) {
      this.activeId = nextId;
    }

    return this.getState();
  }

  public reset(): void {
    this.buffer = '';
    this.previousTimestamp = 0;
  }

  public setActiveId(id: string | null): string | null {
    if (canUseActiveId(this.enabledItems, id)) {
      this.activeId = id;
    }

    return this.activeId;
  }

  public setItems(items: readonly TngTypeaheadItem[]): void {
    this.items = items;
    this.enabledItems = getEnabledItems(items);
    this.ensureActiveIdStillValid();
  }

  private ensureActiveIdStillValid(): void {
    if (!canUseActiveId(this.enabledItems, this.activeId)) {
      this.activeId = null;
    }
  }

  private updateBuffer(key: string, timestampMs: number): void {
    const shouldReset = timestampMs - this.previousTimestamp > this.resetMs;
    this.buffer = shouldReset ? key : `${this.buffer}${key}`;
    this.previousTimestamp = timestampMs;
  }
}

export function createTypeaheadController(
  options: TngTypeaheadOptions,
): TngTypeaheadController {
  return new TypeaheadController(options);
}
