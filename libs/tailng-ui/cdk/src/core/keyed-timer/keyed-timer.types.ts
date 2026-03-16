export type TngKeyedTimerCallback<TKey extends string | number | symbol> = (
  key: TKey,
) => void;

export type TngKeyedTimerController<TKey extends string | number | symbol> = Readonly<{
  cancel: (key: TKey) => void;
  clearAll: () => void;
  schedule: (key: TKey, delayMs: number, callback: TngKeyedTimerCallback<TKey>) => void;
}>;
