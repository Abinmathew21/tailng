export * from './avatar/tng-avatar.component';
export { TngAvatarComponent as TngAvatar } from './avatar/tng-avatar.component';
export * from './badge/tng-badge.component';
export { TngBadgeComponent as TngBadge } from './badge/tng-badge.component';
export * from './button/tng-button.component';
export { TngButtonComponent as TngButton } from './button/tng-button.component';
export * from './code-block/tng-code-block.component';
export { TngCodeBlockComponent as TngCodeBlock } from './code-block/tng-code-block.component';
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
export { TngCopyButtonComponent as TngCopyButton } from './copy-button/tng-copy-button.component';
export * from './tag/tng-tag.component';
export { TngTagComponent as TngTag } from './tag/tng-tag.component';
export * from './tree/tng-tree.component';
export { TngTreeComponent as TngTree } from './tree/tng-tree.component';
