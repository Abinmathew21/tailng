import { describe, expect, it } from 'vitest';
import { dropdownMenuRegistryItem } from './dropdown-menu.registry';

describe('dropdown-menu registry item', () => {
  it('contains expected metadata', () => {
    expect(dropdownMenuRegistryItem.name).toBe('dropdown-menu');
    expect(dropdownMenuRegistryItem.dependencies).toEqual([]);
    expect(dropdownMenuRegistryItem.files).toHaveLength(5);
  });

  it('generates local dropdown-menu source files', () => {
    const menuFile = dropdownMenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dropdown-menu/tng-dropdown-menu.ts'),
    );
    expect(menuFile).toBeDefined();
    expect(menuFile?.content).toContain("selector: 'tng-dropdown-menu'");

    const primitiveFile = dropdownMenuRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dropdown-menu/tng-dropdown-menu-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngDropdownMenu]'");
  });
});
