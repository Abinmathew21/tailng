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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly compactSnippet = [
    "export const status = 'ready';",
    '',
  ].join('\n');

  protected readonly reviewSnippet = [
    'const draft = await loadDraft();',
    '',
    "if (draft.status !== 'approved') {",
    "  return 'needs-review';",
    '}',
    '',
    'return draft.summary;',
    '',
  ].join('\n');

  protected readonly compactPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-compact-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-examples-compact-plain-css',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-examples-compact-plain-css.component.html',",
        "  styleUrl: './codeblock-examples-compact-plain-css.component.css',",
        '})',
        'export class CodeblockExamplesCompactPlainCssComponent {',
        "  protected readonly snippet = \"export const status = 'ready';\\n\";",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-compact-plain-css.component.html',
      code: [
        '<div class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <tng-code-block',
        '    title="status.ts"',
        '    variant="compact"',
        '    language="ts"',
        '    [code]="snippet"',
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
      title: 'codeblock-examples-compact-plain-css.component.css',
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

  protected readonly compactTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-compact-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-examples-compact-tailwind',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-examples-compact-tailwind.component.html',",
        "  styleUrl: './codeblock-examples-compact-tailwind.component.css',",
        '})',
        'export class CodeblockExamplesCompactTailwindComponent {',
        "  protected readonly snippet = \"export const status = 'ready';\\n\";",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-compact-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-code-block',
        '    title="status.ts"',
        '    variant="ghost"',
        '    language="ts"',
        '    [code]="snippet"',
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
      title: 'codeblock-examples-compact-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly reviewPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-review-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-examples-review-plain-css',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-examples-review-plain-css.component.html',",
        "  styleUrl: './codeblock-examples-review-plain-css.component.css',",
        '})',
        'export class CodeblockExamplesReviewPlainCssComponent {',
        '  protected readonly snippet = [',
        "    'const draft = await loadDraft();',",
        "    '',",
        "    \"if (draft.status !== 'approved') {\",",
        "    \"  return 'needs-review';\",",
        "    '}',",
        "    '',",
        "    'return draft.summary;',",
        "    '',",
        "  ].join('\\n');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-review-plain-css.component.html',
      code: [
        '<div class="codeblock-example-shell codeblock-example-shell--plain">',
        '  <tng-code-block',
        '    title="review.ts"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [highlightLines]="[3, [4, 4]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    maxHeight="14rem"',
        '    [copy]="true"',
        '    caption="Focused review shell"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-review-plain-css.component.css',
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

  protected readonly reviewTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-examples-review-tailwind.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-examples-review-tailwind',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-examples-review-tailwind.component.html',",
        "  styleUrl: './codeblock-examples-review-tailwind.component.css',",
        '})',
        'export class CodeblockExamplesReviewTailwindComponent {',
        '  protected readonly snippet = [',
        "    'const draft = await loadDraft();',",
        "    '',",
        "    \"if (draft.status !== 'approved') {\",",
        "    \"  return 'needs-review';\",",
        "    '}',",
        "    '',",
        "    'return draft.summary;',",
        "    '',",
        "  ].join('\\n');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-examples-review-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-code-block',
        '    title="review.ts"',
        '    variant="ghost"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [highlightLines]="[3, [4, 4]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    maxHeight="14rem"',
        '    [copy]="true"',
        '    caption="Focused review shell"',
        '  ></tng-code-block>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'codeblock-examples-review-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
