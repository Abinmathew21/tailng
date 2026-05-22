import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngMonthDaypickerComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { DocsFormDemoShellComponent } from '../../../../../../shared/form-demo-shell/docs-form-demo-shell.component';
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

function createWrapperTsCode(componentClassName: string): string {
  return [
    "import { Component } from '@angular/core';",
    "import { TngMonthDaypickerComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    '  imports: [TngMonthDaypickerComponent],',
    `  templateUrl: './${componentClassName}.component.html',`,
    `  styleUrl: './${componentClassName}.component.css',`,
    '})',
    `export class ${toPascalCase(componentClassName)}Component {}`,
    '',
  ].join('\n');
}

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join('');
}

@Component({
  selector: 'app-month-daypicker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngMonthDaypickerComponent,
  ],
  templateUrl: './month-daypicker-examples-page.component.html',
  styleUrl: './month-daypicker-examples-page.component.css',
})
export class MonthDaypickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly defaultPlainCodeTabs = createCodeTabs(
    'default-month-daypicker-plain-css',
    createWrapperTsCode('default-month-daypicker-plain-css'),
    [
      '<tng-month-daypicker',
      '  [defaultValue]="{ month: 12, day: 25 }"',
      '  [year]="2024"',
      '  [fullWidth]="false"',
      '></tng-month-daypicker>',
      '',
    ].join('\n'),
    '.month-daypicker-example { inline-size: 12rem; }\n',
  );

  protected readonly defaultTailwindCodeTabs = createCodeTabs(
    'default-month-daypicker-tailwind',
    createWrapperTsCode('default-month-daypicker-tailwind'),
    [
      '<div class="w-full max-w-[12rem]">',
      '  <tng-month-daypicker',
      '    [defaultValue]="{ month: 12, day: 25 }"',
      '    [year]="2024"',
      '    [fullWidth]="false"',
      '  ></tng-month-daypicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly disabledPlainCodeTabs = createCodeTabs(
    'disabled-month-daypicker-plain-css',
    createWrapperTsCode('disabled-month-daypicker-plain-css'),
    [
      '<tng-month-daypicker',
      '  [defaultValue]="{ month: 7, day: 4 }"',
      '  [year]="2024"',
      '  [disabled]="true"',
      '  [fullWidth]="false"',
      '></tng-month-daypicker>',
      '',
    ].join('\n'),
    '.month-daypicker-example { inline-size: 12rem; }\n',
  );

  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'disabled-month-daypicker-tailwind',
    createWrapperTsCode('disabled-month-daypicker-tailwind'),
    [
      '<div class="w-full max-w-[12rem]">',
      '  <tng-month-daypicker',
      '    [defaultValue]="{ month: 7, day: 4 }"',
      '    [year]="2024"',
      '    [disabled]="true"',
      '    [fullWidth]="false"',
      '  ></tng-month-daypicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly readonlyPlainCodeTabs = createCodeTabs(
    'readonly-month-daypicker-plain-css',
    createWrapperTsCode('readonly-month-daypicker-plain-css'),
    [
      '<tng-month-daypicker',
      '  [defaultValue]="{ month: 3, day: 15 }"',
      '  [year]="2024"',
      '  [readonly]="true"',
      '  [fullWidth]="false"',
      '></tng-month-daypicker>',
      '',
    ].join('\n'),
    '.month-daypicker-example { inline-size: 12rem; }\n',
  );

  protected readonly readonlyTailwindCodeTabs = createCodeTabs(
    'readonly-month-daypicker-tailwind',
    createWrapperTsCode('readonly-month-daypicker-tailwind'),
    [
      '<div class="w-full max-w-[12rem]">',
      '  <tng-month-daypicker',
      '    [defaultValue]="{ month: 3, day: 15 }"',
      '    [year]="2024"',
      '    [readonly]="true"',
      '    [fullWidth]="false"',
      '  ></tng-month-daypicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
