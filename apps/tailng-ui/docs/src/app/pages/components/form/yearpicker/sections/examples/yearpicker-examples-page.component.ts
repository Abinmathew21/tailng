import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngYearpickerComponent } from '@tailng-ui/components';
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
    "import { TngYearpickerComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    '  imports: [TngYearpickerComponent],',
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
  selector: 'app-yearpicker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    DocsFormDemoShellComponent,
    TngYearpickerComponent,
  ],
  templateUrl: './yearpicker-examples-page.component.html',
  styleUrl: './yearpicker-examples-page.component.css',
})
export class YearpickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly defaultPlainCodeTabs = createCodeTabs(
    'default-yearpicker-plain-css',
    createWrapperTsCode('default-yearpicker-plain-css'),
    [
      '<tng-yearpicker',
      '  [defaultValue]="2024"',
      '  [minYear]="2000"',
      '  [maxYear]="2030"',
      '  [fullWidth]="false"',
      '></tng-yearpicker>',
      '',
    ].join('\n'),
    '.yearpicker-example { inline-size: 10rem; }\n',
  );

  protected readonly defaultTailwindCodeTabs = createCodeTabs(
    'default-yearpicker-tailwind',
    createWrapperTsCode('default-yearpicker-tailwind'),
    [
      '<div class="w-full max-w-[10rem]">',
      '  <tng-yearpicker',
      '    [defaultValue]="2024"',
      '    [minYear]="2000"',
      '    [maxYear]="2030"',
      '    [fullWidth]="false"',
      '  ></tng-yearpicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly boundedPlainCodeTabs = createCodeTabs(
    'bounded-yearpicker-plain-css',
    createWrapperTsCode('bounded-yearpicker-plain-css'),
    [
      '<tng-yearpicker',
      '  [defaultValue]="2024"',
      '  [minYear]="2020"',
      '  [maxYear]="2026"',
      '  [fullWidth]="false"',
      '></tng-yearpicker>',
      '',
    ].join('\n'),
    '.yearpicker-example { inline-size: 10rem; }\n',
  );

  protected readonly boundedTailwindCodeTabs = createCodeTabs(
    'bounded-yearpicker-tailwind',
    createWrapperTsCode('bounded-yearpicker-tailwind'),
    [
      '<div class="w-full max-w-[10rem]">',
      '  <tng-yearpicker',
      '    [defaultValue]="2024"',
      '    [minYear]="2020"',
      '    [maxYear]="2026"',
      '    [fullWidth]="false"',
      '  ></tng-yearpicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  protected readonly disabledPlainCodeTabs = createCodeTabs(
    'disabled-yearpicker-plain-css',
    createWrapperTsCode('disabled-yearpicker-plain-css'),
    [
      '<tng-yearpicker',
      '  [defaultValue]="2024"',
      '  [disabled]="true"',
      '  [fullWidth]="false"',
      '></tng-yearpicker>',
      '',
    ].join('\n'),
    '.yearpicker-example { inline-size: 10rem; }\n',
  );

  protected readonly disabledTailwindCodeTabs = createCodeTabs(
    'disabled-yearpicker-tailwind',
    createWrapperTsCode('disabled-yearpicker-tailwind'),
    [
      '<div class="w-full max-w-[10rem]">',
      '  <tng-yearpicker',
      '    [defaultValue]="2024"',
      '    [disabled]="true"',
      '    [fullWidth]="false"',
      '  ></tng-yearpicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles spacing while semantic tokens keep the shell synced to theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
