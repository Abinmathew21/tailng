import {
  type TngTypeaheadController,
  type TngTypeaheadItem,
  type TngTypeaheadOptions,
  type TngTypeaheadResult,
} from './typeahead.types';

const defaultBufferResetMs = 500;

function findMatch(
  items: readonly TngTypeaheadItem[],
  buffer: string,
): string | null {
  const normalizedBuffer = buffer.toLowerCase();

  for (const item of items) {
    if (item.disabled === true) {
      continue;
    }

    if (item.text.toLowerCase().startsWith(normalizedBuffer)) {
      return item.id;
    }
  }

  return null;
}

export function createTypeaheadController(
  options: TngTypeaheadOptions,
): TngTypeaheadController {
  const resetMs = options.bufferResetMs ?? defaultBufferResetMs;
  let activeId = options.initialActiveId ?? null;
  let buffer = '';
  let previousTimestamp = 0;

  const getState = (): TngTypeaheadResult => ({ activeId, buffer });

  const handleKey = (key: string, timestampMs: number = Date.now()): TngTypeaheadResult => {
    const shouldReset = timestampMs - previousTimestamp > resetMs;
    buffer = shouldReset ? key : `${buffer}${key}`;
    previousTimestamp = timestampMs;

    const nextId = findMatch(options.items, buffer);
    if (nextId !== null) {
      activeId = nextId;
    }

    return getState();
  };

  const reset = (): void => {
    buffer = '';
    previousTimestamp = 0;
  };

  return Object.freeze({ getState, handleKey, reset });
}
