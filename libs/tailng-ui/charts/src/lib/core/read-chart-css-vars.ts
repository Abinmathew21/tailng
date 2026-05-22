export type TngChartCssVariableNames = readonly string[];

export function readTngChartCssVariable(
  style: CSSStyleDeclaration | null,
  names: TngChartCssVariableNames,
  fallback: string,
): string {
  if (style === null) {
    return fallback;
  }

  for (const name of names) {
    const value = style.getPropertyValue(name).trim();
    if (value.length > 0) {
      return value;
    }
  }

  return fallback;
}

export function getTngChartComputedStyle(
  element: Element | null | undefined,
): CSSStyleDeclaration | null {
  if (
    element === null ||
    element === undefined ||
    typeof globalThis.getComputedStyle !== 'function'
  ) {
    return null;
  }

  return globalThis.getComputedStyle(element);
}
