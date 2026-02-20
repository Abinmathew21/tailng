import { expect, it } from 'vitest';
import { createOverlayFocusHandoffController } from './focus-handoff';

it('activates layer and resolves initial focus candidate', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    initialFocusId: 'field-2',
    layerId: 'dialog',
    members: ['field-1', 'field-2'],
    trapFocus: true,
  });

  expect(controller.activateLayer('dialog', 'trigger-id')).toBe('field-2');
  expect(controller.isTrapActive('dialog')).toBe(true);
});

it('restores trigger id on deactivate when restore focus is enabled', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'dialog',
    members: ['field-1'],
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
    members: ['field-1', 'field-2'],
    trapFocus: true,
  });

  controller.activateLayer('dialog');
  controller.recordFocus('dialog', 'field-2');
  expect(controller.resolveFocusCandidate('dialog', 'outside')).toBe('field-2');
});

it('only top-most active layer keeps trap active', () => {
  const controller = createOverlayFocusHandoffController();
  controller.registerLayer({
    layerId: 'parent',
    members: ['parent-field'],
    trapFocus: true,
  });
  controller.registerLayer({
    layerId: 'child',
    members: ['child-field'],
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
    members: ['field-1'],
    trapFocus: true,
  });

  controller.activateLayer('dialog', 'trigger');
  controller.unregisterLayer('dialog');
  controller.unregisterLayer('missing');

  expect(controller.isTrapActive('dialog')).toBe(false);
  expect(controller.deactivateLayer('dialog')).toBeNull();
});
