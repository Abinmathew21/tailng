import { expect, it } from 'vitest';
import {
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  resolveTngCodeHighlightingConfig,
  TngCodeHighlightingResolver,
} from './highlighting';

it('escapes html entities', () => {
  expect(escapeTngCodeHtml('<button class="a">x & y</button>')).toBe(
    '&lt;button class=&quot;a&quot;&gt;x &amp; y&lt;/button&gt;',
  );
});

it('normalizes adapter ids in config', () => {
  const keywordAdapter = createTngCodeHighlighterAdapter('Keyword', (input) =>
    Promise.resolve({
      html: input.code.split('const').join('<span class="kw">const</span>'),
    }),
  );

  const config = resolveTngCodeHighlightingConfig({
    adapters: [keywordAdapter],
    defaultAdapter: 'keyword',
  });

  expect(config.defaultAdapter).toBe('keyword');
  expect(Object.keys(config.adapters)).toContain('plain');
  expect(Object.keys(config.adapters)).toContain('keyword');
});

it('resolves custom adapter and falls back to default adapter', async () => {
  const keywordAdapter = createTngCodeHighlighterAdapter('keyword', (input) =>
    Promise.resolve({
      html: input.code.split('const').join('<span class="kw">const</span>'),
    }),
  );

  const config = resolveTngCodeHighlightingConfig({
    adapters: [keywordAdapter],
    defaultAdapter: 'keyword',
  });

  const resolver = new TngCodeHighlightingResolver(config);

  const highlightedHtml = await resolver.highlight({
    adapter: null,
    code: 'const value = 1;',
    language: 'ts',
  });
  expect(highlightedHtml).toContain('class="kw"');

  const fallbackHtml = await resolver.highlight({
    adapter: 'unknown-adapter',
    code: 'const fallback = 2;',
    language: null,
  });
  expect(fallbackHtml).toContain('class="kw"');
});

it('rejects duplicate custom adapters', () => {
  const adapterA = createTngCodeHighlighterAdapter('custom', () => Promise.resolve({ html: 'a' }));
  const adapterB = createTngCodeHighlighterAdapter('custom', () => Promise.resolve({ html: 'b' }));

  expect(() =>
    resolveTngCodeHighlightingConfig({
      adapters: [adapterA, adapterB],
    }),
  ).toThrowError('Duplicate code highlighter adapter "custom" provided.');
});
