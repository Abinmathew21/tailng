import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-codeblock-examples-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './codeblock-examples-page.component.html',
  styleUrl: './codeblock-examples-page.component.css',
})
export class CodeblockExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly snippet = [
    'const config = {',
    "  project: 'tailng-ui',",
    "  mode: 'production',",
    '  retries: 2,',
    '};',
    '',
    'export function buildLabel(name: string): string {',
    '  return `${name} (${config.mode})`;',
    '}',
    '',
  ].join('\n');

  protected readonly shikiSnippet = [
    'import { computed, signal } from "@angular/core";',
    '',
    'const retries = signal(2);',
    '',
    'export const statusLabel = computed(() => {',
    '  return retries() > 0 ? "retrying" : "ready";',
    '});',
    '',
    'export async function loadProfile(): Promise<string> {',
    '  if (statusLabel() === "retrying") {',
    '    return await Promise.resolve("ok");',
    '  }',
    '',
    '  return "fallback";',
    '}',
    '',
  ].join('\n');

  protected readonly shikiHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-shiki-headless.component.ts',
      code: ['readonly shikiSnippet = `import { computed } from "@angular/core";`;', ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-shiki-headless.component.html',
      code: [
        '<tng-code-block',
        '  title="load-profile.ts"',
        '  language="ts"',
        '  adapter="shiki"',
        '  [theme]="codeBlockTheme()"',
        '  [code]="shikiSnippet"',
        '  [lineNumbers]="true"',
        '  [startingLineNumber]="10"',
        '  [highlightLines]="[14, [18, 20]]"',
        '  [focusLines]="true"',
        '  [wrap]="true"',
        '  [copy]="true"',
        '></tng-code-block>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-shiki-headless.component.css',
      code: '/* Headless shell: no extra wrapper styling. */',
    },
  ]);

  protected readonly shikiPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-shiki-plain-css.component.ts',
      code: ['readonly shikiSnippet = `import { computed } from "@angular/core";`;', ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-shiki-plain-css.component.html',
      code: [
        '<div class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <tng-code-block',
        '    title="load-profile.ts"',
        '    language="ts"',
        '    adapter="shiki"',
        '    [theme]="codeBlockTheme()"',
        '    [code]="shikiSnippet"',
        '    [lineNumbers]="true"',
        '    [startingLineNumber]="10"',
        '    [highlightLines]="[14, [18, 20]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    [copy]="true"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-shiki-plain-css.component.css',
      code: [
        '.codeblock-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly shikiTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-shiki-tailwind.component.ts',
      code: ['readonly shikiSnippet = `import { computed } from "@angular/core";`;', ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-shiki-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-code-block',
        '    title="load-profile.ts"',
        '    language="ts"',
        '    adapter="shiki"',
        '    [theme]="codeBlockTheme()"',
        '    [code]="shikiSnippet"',
        '    [lineNumbers]="true"',
        '    [startingLineNumber]="10"',
        '    [highlightLines]="[14, [18, 20]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    [copy]="true"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-shiki-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-headless.component.ts',
      code: ["readonly snippet = `const config = { mode: 'production' };`;", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-headless.component.html',
      code: [
        '<div class="codeblock-example-shell codeblock-example-shell--headless">',
        '  <tng-code-block',
        '    title="config.ts"',
        '    adapter="shiki"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [theme]="codeBlockTheme()"',
        '    [lineNumbers]="true"',
        '    [wrap]="true"',
        '    [sanitizeHtml]="false"',
        '    caption="Headless-style shell with component."',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-headless.component.css',
      code: [
        '.codeblock-example-shell--headless {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-plain-css.component.ts',
      code: ["readonly snippet = `const config = { mode: 'production' };`;", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-plain-css.component.html',
      code: [
        '<div class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <tng-code-block',
        '    title="config.ts"',
        '    variant="compact"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [copy]="true"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-plain-css.component.css',
      code: [
        '.codeblock-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-tailwind.component.ts',
      code: ["readonly snippet = `const config = { mode: 'production' };`;", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-code-block',
        '    title="config.ts"',
        '    variant="ghost"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [highlightLines]="[[7, 8]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    [copy]="true"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
