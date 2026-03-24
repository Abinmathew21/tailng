import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getRegistryItem, listRegistryItemNames, tailngRegistry } from './registry';

function extractRegistryReadmeNames(): readonly string[] {
  const readmePath = resolve(process.cwd(), 'libs/tailng-ui/registry/README.md');
  const readme = readFileSync(readmePath, 'utf8');
  const startIndex = readme.indexOf('## Current registry items');
  const endIndex = readme.indexOf('For the exact installable UX, use:', startIndex);

  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    return [];
  }

  const surfaceSection = readme.slice(startIndex, endIndex);
  return Array.from(surfaceSection.matchAll(/`([^`]+)`/g), ([, name]) => name);
}

describe('registry names', () => {
  it('stays aligned with the registered items and keeps names unique', () => {
    const names = listRegistryItemNames();

    expect(names).toEqual(tailngRegistry.map((item) => item.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps the published README surface aligned with the actual registry items', () => {
    const readmeNames = extractRegistryReadmeNames();
    const registryNames = [...listRegistryItemNames()].sort((left, right) => {
      return left.localeCompare(right);
    });

    expect(readmeNames.length).toBeGreaterThan(0);
    expect(new Set(readmeNames).size).toBe(readmeNames.length);
    expect([...readmeNames].sort((left, right) => left.localeCompare(right))).toEqual(registryNames);
  });
});

describe('registry lookup', () => {
  it('resolves each registered item by name', () => {
    for (const item of tailngRegistry) {
      expect(getRegistryItem(item.name)).toEqual(item);
    }

    expect(getRegistryItem('unknown')).toBeUndefined();
  });

  it('exposes explicit install metadata for every registry item', () => {
    for (const item of tailngRegistry) {
      expect(item.install.importPath).toBe(`./tailng-ui/${item.name}`);
      expect(item.install.importSymbols.length).toBeGreaterThan(0);
      expect(new Set(item.install.importSymbols).size).toBe(item.install.importSymbols.length);
    }
  });
});
