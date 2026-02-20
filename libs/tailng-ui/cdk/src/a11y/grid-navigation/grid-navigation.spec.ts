import { expect, it } from 'vitest';
import { moveGridCell, resolveGridNavigationKeyAction } from './grid-navigation';

it('resolves exit action for tab without preventing default', () => {
  const action = resolveGridNavigationKeyAction({ key: 'Tab' });
  expect(action).toEqual({
    preventDefault: false,
    type: 'exit',
  });
});

it('maps vertical arrow keys to row movement', () => {
  expect(resolveGridNavigationKeyAction({ key: 'ArrowUp' })?.type).toBe('move-up');
  expect(resolveGridNavigationKeyAction({ key: 'ArrowDown' })?.type).toBe('move-down');
});

it('maps horizontal arrow keys with ltr direction by default', () => {
  expect(resolveGridNavigationKeyAction({ key: 'ArrowLeft' })?.type).toBe('move-left');
  expect(resolveGridNavigationKeyAction({ key: 'ArrowRight' })?.type).toBe('move-right');
});

it('maps horizontal arrow keys with rtl direction', () => {
  const left = resolveGridNavigationKeyAction({ key: 'ArrowLeft' }, { direction: 'rtl' });
  const right = resolveGridNavigationKeyAction({ key: 'ArrowRight' }, { direction: 'rtl' });

  expect(left?.type).toBe('move-right');
  expect(right?.type).toBe('move-left');
});

it('maps home/end to row and grid boundaries', () => {
  expect(resolveGridNavigationKeyAction({ key: 'Home' })?.type).toBe('move-row-start');
  expect(resolveGridNavigationKeyAction({ key: 'End' })?.type).toBe('move-row-end');
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'Home' })?.type).toBe(
    'move-grid-start',
  );
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'End' })?.type).toBe(
    'move-grid-end',
  );
});

it('maps enter and space to activate', () => {
  expect(resolveGridNavigationKeyAction({ key: 'Enter' })?.type).toBe('activate');
  expect(resolveGridNavigationKeyAction({ key: ' ' })?.type).toBe('activate');
});

it('ignores disallowed modifiers', () => {
  expect(resolveGridNavigationKeyAction({ altKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveGridNavigationKeyAction({ metaKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'ArrowDown' })).toBeNull();
});

it('moves grid cells within bounds', () => {
  const start = { col: 1, row: 1 } as const;
  const bounds = { colCount: 3, rowCount: 3 } as const;

  expect(moveGridCell(start, 'move-up', bounds)).toEqual({ col: 1, row: 0 });
  expect(moveGridCell(start, 'move-down', bounds)).toEqual({ col: 1, row: 2 });
  expect(moveGridCell(start, 'move-left', bounds)).toEqual({ col: 0, row: 1 });
  expect(moveGridCell(start, 'move-right', bounds)).toEqual({ col: 2, row: 1 });
});

it('clamps movement and handles row/grid boundary actions', () => {
  const bounds = { colCount: 3, rowCount: 2 } as const;

  expect(moveGridCell({ col: 0, row: 0 }, 'move-left', bounds)).toEqual({ col: 0, row: 0 });
  expect(moveGridCell({ col: 2, row: 1 }, 'move-right', bounds)).toEqual({ col: 2, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-row-start', bounds)).toEqual({ col: 0, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-row-end', bounds)).toEqual({ col: 2, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-grid-start', bounds)).toEqual({ col: 0, row: 0 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-grid-end', bounds)).toEqual({ col: 2, row: 1 });
});
