import { describe, expect, it } from 'vitest';
import { skeletonRegistryItem } from './skeleton.registry';

describe('skeleton registry item', () => {
  it('contains expected metadata', () => {
    expect(skeletonRegistryItem.name).toBe('skeleton');
    expect(skeletonRegistryItem.dependencies).toEqual([]);
    expect(skeletonRegistryItem.files).toHaveLength(5);
  });

  it('generates local skeleton source files', () => {
    const componentFile = skeletonRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/skeleton/tng-skeleton.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-skeleton'");

    const primitiveFile = skeletonRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/skeleton/tng-skeleton-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngSkeleton]'");
  });
});
