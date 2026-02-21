import { describe, expect, it } from 'vitest';
import { getRegistryItem, listRegistryItemNames, tailngRegistry } from './registry';

describe('registry names', () => {
  it('stays aligned with the registered items and keeps names unique', () => {
    const names = listRegistryItemNames();

    expect(names).toEqual(tailngRegistry.map((item) => item.name));
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('registry lookup', () => {
  it('resolves each registered item by name', () => {
    for (const item of tailngRegistry) {
      expect(getRegistryItem(item.name)).toEqual(item);
    }

    expect(getRegistryItem('unknown')).toBeUndefined();
  });
});
