import type { TngTreeTableKeydownContext, TngTreeTableKeydownIntent } from './tree-table.types';

/**
 * Pure intent resolver for treegrid keyboard events.
 * Returns an intent string (not DOM actions) so it stays testable without a browser.
 *
 * - ArrowRight  → 'expand'     (expandable & collapsed)
 * - ArrowLeft   → 'collapse'   (expandable & expanded)
 * - Enter       → 'toggle'     (expandable)
 * - Space       → 'select'     (selectable) — caller must preventDefault
 * - Home        → 'focusFirst'
 * - End         → 'focusLast'
 * - anything else → null
 */
export function resolveTreeTableKeydown(
  key: string,
  ctx: TngTreeTableKeydownContext,
): TngTreeTableKeydownIntent {
  switch (key) {
    case 'ArrowRight':
      return ctx.expandable && !ctx.expanded ? 'expand' : null;
    case 'ArrowLeft':
      return ctx.expandable && ctx.expanded ? 'collapse' : null;
    case 'Enter':
      return ctx.expandable ? 'toggle' : null;
    case ' ':
      return ctx.selectable ? 'select' : null;
    case 'Home':
      return 'focusFirst';
    case 'End':
      return 'focusLast';
    default:
      return null;
  }
}
