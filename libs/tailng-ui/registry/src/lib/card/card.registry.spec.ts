import { describe, expect, it } from 'vitest';
import { cardRegistryItem } from './card.registry';

describe('card registry item', () => {
  it('contains expected metadata', () => {
    expect(cardRegistryItem.name).toBe('card');
    expect(cardRegistryItem.dependencies).toEqual([]);
    expect(cardRegistryItem.files).toHaveLength(10);
  });

  it('generates local card source files', () => {
    const componentFile = cardRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/card/tng-card.ts'),
    );
    expect(componentFile?.content).toContain('export class TngCard');
    expect(componentFile?.content).toContain("templateUrl: './tng-card.html'");

    const primitiveFile = cardRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/card/tng-card-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngCardPrimitive');
    expect(primitiveFile?.content).toContain('export class TngCardFooterPrimitive');

    const indexFile = cardRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/card/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-card';");
    expect(indexFile?.content).toContain("export * from './tng-card-primitive';");
  });
});
