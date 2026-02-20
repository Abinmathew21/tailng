import {
  InjectionToken,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';

export type TngIconSvg = string;
export type TngIconLoader = () => Promise<TngIconSvg>;
export type TngIconPackLoaders = Readonly<Record<string, TngIconLoader>>;

export type TngIconPack = Readonly<{
  icons: TngIconPackLoaders;
  name: string;
}>;

export type TngProvideIconsOptions = Readonly<{
  allowBuiltinOverride?: boolean;
  defaultPack?: string;
  packs?: readonly TngIconPack[];
}>;

export type TngResolvedIconConfig = Readonly<{
  defaultPack: string;
  packs: Readonly<Record<string, TngIconPackLoaders>>;
}>;

export type TngParsedIconRef = Readonly<{
  name: string;
  pack: string;
}>;

function createStaticLoader(svg: string): TngIconLoader {
  return (): Promise<TngIconSvg> => Promise.resolve(svg);
}

const lucidePackLoaders: TngIconPackLoaders = Object.freeze({
  bell: createStaticLoader('<svg viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"/></svg>'),
  check: createStaticLoader('<svg viewBox="0 0 24 24" fill="none"><path d="m20 6-11 11-5-5"/></svg>'),
});

const bootstrapPackLoaders: TngIconPackLoaders = Object.freeze({
  bell: createStaticLoader('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 16a2 2 0 0 0 1.985-1.75h-3.97A2 2 0 0 0 8 16Zm.104-14.995a1 1 0 0 0-.208 0C5.981 1.116 4.5 2.57 4.5 4.5v2.086c0 .658-.194 1.3-.558 1.847L2.09 11.5h11.82l-1.852-3.067A3.5 3.5 0 0 1 11.5 6.586V4.5c0-1.93-1.481-3.384-3.396-3.495Z"/></svg>'),
  check: createStaticLoader('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.485 1.929a.75.75 0 0 1 .086 1.057l-7 8a.75.75 0 0 1-1.08.019l-3-3a.75.75 0 1 1 1.06-1.06l2.434 2.433 6.455-7.378a.75.75 0 0 1 1.045-.071Z"/></svg>'),
});

export const TNG_DEFAULT_ICON_PACK = 'lucide';

export const TNG_BUILTIN_ICON_PACKS: Readonly<Record<string, TngIconPackLoaders>> =
  Object.freeze({
    bootstrap: bootstrapPackLoaders,
    lucide: lucidePackLoaders,
  });

export const TNG_BUILTIN_ICON_PACK_NAMES: readonly string[] = Object.freeze(
  Object.keys(TNG_BUILTIN_ICON_PACKS),
);

function createReadonlyPackLoaders(icons: TngIconPackLoaders): TngIconPackLoaders {
  return Object.freeze({ ...icons });
}

function hasPackName(
  packs: Readonly<Record<string, TngIconPackLoaders>>,
  packName: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(packs, packName);
}

function isBuiltinPackName(packName: string): boolean {
  return hasPackName(TNG_BUILTIN_ICON_PACKS, packName);
}

function normalizeRequiredValue(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error(`${label} cannot be empty.`);
  }

  return normalized;
}

function resolveDefaultPackName(
  defaultPack: string | undefined,
  packs: Readonly<Record<string, TngIconPackLoaders>>,
): string {
  const candidate = defaultPack ?? TNG_DEFAULT_ICON_PACK;
  const normalizedCandidate = normalizeRequiredValue(candidate, 'defaultPack');

  if (!hasPackName(packs, normalizedCandidate)) {
    throw new Error(
      `Unknown defaultPack "${normalizedCandidate}". Available packs: ${Object.keys(packs).join(', ')}`,
    );
  }

  return normalizedCandidate;
}

function withCustomPacks(
  basePacks: Readonly<Record<string, TngIconPackLoaders>>,
  customPacks: readonly TngIconPack[],
  allowBuiltinOverride: boolean,
): Record<string, TngIconPackLoaders> {
  const mergedPacks: Record<string, TngIconPackLoaders> = { ...basePacks };
  const seenCustomPackNames = new Set<string>();

  for (const customPack of customPacks) {
    const normalizedPackName = normalizeRequiredValue(customPack.name, 'pack name');

    if (seenCustomPackNames.has(normalizedPackName)) {
      throw new Error(`Duplicate icon pack "${normalizedPackName}" provided.`);
    }

    seenCustomPackNames.add(normalizedPackName);
    if (isBuiltinPackName(normalizedPackName) && !allowBuiltinOverride) {
      throw new Error(
        `Icon pack "${normalizedPackName}" is reserved. Set allowBuiltinOverride to true to override it.`,
      );
    }

    mergedPacks[normalizedPackName] = createReadonlyPackLoaders(customPack.icons);
  }

  return mergedPacks;
}

function resolveLoaderByParsedRef(
  parsedRef: TngParsedIconRef,
  config: TngResolvedIconConfig,
): TngIconLoader | undefined {
  const pack = config.packs[parsedRef.pack];
  if (pack === undefined) {
    return undefined;
  }

  return pack[parsedRef.name];
}

export function createTngIconPack(name: string, icons: TngIconPackLoaders): TngIconPack {
  return {
    icons: createReadonlyPackLoaders(icons),
    name: normalizeRequiredValue(name, 'pack name'),
  };
}

export function parseTngIconRef(iconRef: string, defaultPack: string): TngParsedIconRef {
  const normalizedIconRef = normalizeRequiredValue(iconRef, 'icon');
  const separatorIndex = normalizedIconRef.indexOf(':');

  if (separatorIndex < 0) {
    return {
      name: normalizedIconRef,
      pack: normalizeRequiredValue(defaultPack, 'defaultPack'),
    };
  }

  return {
    name: normalizeRequiredValue(normalizedIconRef.slice(separatorIndex + 1), 'icon name'),
    pack: normalizeRequiredValue(normalizedIconRef.slice(0, separatorIndex), 'icon pack'),
  };
}

export function resolveTngIconConfig(
  options: TngProvideIconsOptions = {},
): TngResolvedIconConfig {
  const mergedPacks = withCustomPacks(
    TNG_BUILTIN_ICON_PACKS,
    options.packs ?? [],
    options.allowBuiltinOverride === true,
  );

  return {
    defaultPack: resolveDefaultPackName(options.defaultPack, mergedPacks),
    packs: Object.freeze(mergedPacks),
  };
}

export const TNG_ICON_CONFIG = new InjectionToken<TngResolvedIconConfig>(
  'TNG_ICON_CONFIG',
  {
    providedIn: 'root',
    factory: (): TngResolvedIconConfig => resolveTngIconConfig(),
  },
);

export function provideTngIcons(
  options?: TngProvideIconsOptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TNG_ICON_CONFIG,
      useValue: resolveTngIconConfig(options),
    },
  ]);
}

export class TngIconResolver {
  private readonly loadCache = new Map<string, Promise<TngIconSvg>>();

  public constructor(private readonly config: TngResolvedIconConfig) {}

  public getAvailablePackNames(): readonly string[] {
    return Object.keys(this.config.packs);
  }

  public getDefaultPackName(): string {
    return this.config.defaultPack;
  }

  public resolveLoader(iconRef: string): TngIconLoader | undefined {
    const parsedRef = parseTngIconRef(iconRef, this.config.defaultPack);
    return resolveLoaderByParsedRef(parsedRef, this.config);
  }

  public async loadIcon(iconRef: string): Promise<TngIconSvg | undefined> {
    const parsedRef = parseTngIconRef(iconRef, this.config.defaultPack);
    const cacheKey = this.getCacheKey(parsedRef);
    const cachedIcon = this.loadCache.get(cacheKey);

    if (cachedIcon !== undefined) {
      return cachedIcon;
    }

    const loader = resolveLoaderByParsedRef(parsedRef, this.config);
    if (loader === undefined) {
      return undefined;
    }

    const iconPromise = loader();
    this.loadCache.set(cacheKey, iconPromise);

    return iconPromise;
  }

  private getCacheKey(parsedRef: TngParsedIconRef): string {
    return `${parsedRef.pack}:${parsedRef.name}`;
  }
}
