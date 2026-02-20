import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';
import {
  bootstrapPackLoaders,
  lucidePackLoaders,
} from './icon-loaders.generated';

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

function toCanonicalBuiltinPackName(packName: string): string | null {
  const normalizedPackName = packName.trim().toLowerCase();
  return hasPackName(TNG_BUILTIN_ICON_PACKS, normalizedPackName)
    ? normalizedPackName
    : null;
}

function toEffectivePackName(packName: string): string {
  return toCanonicalBuiltinPackName(packName) ?? packName;
}

function isBuiltinPackName(packName: string): boolean {
  return toCanonicalBuiltinPackName(packName) !== null;
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
  const effectiveCandidate = toEffectivePackName(normalizedCandidate);

  if (!hasPackName(packs, effectiveCandidate)) {
    const lucideHint =
      normalizedCandidate.toLowerCase() === 'lucid' && hasPackName(packs, 'lucide')
        ? ' Did you mean "lucide"?'
        : '';

    throw new Error(
      `Unknown defaultPack "${normalizedCandidate}".${lucideHint} Available packs: ${Object.keys(packs).join(', ')}`,
    );
  }

  return effectiveCandidate;
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
    const effectivePackName = toEffectivePackName(normalizedPackName);

    if (seenCustomPackNames.has(effectivePackName)) {
      throw new Error(`Duplicate icon pack "${effectivePackName}" provided.`);
    }

    seenCustomPackNames.add(effectivePackName);
    if (isBuiltinPackName(normalizedPackName) && !allowBuiltinOverride) {
      throw new Error(
        `Icon pack "${effectivePackName}" is reserved. Set allowBuiltinOverride to true to override it.`,
      );
    }

    mergedPacks[effectivePackName] = createReadonlyPackLoaders(customPack.icons);
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
      pack: toEffectivePackName(normalizeRequiredValue(defaultPack, 'defaultPack')),
    };
  }

  return {
    name: normalizeRequiredValue(normalizedIconRef.slice(separatorIndex + 1), 'icon name'),
    pack: toEffectivePackName(
      normalizeRequiredValue(normalizedIconRef.slice(0, separatorIndex), 'icon pack'),
    ),
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

export const TNG_ICON_RESOLVER = new InjectionToken<TngIconResolver>(
  'TNG_ICON_RESOLVER',
  {
    providedIn: 'root',
    factory: (): TngIconResolver => new TngIconResolver(inject(TNG_ICON_CONFIG)),
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
    {
      deps: [TNG_ICON_CONFIG],
      provide: TNG_ICON_RESOLVER,
      useFactory: (config: TngResolvedIconConfig): TngIconResolver =>
        new TngIconResolver(config),
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
