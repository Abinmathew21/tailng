import { describe, expect, it } from 'vitest';
import { drawerRegistryItem } from './drawer.registry';

describe('drawer registry item', () => {
  it('contains expected metadata', () => {
    expect(drawerRegistryItem.name).toBe('drawer');
    expect(drawerRegistryItem.dependencies).toEqual([]);
    expect(drawerRegistryItem.files).toHaveLength(5);
  });

  it('generates local drawer source files', () => {
    const componentFile = drawerRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/drawer/tng-drawer.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-drawer'");

    const primitiveFile = drawerRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/drawer/tng-drawer-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngDrawer]'");
  });
});
