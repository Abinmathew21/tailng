import { describe, expect, it } from 'vitest';
import { toastRegistryItem } from './toast.registry';

describe('toast registry item', () => {
  it('contains expected metadata', () => {
    expect(toastRegistryItem.name).toBe('toast');
    expect(toastRegistryItem.dependencies).toEqual([]);
    expect(toastRegistryItem.files).toHaveLength(5);
  });

  it('generates local toast source files', () => {
    const componentFile = toastRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toast/tng-toast.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-toast'");
    expect(componentFile?.content).toContain('normalizeTngToastDuration');

    const primitiveFile = toastRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/toast/tng-toast-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngToastItem]'");
  });
});
