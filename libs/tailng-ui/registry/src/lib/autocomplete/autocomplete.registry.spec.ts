import { describe, expect, it } from 'vitest';
import { autocompleteRegistryItem } from './autocomplete.registry';

describe('autocomplete registry item', () => {
  it('contains expected metadata', () => {
    expect(autocompleteRegistryItem.name).toBe('autocomplete');
    expect(autocompleteRegistryItem.dependencies).toEqual([]);
    expect(autocompleteRegistryItem.files).toHaveLength(5);
  });

  it('generates local autocomplete source files', () => {
    const componentFile = autocompleteRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/autocomplete/tng-autocomplete.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-autocomplete'");

    const primitiveFile = autocompleteRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/autocomplete/tng-autocomplete-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngAutocomplete]'");
  });
});
