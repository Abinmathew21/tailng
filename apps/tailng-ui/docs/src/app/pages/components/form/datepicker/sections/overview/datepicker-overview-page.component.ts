import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngDatepickerComponent } from '@tailng-ui/components';
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
  selector: 'app-datepicker-overview-page',
  imports: [TngCodeBlockComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective, TngDatepickerComponent],
  templateUrl: './datepicker-overview-page.component.html',
  styleUrl: './datepicker-overview-page.component.css',
})
export class DatepickerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = [
    "import { TngDatepickerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly primitiveImportCode = [
    "import { TngIcon } from '@tailng-ui/icons';",
    'import {',
    '  bindTngDatepicker,',
    '  createDatepickerController,',
    '  TngDatepickerDayCell,',
    '  TngDatepickerDayGrid,',
    '  TngDatepickerHost,',
    '  TngDatepickerInput,',
    '  TngDatepickerMonthGrid,',
    '  TngDatepickerMonthOption,',
    '  TngDatepickerNextButton,',
    '  TngDatepickerOverlay,',
    '  TngDatepickerPeriodButton,',
    '  TngDatepickerPrevButton,',
    '  TngDatepickerTrigger,',
    '  TngDatepickerYearGrid,',
    '  TngDatepickerYearOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-datepicker',
    '  [defaultValue]="\'2024-04-22\'"',
    '  [today]="\'2024-04-18\'"',
    '  [minDate]="\'2024-04-01\'"',
    '  [maxDate]="\'2026-03-31\'"',
    '  ariaLabel="Invoice date"',
    '></tng-datepicker>',
    '',
  ].join('\n');

  protected readonly headlessControllerCode = [
    'readonly controller = createDatepickerController<Date>({',
    "  ownerDocument: document,",
    "  value: '2024-04-22',",
    "  today: '2024-04-18',",
    "  minDate: '2024-04-01',",
    "  maxDate: '2026-03-31',",
    '  closeOnSelect: true,',
    '  trapFocus: true,',
    '  showOutsideDays: true,',
    '});',
    '',
    'readonly datepicker = bindTngDatepicker(this.controller);',
    '',
  ].join('\n');

  protected readonly simplePlainCodeTabs = createCodeTabs(
    'overview-datepicker-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngDatepickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngDatepickerComponent],',
      "  templateUrl: './overview-datepicker-plain-css.component.html',",
      "  styleUrl: './overview-datepicker-plain-css.component.css',",
      '})',
      'export class OverviewDatepickerPlainCssComponent {}',
      '',
    ].join('\n'),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="\'2024-04-22\'"',
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-01\'"',
      '  [maxDate]="\'2026-03-31\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Invoice date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-overview-example { inline-size: 18.5rem; }\n',
  );

  protected readonly simpleTailwindCodeTabs = createCodeTabs(
    'overview-datepicker-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngDatepickerComponent } from '@tailng-ui/components';",
      '',
      '@Component({',
      '  imports: [TngDatepickerComponent],',
      "  templateUrl: './overview-datepicker-tailwind.component.html',",
      '})',
      'export class OverviewDatepickerTailwindComponent {}',
      '',
    ].join('\n'),
    [
      '<div',
      '  class="w-full max-w-[18.5rem] rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tng-semantic-background-base)_92%,var(--tng-semantic-background-surface)_8%),color-mix(in_srgb,var(--tng-semantic-background-base)_76%,var(--tng-semantic-background-surface)_24%))] p-3 text-[var(--tng-semantic-foreground-primary)] shadow-[0_10px_24px_color-mix(in_srgb,var(--tng-semantic-foreground-primary)_10%,transparent)]"',
      '>',
      '  <tng-datepicker',
      '    [defaultOpen]="false"',
      '    [defaultValue]="\'2024-04-22\'"',
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-01\'"',
      '    [maxDate]="\'2026-03-31\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Invoice date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind handles layout while semantic tokens keep the shell in sync with theme changes. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
