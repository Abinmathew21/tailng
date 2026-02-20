import { expect, it } from 'vitest';
import { createActiveDescendantController } from './active-descendant';

it('always includes host id attribute', () => {
  const controller = createActiveDescendantController({ hostId: 'listbox-1' });
  expect(controller.getHostAttributes().id).toBe('listbox-1');
});

it('tracks active descendant id', () => {
  const controller = createActiveDescendantController({ hostId: 'listbox-1' });
  controller.setActiveId('option-2');
  expect(controller.getActiveId()).toBe('option-2');
});

it('emits aria-activedescendant when active id exists', () => {
  const controller = createActiveDescendantController({ hostId: 'listbox-1' });
  controller.setActiveId('option-2');
  expect(controller.getHostAttributes()['aria-activedescendant']).toBe('option-2');
});

it('supports initial active id', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    initialActiveId: 'option-1',
  });

  expect(controller.getActiveId()).toBe('option-1');
  expect(controller.getHostAttributes()['aria-activedescendant']).toBe('option-1');
});

it('clears active descendant and removes aria-activedescendant', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    initialActiveId: 'option-1',
  });

  controller.clear();
  expect(controller.getActiveId()).toBeNull();
  expect(controller.getHostAttributes()['aria-activedescendant']).toBeUndefined();
});

it('supports explicit null updates', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    initialActiveId: 'option-1',
  });

  controller.setActiveId(null);
  expect(controller.getHostAttributes()['aria-activedescendant']).toBeUndefined();
});

it('returns frozen host attributes objects', () => {
  const controller = createActiveDescendantController({ hostId: 'listbox-1' });
  const attributes = controller.getHostAttributes();
  expect(Object.isFrozen(attributes)).toBe(true);
});

it('moves next and previous across configured item ids', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2', 'option-3'],
  });

  expect(controller.moveNext()).toBe('option-1');
  expect(controller.moveNext()).toBe('option-2');
  expect(controller.movePrev()).toBe('option-1');
});

it('loops by default', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2'],
  });

  controller.setActiveId('option-2');
  expect(controller.moveNext()).toBe('option-1');
  controller.setActiveId('option-1');
  expect(controller.movePrev()).toBe('option-2');
});

it('respects non-loop mode at boundaries', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2'],
    loop: false,
  });

  controller.setActiveId('option-2');
  expect(controller.moveNext()).toBe('option-2');
  controller.setActiveId('option-1');
  expect(controller.movePrev()).toBe('option-1');
});

it('skips disabled ids in navigation and rejects disabled setActiveId', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2', 'option-3'],
    disabledIds: ['option-2'],
  });

  expect(controller.moveNext()).toBe('option-1');
  expect(controller.moveNext()).toBe('option-3');
  controller.setActiveId('option-2');
  expect(controller.getActiveId()).toBe('option-3');
});

it('clears active id when item list update removes it', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2'],
    initialActiveId: 'option-2',
  });

  controller.setItemIds(['option-1']);
  expect(controller.getActiveId()).toBeNull();
});

it('clears active id when disabled update blocks it', () => {
  const controller = createActiveDescendantController({
    hostId: 'listbox-1',
    itemIds: ['option-1', 'option-2'],
    initialActiveId: 'option-2',
  });

  controller.setDisabledIds(['option-2']);
  expect(controller.getActiveId()).toBeNull();
});
