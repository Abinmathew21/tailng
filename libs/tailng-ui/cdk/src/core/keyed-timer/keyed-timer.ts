import type {
  TngKeyedTimerCallback,
  TngKeyedTimerController,
} from './keyed-timer.types';

type TimeoutHandle = ReturnType<typeof setTimeout>;

export function normalizeTngKeyedTimerDelay(delayMs: number): number {
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    return 0;
  }

  return delayMs;
}

class KeyedTimerController<TKey extends string | number | symbol>
  implements TngKeyedTimerController<TKey>
{
  private readonly timeoutByKey = new Map<TKey, TimeoutHandle>();

  public cancel(key: TKey): void {
    const timeoutHandle = this.timeoutByKey.get(key);
    if (timeoutHandle === undefined) {
      return;
    }

    clearTimeout(timeoutHandle);
    this.timeoutByKey.delete(key);
  }

  public clearAll(): void {
    for (const timeoutHandle of this.timeoutByKey.values()) {
      clearTimeout(timeoutHandle);
    }

    this.timeoutByKey.clear();
  }

  public schedule(key: TKey, delayMs: number, callback: TngKeyedTimerCallback<TKey>): void {
    this.cancel(key);
    const normalizedDelayMs = normalizeTngKeyedTimerDelay(delayMs);

    const timeoutHandle = setTimeout(() => {
      this.timeoutByKey.delete(key);
      callback(key);
    }, normalizedDelayMs);

    this.timeoutByKey.set(key, timeoutHandle);
  }
}

export function createTngKeyedTimerController<TKey extends string | number | symbol>():
  TngKeyedTimerController<TKey> {
  return new KeyedTimerController<TKey>();
}
