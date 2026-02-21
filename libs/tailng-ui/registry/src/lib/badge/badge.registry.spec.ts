import { describe, expect, it } from 'vitest';
import { badgeRegistryItem } from './badge.registry';

describe('badge registry item', () => {
  it('contains expected metadata', () => {
    expect(badgeRegistryItem.name).toBe('badge');
    expect(badgeRegistryItem.dependencies).toEqual([]);
    expect(badgeRegistryItem.files).toHaveLength(3);
  });

  it('generates local badge directive source files', () => {
    const componentFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/tng-badge.ts'),
    );
    expect(componentFile?.content).toContain('export class TngBadge');

    const primitiveFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/tng-badge-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain("selector: '[tngBadge]'");

    const indexFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-badge';");
    expect(indexFile?.content).toContain("export * from './tng-badge-primitive';");
  });
});
