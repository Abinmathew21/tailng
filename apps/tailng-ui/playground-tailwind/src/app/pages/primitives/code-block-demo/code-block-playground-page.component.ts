import { Component } from '@angular/core';
import {
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  resolveTngCodeHighlightingConfig,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  TNG_CODE_HIGHLIGHTING_RESOLVER,
  TngCodeBlockComponent,
  TngCodeHighlightingResolver,
} from '@tailng-ui/components';

const keywordHighlighterAdapter = createTngCodeHighlighterAdapter('keyword', (input) => {
  const escapedCode = escapeTngCodeHtml(input.code);
  return Promise.resolve({
    kind: 'html',
    html: escapedCode.replace(
      /\b(const|export|class|return)\b/g,
      '<span class="font-semibold text-cyan-300">$1</span>',
    ),
  });
});

const tokenHighlighterAdapter = createTngCodeHighlighterAdapter('tokens', (input) => {
  const keywordPattern = /\b(import|from|const|return|async|await|if|else)\b/g;
  const numberPattern = /\b\d+\b/g;

  const tokens = input.code.split('\n').map((line) => {
    const parts = line.split(/(\b(?:import|from|const|return|async|await|if|else)\b|\b\d+\b)/g);
    return parts
      .filter((part) => part.length > 0)
      .map((part) => {
        if (keywordPattern.test(part)) {
          keywordPattern.lastIndex = 0;
          return { className: 'font-semibold text-cyan-300', content: part };
        }

        if (numberPattern.test(part)) {
          numberPattern.lastIndex = 0;
          return { className: 'font-medium text-emerald-300', content: part };
        }

        return { content: part };
      });
  });

  return Promise.resolve({
    kind: 'tokens',
    language: input.language,
    tokens,
  });
});

const unsafeHtmlAdapter = createTngCodeHighlighterAdapter('unsafe-html', () => {
  return Promise.resolve({
    kind: 'html',
    html: [
      '<span class="font-semibold text-cyan-300">const</span> message = "sanitize";',
      '<img src="x" onerror="window.__tngCodeBlockUnsafe = true">',
      '<script>window.__tngCodeBlockUnsafe = true</script>',
      '<span>safe text stays visible</span>',
    ].join('\n'),
  });
});

const codeHighlightingConfig = resolveTngCodeHighlightingConfig({
  adapters: [keywordHighlighterAdapter, tokenHighlighterAdapter, unsafeHtmlAdapter],
});

@Component({
  selector: 'app-code-block-playground-page',
  imports: [TngCodeBlockComponent],
  providers: [
    {
      provide: TNG_CODE_HIGHLIGHTING_CONFIG,
      useValue: codeHighlightingConfig,
    },
    {
      provide: TNG_CODE_HIGHLIGHTING_RESOLVER,
      useValue: new TngCodeHighlightingResolver(codeHighlightingConfig),
    },
  ],
  templateUrl: './code-block-playground-page.component.html',
})
export class CodeBlockPlaygroundPageComponent {
  protected readonly angularSnippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello TailNG</h1>',
})
export class ExampleComponent {}`;

  protected readonly controlFlowSnippet = `import { signal } from '@angular/core';

const retries = signal(3);

export async function loadUser(): Promise<string> {
  if (retries() > 0) {
    return await Promise.resolve('ok');
  }

  return 'fallback';
}`;

  protected readonly htmlSnippet = `<main>
  <section class="hero">
    <h1>TailNG Code Block</h1>
    <p>Adapter strategy for syntax highlighting.</p>
  </section>
</main>`;

  protected readonly longShellSnippet = `pnpm nx run playground-tailwind:serve
pnpm nx run playground-plain-css:serve
pnpm tailng -- add code-block --cwd apps/tailng-ui/playground-registry
pnpm nx run-many -t build -p primitives,components
pnpm nx run-many -t vite:test -p primitives,components --skipNxCache
pnpm nx graph`;

  protected readonly unsafeHtmlSnippet = `const message = 'sanitize me';`;
  protected readonly copyInstallCommand =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/theme';
  protected readonly highlightedTokenLines = [7, [9, 10]] as const;

  protected readonly shellSnippet = `pnpm nx run playground-tailwind:serve
pnpm nx run playground-plain-css:serve
pnpm tailng -- add code-block --cwd apps/tailng-ui/playground-registry`;
}
