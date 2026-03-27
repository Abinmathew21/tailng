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
  selector: 'app-codeblock-overview-page',
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './codeblock-overview-page.component.html',
  styleUrl: './codeblock-overview-page.component.css',
})
export class CodeblockOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly primitiveImportCode = [
    'import {',
    '  TngCodeBlock,',
    '  TngCodeBlockHeader,',
    '  TngCodeBlockBody,',
    '  TngCodeBlockGutter,',
    '  TngCodeBlockCode,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngCodeBlockComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly usageCode = [
    'const retries = signal(3);',
    '',
    'export async function loadUser(): Promise<string> {',
    '  if (retries() > 0) {',
    "    return await Promise.resolve('ok');",
    '  }',
    '',
    "  return 'fallback';",
    '}',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-overview-headless.component.ts',
      code: ["readonly snippet = `const retries = signal(3);`;", ''].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-overview-headless.component.html',
      code: [
        '<div class="codeblock-preview-shell codeblock-preview-shell--headless">',
        '  <tng-code-block',
        '    title="load-user.ts"',
        '    adapter="shiki"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [theme]="codeBlockTheme()"',
        '    [lineNumbers]="true"',
        '    [startingLineNumber]="4"',
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
      title: 'codeblock-overview-headless.component.css',
      code: [
        '.codeblock-preview-shell--headless {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 84%, transparent);',
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
      title: 'codeblock-overview-plain-css.component.ts',
      code: ["readonly snippet = `const retries = signal(3);`;"].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-overview-plain-css.component.html',
      code: [
        '<div class="codeblock-preview-shell codeblock-preview-shell--plain">',
        '  <tng-code-block',
        '    title="load-user.ts"',
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
      title: 'codeblock-overview-plain-css.component.css',
      code: [
        '.codeblock-preview-shell--plain {',
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
      title: 'codeblock-overview-tailwind.component.ts',
      code: ["readonly snippet = `const retries = signal(3);`;"].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-overview-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-code-block',
        '    title="load-user.ts"',
        '    variant="ghost"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [highlightLines]="[6, [10, 12]]"',
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
      title: 'codeblock-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
