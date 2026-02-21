import { describe, expect, it } from 'vitest';
import { navigationmenuRegistryItem } from './navigation-menu.registry';

describe('navigation-menu registry item', () => {
  it('contains expected metadata', () => {
    expect(navigationmenuRegistryItem.name).toBe('navigation-menu');
    expect(navigationmenuRegistryItem.dependencies).toEqual([]);
    expect(navigationmenuRegistryItem.files).toHaveLength(5);
  });

  it('generates local navigation-menu source files', () => {
    const componentFile = navigationmenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/navigation-menu/tng-navigation-menu.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-navigation-menu'");

    const primitiveFile = navigationmenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/navigation-menu/tng-navigation-menu-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngNavigationMenu]'");
  });
});
