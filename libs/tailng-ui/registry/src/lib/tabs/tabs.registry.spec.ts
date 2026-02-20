import { describe, expect, it } from 'vitest';
import { tabsRegistryItem } from './tabs.registry';

describe('tabs registry item', () => {
  it('contains expected metadata', () => {
    expect(tabsRegistryItem.name).toBe('tabs');
    expect(tabsRegistryItem.dependencies).toEqual([]);
    expect(tabsRegistryItem.files).toHaveLength(5);
  });

  it('generates local tabs source files', () => {
    const componentFile = tabsRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tabs/tng-tabs.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-tabs'");

    const primitiveFile = tabsRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tabs/tng-tabs-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngTabs]'");
  });
});
