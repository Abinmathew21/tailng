import { describe, expect, it } from 'vitest';
import { tagRegistryItem } from './tag.registry';

describe('tag registry item', () => {
  it('contains expected metadata', () => {
    expect(tagRegistryItem.name).toBe('tag');
    expect(tagRegistryItem.dependencies).toEqual([]);
    expect(tagRegistryItem.files).toHaveLength(5);
  });

  it('generates local tag source files', () => {
    const componentFile = tagRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tag/tng-tag.ts'),
    );
    expect(componentFile?.content).toContain('export class TngTag');

    const primitiveFile = tagRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tag/tng-tag-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngTagPrimitive');

    const indexFile = tagRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/tag/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-tag';");
    expect(indexFile?.content).toContain("export * from './tng-tag-primitive';");
  });
});
