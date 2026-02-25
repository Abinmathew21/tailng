export * from './avatar/tng-avatar.component';
export * from './badge/tng-badge.component';
export * from './button/tng-button.component';
export * from './code-block/tng-code-block.component';
export {
  TNG_CODE_HIGHLIGHTING_CONFIG,
  TNG_CODE_HIGHLIGHTING_RESOLVER,
  TNG_BUILTIN_CODE_HIGHLIGHTERS,
  TNG_DEFAULT_CODE_HIGHLIGHTER_ID,
  TngCodeHighlightingResolver,
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  highlightWithTngCodeHighlightingConfig,
  normalizeTngCodeHighlighterId,
  normalizeTngCodeLanguage,
  provideTngCodeHighlighting,
  resolveTngCodeHighlightingConfig,
  tngPlainCodeHighlighterAdapter,
} from './code-block/highlighting';
export type {
  TngCodeHighlightInput,
  TngCodeHighlightingResolverLike,
  TngCodeHighlightRequest,
  TngCodeHighlightResult,
  TngCodeHighlighterAdapter,
  TngProvideCodeHighlightingOptions,
  TngResolvedCodeHighlightingConfig,
} from './code-block/highlighting';
export * from './copy-button/tng-copy-button.component';
export * from './tag/tng-tag.component';
export * from './tree/tng-tree.component';
