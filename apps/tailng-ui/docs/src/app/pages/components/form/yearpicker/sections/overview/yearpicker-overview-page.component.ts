import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngYearpickerComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-yearpicker-overview-page',
  imports: [TngCodeBlockComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngYearpickerComponent],
  templateUrl: './yearpicker-overview-page.component.html',
  styleUrl: './yearpicker-overview-page.component.css',
})
export class YearpickerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngYearpickerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-yearpicker',
    '  [defaultValue]="2024"',
    '  [minYear]="2000"',
    '  [maxYear]="2030"',
    '  placeholder="YYYY"',
    '></tng-yearpicker>',
    '',
  ].join('\n');

  protected readonly simplePlainCodeTabs = createCodeTabs(
    'overview-yearpicker-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngYearpickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngYearpickerComponent],',
      "  templateUrl: './overview-yearpicker-plain-css.component.html',",
      "  styleUrl: './overview-yearpicker-plain-css.component.css',",
      '})',
      'export class OverviewYearpickerPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-yearpicker',
      '  [defaultValue]="2024"',
      '  [minYear]="2000"',
      '  [maxYear]="2030"',
      '  [fullWidth]="false"',
      '></tng-yearpicker>',
      '',
    ].join('\n'),
    '.yearpicker-overview-example { inline-size: 10rem; }\n',
  );

  protected readonly simpleTailwindCodeTabs = createCodeTabs(
    'overview-yearpicker-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngYearpickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngYearpickerComponent],',
      "  templateUrl: './overview-yearpicker-tailwind.component.html',",
      '})',
      'export class OverviewYearpickerTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div',
      '  class="w-full max-w-[10rem] rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-2 text-[var(--tng-semantic-foreground-primary)]"',
      '>',
      '  <tng-yearpicker',
      '    [defaultValue]="2024"',
      '    [minYear]="2000"',
      '    [maxYear]="2030"',
      '    [fullWidth]="false"',
      '  ></tng-yearpicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles layout while semantic tokens keep the shell in sync with theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
