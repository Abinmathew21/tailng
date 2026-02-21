import {
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';

export type TngCodeHighlightInput = Readonly<{
  code: string;
  language: string | null;
}>;

export type TngCodeHighlightResult = Readonly<{
  html: string;
}>;

export type TngCodeHighlightRequest = Readonly<{
  adapter: string | null | undefined;
  code: string;
  language: string | null | undefined;
}>;

export type TngCodeHighlighterAdapter = Readonly<{
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult>;
  id: string;
}>;

export type TngProvideCodeHighlightingOptions = Readonly<{
  adapters?: readonly TngCodeHighlighterAdapter[];
  allowBuiltinOverride?: boolean;
  defaultAdapter?: string;
}>;

export type TngResolvedCodeHighlightingConfig = Readonly<{
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>;
  defaultAdapter: string;
}>;

export type TngCodeHighlightingResolverLike = Readonly<{
  highlight: (request: TngCodeHighlightRequest) => Promise<string>;
}>;

const htmlEscapeAmpersand = /&/g;
const htmlEscapeGt = />/g;
const htmlEscapeLt = /</g;
const htmlEscapeQuote = /"/g;
const htmlEscapeSingleQuote = /'/g;
const htmlEscapeAmpersandValue = '&amp;';
const htmlEscapeGtValue = '&gt;';
const htmlEscapeLtValue = '&lt;';
const htmlEscapeQuoteValue = '&quot;';
const htmlEscapeSingleQuoteValue = '&#39;';

export const TNG_DEFAULT_CODE_HIGHLIGHTER_ID = 'plain';

function hasAdapter(
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
  adapterId: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(adapters, adapterId);
}

function normalizeRequiredString(value: string, label: string): string {
  const normalizedValue = value.trim();
  if (normalizedValue.length === 0) {
    throw new Error(`${label} cannot be empty.`);
  }

  return normalizedValue;
}

function createReadonlyAdapterMap(
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
): Readonly<Record<string, TngCodeHighlighterAdapter>> {
  return Object.freeze({ ...adapters });
}

function withCustomAdapters(
  baseAdapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
  customAdapters: readonly TngCodeHighlighterAdapter[],
  allowBuiltinOverride: boolean,
): Record<string, TngCodeHighlighterAdapter> {
  const mergedAdapters: Record<string, TngCodeHighlighterAdapter> = { ...baseAdapters };
  const seenCustomAdapterIds = new Set<string>();

  for (const adapter of customAdapters) {
    const adapterId = normalizeTngCodeHighlighterId(adapter.id);
    const isBuiltinAdapter = hasAdapter(TNG_BUILTIN_CODE_HIGHLIGHTERS, adapterId);

    if (seenCustomAdapterIds.has(adapterId)) {
      throw new Error(`Duplicate code highlighter adapter "${adapterId}" provided.`);
    }

    seenCustomAdapterIds.add(adapterId);
    if (isBuiltinAdapter && !allowBuiltinOverride) {
      throw new Error(
        `Code highlighter adapter "${adapterId}" is reserved. Set allowBuiltinOverride to true to override it.`,
      );
    }

    mergedAdapters[adapterId] = adapter;
  }

  return mergedAdapters;
}

function resolveDefaultAdapterId(
  defaultAdapter: string | undefined,
  adapters: Readonly<Record<string, TngCodeHighlighterAdapter>>,
): string {
  const candidateAdapter = defaultAdapter ?? TNG_DEFAULT_CODE_HIGHLIGHTER_ID;
  const normalizedAdapter = normalizeTngCodeHighlighterId(candidateAdapter);
  if (hasAdapter(adapters, normalizedAdapter)) {
    return normalizedAdapter;
  }

  throw new Error(
    `Unknown default code highlighter adapter "${normalizedAdapter}". Available adapters: ${Object.keys(adapters).join(', ')}`,
  );
}

function resolveAdapterFromRequest(
  request: TngCodeHighlightRequest,
  config: TngResolvedCodeHighlightingConfig,
): TngCodeHighlighterAdapter {
  const requestedAdapter = request.adapter;
  if (requestedAdapter !== null && requestedAdapter !== undefined) {
    const normalizedAdapter = normalizeTngCodeHighlighterId(requestedAdapter);
    const resolvedAdapter = config.adapters[normalizedAdapter];
    if (resolvedAdapter !== undefined) {
      return resolvedAdapter;
    }
  }

  return config.adapters[config.defaultAdapter];
}

export function normalizeTngCodeLanguage(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function normalizeTngCodeHighlighterId(value: string): string {
  return normalizeRequiredString(value, 'Code highlighter adapter id').toLowerCase();
}

export function escapeTngCodeHtml(value: string): string {
  return value
    .replace(htmlEscapeAmpersand, htmlEscapeAmpersandValue)
    .replace(htmlEscapeLt, htmlEscapeLtValue)
    .replace(htmlEscapeGt, htmlEscapeGtValue)
    .replace(htmlEscapeQuote, htmlEscapeQuoteValue)
    .replace(htmlEscapeSingleQuote, htmlEscapeSingleQuoteValue);
}

export function createTngCodeHighlighterAdapter(
  id: string,
  highlight: (input: TngCodeHighlightInput) => Promise<TngCodeHighlightResult>,
): TngCodeHighlighterAdapter {
  const adapterId = normalizeTngCodeHighlighterId(id);
  return Object.freeze({
    highlight,
    id: adapterId,
  });
}

export const tngPlainCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  TNG_DEFAULT_CODE_HIGHLIGHTER_ID,
  (input: TngCodeHighlightInput): Promise<TngCodeHighlightResult> =>
    Promise.resolve({
      html: escapeTngCodeHtml(input.code),
    }),
);

export const TNG_BUILTIN_CODE_HIGHLIGHTERS: Readonly<Record<string, TngCodeHighlighterAdapter>> =
  createReadonlyAdapterMap({
    [TNG_DEFAULT_CODE_HIGHLIGHTER_ID]: tngPlainCodeHighlighterAdapter,
  });

export function resolveTngCodeHighlightingConfig(
  options: TngProvideCodeHighlightingOptions = {},
): TngResolvedCodeHighlightingConfig {
  const mergedAdapters = withCustomAdapters(
    TNG_BUILTIN_CODE_HIGHLIGHTERS,
    options.adapters ?? [],
    options.allowBuiltinOverride === true,
  );

  return {
    adapters: createReadonlyAdapterMap(mergedAdapters),
    defaultAdapter: resolveDefaultAdapterId(options.defaultAdapter, mergedAdapters),
  };
}

export async function highlightWithTngCodeHighlightingConfig(
  request: TngCodeHighlightRequest,
  config: TngResolvedCodeHighlightingConfig,
): Promise<string> {
  const adapter = resolveAdapterFromRequest(request, config);
  const normalizedLanguage = normalizeTngCodeLanguage(request.language);
  const result = await adapter.highlight({
    code: request.code,
    language: normalizedLanguage,
  });

  return result.html;
}

export const TNG_CODE_HIGHLIGHTING_CONFIG = new InjectionToken<TngResolvedCodeHighlightingConfig>(
  'TNG_CODE_HIGHLIGHTING_CONFIG',
  {
    providedIn: 'root',
    factory: (): TngResolvedCodeHighlightingConfig => resolveTngCodeHighlightingConfig(),
  },
);

export const TNG_CODE_HIGHLIGHTING_RESOLVER = new InjectionToken<TngCodeHighlightingResolverLike>(
  'TNG_CODE_HIGHLIGHTING_RESOLVER',
  {
    providedIn: 'root',
    factory: (): TngCodeHighlightingResolverLike =>
      new TngCodeHighlightingResolver(inject(TNG_CODE_HIGHLIGHTING_CONFIG)),
  },
);

export function provideTngCodeHighlighting(
  options?: TngProvideCodeHighlightingOptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TNG_CODE_HIGHLIGHTING_CONFIG,
      useValue: resolveTngCodeHighlightingConfig(options),
    },
    {
      deps: [TNG_CODE_HIGHLIGHTING_CONFIG],
      provide: TNG_CODE_HIGHLIGHTING_RESOLVER,
      useFactory: (
        config: TngResolvedCodeHighlightingConfig,
      ): TngCodeHighlightingResolverLike => new TngCodeHighlightingResolver(config),
    },
  ]);
}

export class TngCodeHighlightingResolver {
  public constructor(private readonly config: TngResolvedCodeHighlightingConfig) {}

  public getAdapterIds(): readonly string[] {
    return Object.keys(this.config.adapters);
  }

  public getDefaultAdapterId(): string {
    return this.config.defaultAdapter;
  }

  public async highlight(request: TngCodeHighlightRequest): Promise<string> {
    return highlightWithTngCodeHighlightingConfig(request, this.config);
  }
}
