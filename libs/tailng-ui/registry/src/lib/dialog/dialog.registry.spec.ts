import { describe, expect, it } from 'vitest';
import { dialogRegistryItem } from './dialog.registry';

describe('dialog registry item', () => {
  it('contains expected metadata', () => {
    expect(dialogRegistryItem.name).toBe('dialog');
    expect(dialogRegistryItem.dependencies).toEqual([]);
    expect(dialogRegistryItem.files).toHaveLength(5);
  });

  it('generates local dialog source files', () => {
    const dialogFile = dialogRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dialog/tng-dialog.ts'),
    );
    expect(dialogFile).toBeDefined();
    expect(dialogFile?.content).toContain("selector: 'tng-dialog'");
    expect(dialogFile?.content).toContain("from './tng-dialog-primitive';");
    expect(dialogFile?.content).not.toContain('@tailng-ui/cdk');

    const templateFile = dialogRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dialog/tng-dialog.html'),
    );
    expect(templateFile).toBeDefined();
    expect(templateFile?.content).toContain('data-slot="dialog-content"');

    const primitiveFile = dialogRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dialog/tng-dialog-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('createDialogScrollLockManager');

    const indexFile = dialogRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/dialog/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-dialog';");
  });
});
