import { describe, expect, it } from 'vitest';
import { accordionRegistryItem } from './accordion.registry';

describe('accordion registry item', () => {
  it('contains expected metadata', () => {
    expect(accordionRegistryItem.name).toBe('accordion');
    expect(accordionRegistryItem.dependencies).toEqual(['@tailng-ui/cdk']);
    expect(accordionRegistryItem.files).toHaveLength(5);
  });

  it('generates local accordion source files', () => {
    const accordionFile = accordionRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/accordion/tng-accordion.ts'),
    );

    expect(accordionFile).toBeDefined();
    expect(accordionFile?.content).toContain("selector: 'tng-accordion'");
    expect(accordionFile?.content).toContain('createDisclosureController');
    expect(accordionFile?.content).toContain('onTriggerKeydown');

    const primitiveFile = accordionRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/accordion/tng-accordion-primitive.ts'),
    );

    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: '[tngAccordion]'");

    const htmlFile = accordionRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/accordion/tng-accordion.html'),
    );
    expect(htmlFile).toBeDefined();
    expect(htmlFile?.content).toContain('[attr.aria-controls]="panelId"');
    expect(htmlFile?.content).toContain('role="region"');
    expect(htmlFile?.content).toContain('data-tng-accordion-trigger');
  });
});
