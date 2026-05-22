import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMonthDaypickerComponent } from '@tailng-ui/components';
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
  selector: 'app-month-daypicker-overview-page',
  imports: [TngCodeBlockComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngMonthDaypickerComponent],
  templateUrl: './month-daypicker-overview-page.component.html',
  styleUrl: './month-daypicker-overview-page.component.css',
})
export class MonthDaypickerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngMonthDaypickerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-month-daypicker',
    '  [defaultValue]="{ month: 12, day: 25 }"',
    '  [year]="2024"',
    '  placeholder="MM-DD"',
    '></tng-month-daypicker>',
    '',
  ].join('\n');

  protected readonly simplePlainCodeTabs = createCodeTabs(
    'overview-month-daypicker-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngMonthDaypickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngMonthDaypickerComponent],',
      "  templateUrl: './overview-month-daypicker-plain-css.component.html',",
      "  styleUrl: './overview-month-daypicker-plain-css.component.css',",
      '})',
      'export class OverviewMonthDaypickerPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-month-daypicker',
      '  [defaultValue]="{ month: 12, day: 25 }"',
      '  [year]="2024"',
      '  [fullWidth]="false"',
      '></tng-month-daypicker>',
      '',
    ].join('\n'),
    '.month-daypicker-overview-example { inline-size: 12rem; }\n',
  );

  protected readonly simpleTailwindCodeTabs = createCodeTabs(
    'overview-month-daypicker-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngMonthDaypickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngMonthDaypickerComponent],',
      "  templateUrl: './overview-month-daypicker-tailwind.component.html',",
      '})',
      'export class OverviewMonthDaypickerTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div',
      '  class="w-full max-w-[12rem] rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-2 text-[var(--tng-semantic-foreground-primary)]"',
      '>',
      '  <tng-month-daypicker',
      '    [defaultValue]="{ month: 12, day: 25 }"',
      '    [year]="2024"',
      '    [fullWidth]="false"',
      '  ></tng-month-daypicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles layout while semantic tokens keep the shell in sync with theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
