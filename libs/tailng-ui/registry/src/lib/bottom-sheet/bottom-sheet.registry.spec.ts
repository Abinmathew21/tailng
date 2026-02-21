import { describe, expect, it } from 'vitest';
import { bottomsheetRegistryItem } from './bottom-sheet.registry';

describe('bottom-sheet registry item', () => {
  it('contains expected metadata', () => {
    expect(bottomsheetRegistryItem.name).toBe('bottom-sheet');
    expect(bottomsheetRegistryItem.dependencies).toEqual([]);
    expect(bottomsheetRegistryItem.files).toHaveLength(5);
  });

  it('generates local bottom-sheet source files', () => {
    const componentFile = bottomsheetRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/bottom-sheet/tng-bottom-sheet.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-bottom-sheet'");

    const primitiveFile = bottomsheetRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/bottom-sheet/tng-bottom-sheet-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngBottomSheet]'");
  });
});
