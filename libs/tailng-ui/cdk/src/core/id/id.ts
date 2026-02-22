/**
 * A factory function that generates unique IDs.
 */
export type TngIdFactory = () => string;

/**
 * Creates an ID factory with an optional scope.
 *
 * Example:
 *   const listboxId = createTngIdFactory('tng-listbox')();
 *   const optionId = createTngIdFactory('tng-option', listboxId);
 *
 * Result:
 *   tng-option-tng-listbox-1-1
 */
export function createTngIdFactory(
  prefix: string,
  scope?: string,
): TngIdFactory {
  const normalizedPrefix = normalize(prefix);
  const normalizedScope = scope ? normalize(scope) : undefined;

  let nextId = 0;

  return (): string => {
    nextId += 1;

    if (normalizedScope) {
      return `${normalizedPrefix}-${normalizedScope}-${nextId}`;
    }

    return `${normalizedPrefix}-${nextId}`;
  };
}

/**
 * Creates a single unique ID immediately.
 * Useful when you just need one stable ID.
 */
export function createTngId(
  prefix: string,
  scope?: string,
): string {
  return createTngIdFactory(prefix, scope)();
}

/**
 * Normalizes prefix/scope:
 * - trims whitespace
 * - removes duplicate hyphens
 * - removes trailing hyphens
 */
function normalize(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '');
}