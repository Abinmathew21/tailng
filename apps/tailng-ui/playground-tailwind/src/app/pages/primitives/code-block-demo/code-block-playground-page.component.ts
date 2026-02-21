import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  createTngCodeHighlighterAdapter,
  escapeTngCodeHtml,
  provideTngCodeHighlighting,
  TngCodeBlock,
} from '@tailng-ui/components';

const keywordHighlighterAdapter = createTngCodeHighlighterAdapter('keyword', (input) => {
  const escapedCode = escapeTngCodeHtml(input.code);
  return Promise.resolve({
    html: escapedCode.replace(
      /\b(const|export|class|return)\b/g,
      '<span style="color:#22d3ee;font-weight:700;">$1</span>',
    ),
  });
});

@Component({
  selector: 'app-code-block-playground-page',
  imports: [RouterLink, TngCodeBlock],
  providers: [
    provideTngCodeHighlighting({
      adapters: [keywordHighlighterAdapter],
    }),
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
pnpm nx run playground-vanilla:serve
pnpm tailng -- add code-block --cwd apps/tailng-ui/playground-registry`;
}
