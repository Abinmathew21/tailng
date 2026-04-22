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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngCodeBlockComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly overviewSnippet = [
    'const config = {',
    "  mode: 'preview',",
    '  retries: 2,',
    '};',
    '',
    'export function buildLabel(name: string): string {',
    '  return `${name}:${config.mode}`;',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'codeblock-overview-plain-css.component.ts',
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-overview-plain-css.component.html',",
        "  styleUrl: './codeblock-overview-plain-css.component.css',",
        '})',
        'export class CodeblockOverviewPlainCssComponent {',
        '  protected readonly snippet = [',
        "    'const config = {',",
        "    \"  mode: 'preview',\",",
        "    '  retries: 2,',",
        "    '};',",
        "    '',",
        "    'export function buildLabel(name: string): string {',",
        "    '  return `${name}:${config.mode}`;',",
        "    '}',",
        "    '',",
        "  ].join('\\n');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-overview-plain-css.component.html',
      code: [
        '<div class="codeblock-preview-shell codeblock-preview-shell--plain">',
        '  <tng-code-block',
        '    title="app.config.ts"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [copy]="true"',
        '    caption="Default wrapper shell"',
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
      code: [
        "import { Component } from '@angular/core';",
        "import { TngCodeBlockComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-codeblock-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngCodeBlockComponent],',
        "  templateUrl: './codeblock-overview-tailwind.component.html',",
        "  styleUrl: './codeblock-overview-tailwind.component.css',",
        '})',
        'export class CodeblockOverviewTailwindComponent {',
        '  protected readonly snippet = [',
        "    'const config = {',",
        "    \"  mode: 'preview',\",",
        "    '  retries: 2,',",
        "    '};',",
        "    '',",
        "    'export function buildLabel(name: string): string {',",
        "    '  return `${name}:${config.mode}`;',",
        "    '}',",
        "    '',",
        "  ].join('\\n');",
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'codeblock-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-code-block',
        '    title="app.config.ts"',
        '    variant="ghost"',
        '    language="ts"',
        '    [code]="snippet"',
        '    [lineNumbers]="true"',
        '    [highlightLines]="[1, [6, 7]]"',
        '    [focusLines]="true"',
        '    [wrap]="true"',
        '    [copy]="true"',
        '    caption="Ghost variant with focused lines"',
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
