import { describe, expect, it } from 'vitest';
import { menuRegistryItem } from './menu.registry';

describe('menu registry item', () => {
  it('contains expected metadata', () => {
    expect(menuRegistryItem.name).toBe('menu');
    expect(menuRegistryItem.dependencies).toEqual([]);
    expect(menuRegistryItem.files).toHaveLength(6);
  });

  it('generates local menu source files', () => {
    const menuFile = menuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/menu/tng-menu.ts'),
    );
    expect(menuFile).toBeDefined();
    expect(menuFile?.content).toContain("selector: 'tng-menu'");

    const primitiveFile = menuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/menu/tng-menu-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngMenu]'");

    const triggerFile = menuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/menu/tng-menu-trigger-for.ts'),
    );
    expect(triggerFile).toBeDefined();
    expect(triggerFile?.content).toContain("selector: '[tngMenuTriggerFor]'");
  });
});
