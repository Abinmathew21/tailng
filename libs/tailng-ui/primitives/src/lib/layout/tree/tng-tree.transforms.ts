import { booleanAttribute } from '@angular/core';

export type TngTreeSelectionMode = 'single' | 'multiple' | 'none';
export type TngTreeOrientation = 'vertical' | 'horizontal';
export type TngTreeValue = string | number;

export function normalizeTreeSelectionMode(value: unknown): TngTreeSelectionMode {
  if (value === 'multiple') return 'multiple';
  if (value === 'single') return 'single';
  return 'none';
}

export function normalizeTreeOrientation(value: unknown): TngTreeOrientation {
  return value === 'horizontal' ? 'horizontal' : 'vertical';
}

export function normalizeTreeBooleanInput(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '' || normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return false;
}

export function normalizeTreeValue(value: unknown): TngTreeValue {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value;
  return String(value);
}

export function normalizeTreeValueInput(
  value: unknown,
): TngTreeValue | readonly TngTreeValue[] | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) return value.map((entry) => normalizeTreeValue(entry));
  return normalizeTreeValue(value);
}

export function normalizeOptionalBooleanAttribute(value: unknown): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return booleanAttribute(value);
}
