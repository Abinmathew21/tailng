import { describe, expect, it } from 'vitest';
import { createActiveDescendantController } from './active-descendant';

describe('createActiveDescendantController', () => {
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
});
