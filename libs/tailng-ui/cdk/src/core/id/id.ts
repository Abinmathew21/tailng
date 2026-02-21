export type TngIdFactory = () => string;

export function createTngIdFactory(prefix: string): TngIdFactory {
  const normalizedPrefix = prefix.trim();
  let nextId = 0;

  return (): string => {
    nextId += 1;
    return `${normalizedPrefix}-${nextId}`;
  };
}
