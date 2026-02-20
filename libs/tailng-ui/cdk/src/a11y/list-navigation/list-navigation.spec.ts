import { expect, it } from 'vitest';
import { resolveListNavigationKeyAction } from './list-navigation';

it('returns exit action for tab without preventing default', () => {
  const action = resolveListNavigationKeyAction({ key: 'Tab' });
  expect(action).toEqual({
    extendSelection: false,
    preventDefault: false,
    type: 'exit',
  });
});

it('maps vertical arrow keys to previous and next', () => {
  const down = resolveListNavigationKeyAction({ key: 'ArrowDown' });
  const up = resolveListNavigationKeyAction({ key: 'ArrowUp' });

  expect(down?.type).toBe('move-next');
  expect(up?.type).toBe('move-prev');
  expect(down?.preventDefault).toBe(true);
});

it('maps horizontal arrows when orientation is horizontal', () => {
  const right = resolveListNavigationKeyAction(
    { key: 'ArrowRight' },
    { orientation: 'horizontal' },
  );
  const left = resolveListNavigationKeyAction(
    { key: 'ArrowLeft' },
    { orientation: 'horizontal' },
  );

  expect(right?.type).toBe('move-next');
  expect(left?.type).toBe('move-prev');
});

it('applies rtl direction to horizontal movement', () => {
  const right = resolveListNavigationKeyAction(
    { key: 'ArrowRight' },
    { direction: 'rtl', orientation: 'horizontal' },
  );

  expect(right?.type).toBe('move-prev');
});

it('supports home and end keys', () => {
  const home = resolveListNavigationKeyAction({ key: 'Home' });
  const end = resolveListNavigationKeyAction({ key: 'End' });

  expect(home?.type).toBe('move-first');
  expect(end?.type).toBe('move-last');
});

it('supports shift extend for multi-select movement', () => {
  const action = resolveListNavigationKeyAction(
    {
      key: 'ArrowDown',
      shiftKey: true,
    },
    {
      multiSelect: true,
    },
  );

  expect(action).toEqual({
    extendSelection: true,
    preventDefault: true,
    type: 'move-next',
  });
});

it('maps space to toggle in multi-select mode', () => {
  const action = resolveListNavigationKeyAction(
    {
      key: ' ',
    },
    {
      multiSelect: true,
    },
  );

  expect(action?.type).toBe('toggle-active');
});

it('maps enter to select-active', () => {
  const action = resolveListNavigationKeyAction({ key: 'Enter' });
  expect(action?.type).toBe('select-active');
});

it('supports ctrl+a select-all in multi-select mode', () => {
  const action = resolveListNavigationKeyAction(
    {
      ctrlKey: true,
      key: 'a',
    },
    {
      multiSelect: true,
    },
  );

  expect(action?.type).toBe('select-all');
});

it('ignores keys with disallowed modifiers', () => {
  expect(resolveListNavigationKeyAction({ altKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveListNavigationKeyAction({ metaKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveListNavigationKeyAction({ ctrlKey: true, key: 'ArrowDown' })).toBeNull();
});
