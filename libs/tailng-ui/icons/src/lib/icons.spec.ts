import { describe, expect, it, vi } from 'vitest';
import {
  TNG_BUILTIN_ICON_PACK_NAMES,
  TNG_DEFAULT_ICON_PACK,
  TngIconResolver,
  createTngIconPack,
  parseTngIconRef,
  resolveTngIconConfig,
  type TngIconLoader,
} from './icons';

function createLoaderWithValue(value: string): TngIconLoader {
  return (): Promise<string> => Promise.resolve(value);
}

describe('resolveTngIconConfig defaults', () => {
  it('uses lucide as default and exposes built-in packs when no options are provided', () => {
    const config = resolveTngIconConfig();

    expect(config.defaultPack).toBe(TNG_DEFAULT_ICON_PACK);
    expect(config.packs.lucide).toBeDefined();
    expect(config.packs.bootstrap).toBeDefined();
    expect(config.packs.lucide.people).toBeDefined();
    expect(config.packs.bootstrap.people).toBeDefined();
    expect(TNG_BUILTIN_ICON_PACK_NAMES).toEqual(['bootstrap', 'lucide']);
  });

  it('loads the people icon from the default pack', async () => {
    const resolver = new TngIconResolver(resolveTngIconConfig());
    const iconSvg = await resolver.loadIcon('people');

    expect(iconSvg).toContain('<svg');
  });

  it('accepts custom packs without requiring built-in pack registration', () => {
    const customPack = createTngIconPack('customPack1', {
      bell: createLoaderWithValue('<svg id="custom-bell"/>'),
    });

    const config = resolveTngIconConfig({
      defaultPack: 'customPack1',
      packs: [customPack],
    });

    expect(config.defaultPack).toBe('customPack1');
    expect(config.packs.bootstrap).toBeDefined();
    expect(config.packs.lucide).toBeDefined();
    expect(config.packs.customPack1.bell).toBeDefined();
  });
});

describe('resolveTngIconConfig validation', () => {
  it('rejects overriding reserved built-in packs unless explicitly allowed', () => {
    const reservedOverride = createTngIconPack('lucide', {
      bell: createLoaderWithValue('<svg/>'),
    });

    expect(() =>
      resolveTngIconConfig({
        packs: [reservedOverride],
      }),
    ).toThrow('reserved');
  });

  it('allows reserved pack override when allowBuiltinOverride is true', async () => {
    const overrideLoader = vi.fn((): Promise<string> =>
      Promise.resolve('<svg id="override"/>'),
    );

    const config = resolveTngIconConfig({
      allowBuiltinOverride: true,
      packs: [createTngIconPack('lucide', { bell: overrideLoader })],
    });
    const resolver = new TngIconResolver(config);

    expect(await resolver.loadIcon('bell')).toBe('<svg id="override"/>');
    expect(overrideLoader).toHaveBeenCalledTimes(1);
  });

  it('throws when defaultPack does not exist', () => {
    expect(() =>
      resolveTngIconConfig({
        defaultPack: 'does-not-exist',
      }),
    ).toThrow('Unknown defaultPack');
  });
});

describe('parseTngIconRef', () => {
  it('uses default pack when no pack prefix is provided', () => {
    expect(parseTngIconRef('bell', 'lucide')).toEqual({
      name: 'bell',
      pack: 'lucide',
    });
  });

  it('respects explicit pack prefix', () => {
    expect(parseTngIconRef('bootstrap:bell', 'lucide')).toEqual({
      name: 'bell',
      pack: 'bootstrap',
    });
  });

  it('throws on empty icon reference or malformed pack syntax', () => {
    expect(() => parseTngIconRef('', 'lucide')).toThrow('icon cannot be empty');
    expect(() => parseTngIconRef('bootstrap:', 'lucide')).toThrow('icon name');
    expect(() => parseTngIconRef(':bell', 'lucide')).toThrow('icon pack');
  });
});

describe('TngIconResolver', () => {
  it('loads icons from the default pack and caches repeated requests', async () => {
    const trackedLoader = vi.fn((): Promise<string> =>
      Promise.resolve('<svg id="cached"/>'),
    );

    const config = resolveTngIconConfig({
      defaultPack: 'customPack1',
      packs: [
        createTngIconPack('customPack1', {
          bell: trackedLoader,
        }),
      ],
    });

    const resolver = new TngIconResolver(config);

    expect(await resolver.loadIcon('bell')).toBe('<svg id="cached"/>');
    expect(await resolver.loadIcon('customPack1:bell')).toBe('<svg id="cached"/>');
    expect(trackedLoader).toHaveBeenCalledTimes(1);
  });

  it('returns undefined for unknown icons or unknown packs', async () => {
    const resolver = new TngIconResolver(resolveTngIconConfig());

    expect(resolver.resolveLoader('lucide:not-in-pack')).toBeUndefined();
    expect(resolver.resolveLoader('customPack1:bell')).toBeUndefined();
    expect(await resolver.loadIcon('customPack1:bell')).toBeUndefined();
  });
});
