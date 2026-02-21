import { Component } from '@angular/core';
import {
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  resolveTngCodeHighlightingConfig,
  TNG_CODE_HIGHLIGHTING_CONFIG,
  TNG_CODE_HIGHLIGHTING_RESOLVER,
  TngCodeBlock,
  TngCodeHighlightingResolver,
} from '@tailng-ui/components';

const keywordHighlighterAdapter = createTngCodeHighlighterAdapter('keyword', (input) => {
  const escapedCode = escapeTngCodeHtml(input.code);
  return Promise.resolve({
    html: escapedCode.replace(
      /\b(const|export|class|return)\b/g,
      '<span class="code-keyword">$1</span>',
    ),
  });
});

const codeHighlightingConfig = resolveTngCodeHighlightingConfig({
  adapters: [keywordHighlighterAdapter],
});

@Component({
  selector: 'app-code-block-playground-page',
  imports: [TngCodeBlock],
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
  styleUrl: './code-block-playground-page.component.css',
})
export class CodeBlockPlaygroundPageComponent {
  protected readonly angularSnippet = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello TailNG</h1>',
})
export class ExampleComponent {}`;

  protected readonly htmlSnippet = `<main>
  <section class="hero">
    <h1>TailNG Code Block</h1>
    <p>Adapter strategy for syntax highlighting.</p>
  </section>
</main>`;

  protected readonly shellSnippet = `pnpm nx run playground-tailwind:serve
pnpm nx run playground-plain-css:serve
pnpm tailng -- add code-block --cwd apps/tailng-ui/playground-registry`;
}
