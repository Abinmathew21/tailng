import { describe, expect, it } from 'vitest';
import { accordionRegistryItem } from './accordion.registry';

describe('accordion registry item', () => {
  it('contains expected metadata', () => {
    expect(accordionRegistryItem.name).toBe('accordion');
    expect(accordionRegistryItem.dependencies).toEqual([]);
    expect(accordionRegistryItem.files).toHaveLength(5);
  });

  it('generates local accordion source files', () => {
    const accordionFile = accordionRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/accordion/tng-accordion.ts'),
    );

    expect(accordionFile).toBeDefined();
    expect(accordionFile?.content).toContain("selector: 'tng-accordion'");

    const primitiveFile = accordionRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/accordion/tng-accordion-primitive.ts'),
    );

    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngAccordion]'");
  });
});
