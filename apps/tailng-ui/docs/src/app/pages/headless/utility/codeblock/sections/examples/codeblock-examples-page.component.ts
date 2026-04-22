import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  TngCodeBlock,
  TngCodeBlockBody,
  TngCodeBlockCode,
  TngCodeBlockGutter,
  TngCodeBlockHeader,
} from '@tailng-ui/primitives';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-codeblock-examples-page',
  imports: [
    TngCodeBlock,
    TngCodeBlockHeader,
    TngCodeBlockBody,
    TngCodeBlockGutter,
    TngCodeBlockCode,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './codeblock-examples-page.component.html',
  styleUrl: './codeblock-examples-page.component.css',
})
export class HeadlessCodeblockExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly inlinePlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-codeblock-examples-inline-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import { TngCodeBlock, TngCodeBlockHeader, TngCodeBlockBody, TngCodeBlockCode } from "@tailng-ui/primitives";',
        '',
        '@Component({',
        "  selector: 'app-headless-codeblock-examples-inline-plain-css',",
        '  standalone: true,',
        '  imports: [TngCodeBlock, TngCodeBlockHeader, TngCodeBlockBody, TngCodeBlockCode],',
        "  templateUrl: './headless-codeblock-examples-inline-plain-css.component.html',",
        "  styleUrl: './headless-codeblock-examples-inline-plain-css.component.css',",
        '})',
        'export class HeadlessCodeblockExamplesInlinePlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-codeblock-examples-inline-plain-css.component.html',
      code: [
        '<section class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <section tngCodeBlock class="headless-codeblock headless-codeblock--inline">',
        '    <header tngCodeBlockHeader class="headless-codeblock__header">',
        '      <h3 class="headless-codeblock__title">package.json</h3>',
        '    </header>',
        '    <div tngCodeBlockBody class="headless-codeblock__body headless-codeblock__body--inline">',
        '      <pre class="headless-codeblock__pre"><code tngCodeBlockCode class="headless-codeblock__code"><span class="headless-codeblock__line"><span class="headless-codeblock__token headless-codeblock__token--string">"name"</span>: <span class="headless-codeblock__token headless-codeblock__token--string">"tailng-ui"</span></span></code></pre>',
        '    </div>',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-codeblock-examples-inline-plain-css.component.css',
      code: [
        '.headless-codeblock--inline [data-slot="code-block-body"] {',
        '  display: block;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly inlineTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-codeblock-examples-inline-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import { TngCodeBlock, TngCodeBlockHeader, TngCodeBlockBody, TngCodeBlockCode } from "@tailng-ui/primitives";',
        '',
        '@Component({',
        "  selector: 'app-headless-codeblock-examples-inline-tailwind',",
        '  standalone: true,',
        '  imports: [TngCodeBlock, TngCodeBlockHeader, TngCodeBlockBody, TngCodeBlockCode],',
        "  templateUrl: './headless-codeblock-examples-inline-tailwind.component.html',",
        "  styleUrl: './headless-codeblock-examples-inline-tailwind.component.css',",
        '})',
        'export class HeadlessCodeblockExamplesInlineTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-codeblock-examples-inline-tailwind.component.html',
      code: [
        '<section class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <section tngCodeBlock class="overflow-hidden rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_94%,var(--tng-semantic-accent-brand)_6%)] text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
        '    <header tngCodeBlockHeader class="border-b border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_86%,var(--tng-semantic-accent-brand)_10%)] px-4 py-2 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">package.json</header>',
        '    <div tngCodeBlockBody class="block">',
        '      <pre class="m-0 overflow-x-auto px-4 py-3"><code tngCodeBlockCode class="block font-mono text-[0.84rem] leading-6 text-[var(--tng-semantic-foreground-primary)]"><span class="block whitespace-pre"><span class="text-[var(--tng-semantic-accent-success)]">"name"</span>: <span class="text-[var(--tng-semantic-accent-brand)]">"tailng-ui"</span></span></code></pre>',
        '    </div>',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-codeblock-examples-inline-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly reviewPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-codeblock-examples-review-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngCodeBlock,',
        '  TngCodeBlockHeader,',
        '  TngCodeBlockBody,',
        '  TngCodeBlockGutter,',
        '  TngCodeBlockCode,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-codeblock-examples-review-plain-css',",
        '  standalone: true,',
        '  imports: [',
        '    TngCodeBlock,',
        '    TngCodeBlockHeader,',
        '    TngCodeBlockBody,',
        '    TngCodeBlockGutter,',
        '    TngCodeBlockCode,',
        '  ],',
        "  templateUrl: './headless-codeblock-examples-review-plain-css.component.html',",
        "  styleUrl: './headless-codeblock-examples-review-plain-css.component.css',",
        '})',
        'export class HeadlessCodeblockExamplesReviewPlainCssComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-codeblock-examples-review-plain-css.component.html',
      code: [
        '<section class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <section tngCodeBlock class="headless-codeblock">',
        '    <header tngCodeBlockHeader class="headless-codeblock__header">',
        '      <h3 class="headless-codeblock__title">review.ts</h3>',
        '      <span class="headless-codeblock__language">ts</span>',
        '    </header>',
        '    <div tngCodeBlockBody class="headless-codeblock__body">',
        '      <ol tngCodeBlockGutter class="headless-codeblock__gutter" aria-hidden="true">',
        '        <li>18</li>',
        '        <li>19</li>',
        '        <li>20</li>',
        '      </ol>',
        '      <pre class="headless-codeblock__pre"><code tngCodeBlockCode class="headless-codeblock__code"><span class="headless-codeblock__line headless-codeblock__line--dim"><span class="headless-codeblock__token headless-codeblock__token--keyword">const</span> draft = await loadDraft();</span><span class="headless-codeblock__line headless-codeblock__line--highlight"><span class="headless-codeblock__token headless-codeblock__token--keyword">if</span> (draft.status !== <span class="headless-codeblock__token headless-codeblock__token--string">\'approved\'</span>) {</span><span class="headless-codeblock__line">  <span class="headless-codeblock__token headless-codeblock__token--keyword">return</span> <span class="headless-codeblock__token headless-codeblock__token--string">\'needs-review\'</span>;</span></code></pre>',
        '    </div>',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-codeblock-examples-review-plain-css.component.css',
      code: [
        '.headless-codeblock__line--highlight {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 14%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly reviewTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-codeblock-examples-review-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        'import {',
        '  TngCodeBlock,',
        '  TngCodeBlockHeader,',
        '  TngCodeBlockBody,',
        '  TngCodeBlockGutter,',
        '  TngCodeBlockCode,',
        "} from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-codeblock-examples-review-tailwind',",
        '  standalone: true,',
        '  imports: [',
        '    TngCodeBlock,',
        '    TngCodeBlockHeader,',
        '    TngCodeBlockBody,',
        '    TngCodeBlockGutter,',
        '    TngCodeBlockCode,',
        '  ],',
        "  templateUrl: './headless-codeblock-examples-review-tailwind.component.html',",
        "  styleUrl: './headless-codeblock-examples-review-tailwind.component.css',",
        '})',
        'export class HeadlessCodeblockExamplesReviewTailwindComponent {}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-codeblock-examples-review-tailwind.component.html',
      code: [
        '<section class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <section tngCodeBlock class="overflow-hidden rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
        '    <header tngCodeBlockHeader class="flex items-center justify-between border-b border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_90%,transparent)] px-4 py-2">',
        '      <h3 class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">review.ts</h3>',
        '      <div class="inline-flex items-center gap-2 text-xs text-[var(--tng-semantic-foreground-secondary)]">',
        '        <span class="rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-accent-brand)]">ts</span>',
        '      </div>',
        '    </header>',
        '    <div tngCodeBlockBody class="grid grid-cols-[auto_minmax(0,1fr)]">',
        '      <ol tngCodeBlockGutter class="m-0 list-none border-r border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_78%,transparent)] px-3 py-3 text-right text-xs text-[var(--tng-semantic-foreground-muted)]" aria-hidden="true">',
        '        <li>18</li>',
        '        <li>19</li>',
        '        <li>20</li>',
        '      </ol>',
        '      <pre class="m-0 overflow-x-auto px-4 py-3"><code tngCodeBlockCode class="block font-mono text-[0.84rem] leading-6 text-[var(--tng-semantic-foreground-primary)]"><span class="block whitespace-pre opacity-60"><span class="text-fuchsia-300">const</span> draft = <span class="text-amber-200">await</span> loadDraft();</span><span class="block whitespace-pre rounded bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,transparent)] px-1"><span class="text-fuchsia-300">if</span> (draft.status !== <span class="text-emerald-300">\'approved\'</span>) {</span><span class="block whitespace-pre">  <span class="text-fuchsia-300">return</span> <span class="text-emerald-300">\'needs-review\'</span>;</span></code></pre>',
        '    </div>',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-codeblock-examples-review-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
