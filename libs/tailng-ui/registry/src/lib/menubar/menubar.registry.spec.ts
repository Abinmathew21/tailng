import { describe, expect, it } from 'vitest';
import { menubarRegistryItem } from './menubar.registry';

describe('menubar registry item', () => {
  it('contains expected metadata', () => {
    expect(menubarRegistryItem.name).toBe('menubar');
    expect(menubarRegistryItem.dependencies).toEqual([]);
    expect(menubarRegistryItem.files).toHaveLength(5);
  });

  it('generates local menubar source files', () => {
    const componentFile = menubarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/menubar/tng-menubar.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-menubar'");

    const primitiveFile = menubarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/menubar/tng-menubar-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngMenubar]'");
  });
});
