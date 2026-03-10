import {
  createTngCodeHighlighterAdapter,
  type TngCodeHighlightInput,
  type TngCodeHighlightResult,
} from '@tailng-ui/components';
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type HighlighterGeneric,
} from 'shiki/bundle/web';

type ShikiHighlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

const SHIKI_LANGS = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'bash',
  'html',
  'json',
  'css',
  'scss',
  'shell',
] as const satisfies readonly BundledLanguage[];

const SHIKI_THEMES = ['github-dark', 'github-light'] as const satisfies readonly BundledTheme[];

let cachedHighlighter: ShikiHighlighter | null = null;

function normalizeString(value: string | null | undefined): string {
  return (value ?? '').trim();
}

function isShikiLanguage(value: string): value is (typeof SHIKI_LANGS)[number] {
  return (SHIKI_LANGS as readonly string[]).includes(value);
}

function isShikiTheme(value: string): value is (typeof SHIKI_THEMES)[number] {
  return (SHIKI_THEMES as readonly string[]).includes(value);
}

function extractCodeInnerHtml(shikiHtml: string): string {
  const codeOpenTagIndex = shikiHtml.indexOf('<code');
  if (codeOpenTagIndex < 0) {
    return shikiHtml;
  }

  const codeContentStart = shikiHtml.indexOf('>', codeOpenTagIndex);
  if (codeContentStart < 0) {
    return shikiHtml;
  }

  const codeCloseTagIndex = shikiHtml.lastIndexOf('</code>');
  if (codeCloseTagIndex < 0 || codeCloseTagIndex <= codeContentStart) {
    return shikiHtml;
  }

  return shikiHtml.slice(codeContentStart + 1, codeCloseTagIndex);
}

function unwrapShikiLineWrapper(lineHtml: string): string {
  const lineWrapperPattern = /^<span class=(['"])line\1>([\s\S]*)<\/span>$/;
  const match = lineWrapperPattern.exec(lineHtml);
  if (match === null) {
    return lineHtml;
  }

  return match[2];
}

function normalizeShikiHtmlForTailng(shikiHtml: string): string {
  const innerHtml = extractCodeInnerHtml(shikiHtml);
  return innerHtml
    .split('\n')
    .map((line) => unwrapShikiLineWrapper(line))
    .join('\n');
}

function getPreferredShikiThemeFromEnvironment(): (typeof SHIKI_THEMES)[number] {
  const documentRef = globalThis.document;
  if (!documentRef?.documentElement) {
    return 'github-light';
  }

  const root = documentRef.documentElement;
  const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
  if (inlineColorScheme.includes('dark')) {
    return 'github-dark';
  }

  const computedColorScheme = globalThis
    .getComputedStyle(root)
    .getPropertyValue('color-scheme')
    .trim()
    .toLowerCase();
  if (computedColorScheme.includes('dark')) {
    return 'github-dark';
  }

  return 'github-light';
}

async function getOrCreateHighlighter(): Promise<ShikiHighlighter> {
  if (cachedHighlighter !== null) {
    return cachedHighlighter;
  }

  cachedHighlighter = await createHighlighter({
    themes: [...SHIKI_THEMES],
    langs: [...SHIKI_LANGS],
  });

  return cachedHighlighter;
}

export const shikiCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  'shiki',
  async (input: TngCodeHighlightInput): Promise<TngCodeHighlightResult> => {
    const highlighter = await getOrCreateHighlighter();

    const requestedLanguage = normalizeString(input.language ?? 'ts').toLowerCase();
    const requestedTheme = normalizeString(input.theme).toLowerCase();
    const language = isShikiLanguage(requestedLanguage) ? requestedLanguage : null;
    const theme = isShikiTheme(requestedTheme)
      ? requestedTheme
      : getPreferredShikiThemeFromEnvironment();

    if (language === null) {
      return {
        html: input.code,
        kind: 'html',
        language: input.language,
        trustedHtml: false,
      };
    }

    const html = normalizeShikiHtmlForTailng(
      highlighter.codeToHtml(input.code, { lang: language, theme }),
    );

    return {
      html,
      kind: 'html',
      language: input.language,
      trustedHtml: true,
    };
  },
);
