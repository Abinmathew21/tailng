import { expect, it } from 'vitest';
import { createOverlayFocusHandoffController } from './focus-handoff';

function membersOf(ids: readonly string[]) {
  // small helper to satisfy `members: () => readonly string[]`
  return () => ids;
}

it('activates layer and resolves initial focus candidate', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    initialFocusId: 'field-2',
    layerId: 'dialog',
    members: membersOf(['field-1', 'field-2']),
    trapFocus: true,
  });

  expect(controller.activateLayer('dialog', 'trigger-id')).toBe('field-2');
  expect(controller.isTrapActive('dialog')).toBe(true);
});

it('restores trigger id on deactivate when restore focus is enabled', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'dialog',
    members: membersOf(['field-1']),
    restoreFocus: true,
    trapFocus: true,
  });

  controller.activateLayer('dialog', 'trigger');
  expect(controller.deactivateLayer('dialog')).toBe('trigger');
});

it('resolves fallback candidate inside trapped focus scope', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'dialog',
    members: membersOf(['field-1', 'field-2']),
    trapFocus: true,
  });

  controller.activateLayer('dialog');
  controller.recordFocus('dialog', 'field-2');

  // while trapped, an outside candidate should resolve to the last-focused member
  expect(controller.resolveFocusCandidate('dialog', 'outside')).toBe('field-2');
});

it('only top-most active layer keeps trap active', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'parent',
    members: membersOf(['parent-field']),
    trapFocus: true,
  });
  controller.registerLayer({
    layerId: 'child',
    members: membersOf(['child-field']),
    trapFocus: true,
  });

  controller.activateLayer('parent');
  expect(controller.isTrapActive('parent')).toBe(true);

  controller.activateLayer('child');
  expect(controller.isTrapActive('parent')).toBe(false);
  expect(controller.isTrapActive('child')).toBe(true);
});

it('unregister deactivates layer and is safe for unknown ids', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'dialog',
    members: membersOf(['field-1']),
    trapFocus: true,
  });

  controller.activateLayer('dialog', 'trigger');
  controller.unregisterLayer('dialog');
  controller.unregisterLayer('missing');

  expect(controller.isTrapActive('dialog')).toBe(false);
  expect(controller.deactivateLayer('dialog')).toBeNull();
});