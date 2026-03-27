import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  type ElementRef,
  type OnDestroy,
  type WritableSignal,
  viewChild,
} from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngDatepickerComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createDatepickerController,
  defaultDatepickerDateAdapter,
  TngDatepickerOverlay,
  type TngDateAdapter,
  type TngDateCell,
  type TngDatepickerController,
  type TngDatepickerOutputs,
  type TngMonthOption,
  type TngYearOption,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const headlessSharedCssCode = [
  '.datepicker-demo { width: min(100%, 18.5rem); }',
  '.datepicker-demo-anchor { position: relative; }',
  '.datepicker-demo-header-row {',
  '  display: grid;',
  '  grid-template-columns: 1.9rem minmax(0, 1fr) 1.9rem;',
  '  gap: 0.4rem;',
  '  align-items: center;',
  '}',
  '.datepicker-demo-weekdays,',
  '.datepicker-demo-day-grid {',
  '  display: grid;',
  '  grid-template-columns: repeat(7, minmax(0, 1fr));',
  '  gap: var(--tng-datepicker-grid-gap);',
  '}',
  '.datepicker-demo-picker-grid {',
  '  display: grid;',
  '  grid-template-columns: repeat(4, minmax(0, 1fr));',
  '  gap: var(--tng-datepicker-grid-gap);',
  '}',
  '',
].join('\n');

const customFormatAdapter: TngDateAdapter<Date> = Object.freeze({
  ...defaultDatepickerDateAdapter,
  format: (date, format, locale) => {
    if (format === 'input') {
      const day = defaultDatepickerDateAdapter.getDate(date).toString().padStart(2, '0');
      const month = (defaultDatepickerDateAdapter.getMonth(date) + 1)
        .toString()
        .padStart(2, '0');
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${day}.${month}.${year}`;
    }

    if (format === 'month-year') {
      const month = defaultDatepickerDateAdapter.format(date, 'month-short', locale).toUpperCase();
      const year = defaultDatepickerDateAdapter.getYear(date).toString().padStart(4, '0');
      return `${year} · ${month}`;
    }

    return defaultDatepickerDateAdapter.format(date, format, locale);
  },
  parse: (text, locale) => {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text.trim());
    if (match !== null) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const date = defaultDatepickerDateAdapter.createDate(year, month, day);
      return defaultDatepickerDateAdapter.isValid(date) &&
        defaultDatepickerDateAdapter.getYear(date) === year &&
        defaultDatepickerDateAdapter.getMonth(date) === month &&
        defaultDatepickerDateAdapter.getDate(date) === day
        ? date
        : null;
    }

    return defaultDatepickerDateAdapter.parse(text, locale);
  },
});

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

function createWrapperTsCode(componentClassName: string, includeAdapter = false): string {
  const adapterImports = includeAdapter
    ? [
        "import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        'const reportingAdapter: TngDateAdapter<Date> = {',
        '  ...defaultDatepickerDateAdapter,',
        "  format: (date, format, locale) => format === 'month-year' ? '2024 · APR' : defaultDatepickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDatepickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component } from '@angular/core';",
    "import { TngDatepickerComponent } from '@tailng-ui/components';",
    ...adapterImports,
    '@Component({',
    '  imports: [TngDatepickerComponent],',
    `  templateUrl: './${componentClassName}.component.html',`,
    `  styleUrl: './${componentClassName}.component.css',`,
    '})',
    `export class ${toPascalCase(componentClassName)}Component {`,
    ...(includeAdapter ? ['  protected readonly reportingAdapter = reportingAdapter;'] : []),
    '}',
    '',
  ].join('\n');
}

function toPascalCase(value: string): string {
  return value
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join('');
}

function createHeadlessTsCode(name: string, configLines: readonly string[], includeAdapter = false): string {
  const adapterLines = includeAdapter
    ? [
        "import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        'const reportingAdapter: TngDateAdapter<Date> = {',
        '  ...defaultDatepickerDateAdapter,',
        "  format: (date, format, locale) => format === 'month-year' ? '2024 · APR' : defaultDatepickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDatepickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component } from '@angular/core';",
    "import { TngIcon } from '@tailng-ui/icons';",
    'import {',
    '  createDatepickerController,',
    '  TngDatepickerOverlay,',
    '  type TngDateCell,',
    '  type TngMonthOption,',
    '  type TngYearOption,',
    "} from '@tailng-ui/primitives';",
    ...adapterLines,
    '@Component({',
    '  imports: [TngIcon, TngDatepickerOverlay],',
    `  templateUrl: './${name}.component.html',`,
    `  styleUrl: './${name}.component.css',`,
    '})',
    `export class ${toPascalCase(name)}Component {`,
    '  protected readonly controller = createDatepickerController<Date>({',
    ...configLines.map((line) => `    ${line}`),
    '  });',
    '}',
    '',
  ].join('\n');
}

function createHeadlessHtmlCode(placeholder: string): string {
  return [
    '<div class="datepicker-demo" [attr.data-slot]="outputs().getHostAttributes()[\'data-slot\']">',
    '  <div class="datepicker-demo-field" data-slot="datepicker-field">',
    '    <div #anchorShell class="datepicker-demo-anchor">',
    '      <div class="datepicker-demo-shell" data-slot="datepicker-input-shell">',
    `        <input data-slot="datepicker-input" type="text" placeholder="${placeholder}" [value]="outputs().inputText" />`,
    '        <button #trigger type="button" [attr.data-slot]="outputs().getTriggerAttributes()[\'data-slot\']">',
    '          <tng-icon icon="calendar-days" />',
    '        </button>',
    '      </div>',
    '',
    '      <section',
    '        [tngDatepickerOverlay]="controller"',
    '        [tngDatepickerOverlayAnchor]="anchorShell"',
    '        [attr.data-slot]="outputs().getOverlayAttributes()[\'data-slot\']"',
    '      >',
    '        <!-- period header, weekday row, and day/month/year grids -->',
    '      </section>',
    '    </div>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-datepicker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngDatepickerComponent,
    TngDatepickerOverlay,
    TngIcon,
  ],
  templateUrl: './datepicker-examples-page.component.html',
  styleUrl: './datepicker-examples-page.component.css',
})
export class DatepickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly unsubscribers: Array<() => void> = [];

  private readonly defaultHeadlessRenderVersion = signal(0);
  private readonly customHeadlessRenderVersion = signal(0);
  private readonly boundedHeadlessRenderVersion = signal(0);

  private readonly defaultHeadlessTriggerRef = viewChild<ElementRef<HTMLElement>>('defaultHeadlessTrigger');
  private readonly customHeadlessTriggerRef = viewChild<ElementRef<HTMLElement>>('customHeadlessTrigger');
  private readonly boundedHeadlessTriggerRef = viewChild<ElementRef<HTMLElement>>('boundedHeadlessTrigger');

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly customFormatAdapter = customFormatAdapter;

  protected readonly defaultHeadlessController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
    minDate: '2024-04-01',
    maxDate: '2026-03-31',
  });

  protected readonly customHeadlessController = createDatepickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly boundedHeadlessController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-18',
    minDate: '2024-04-10',
    maxDate: '2024-04-25',
  });

  protected readonly defaultHeadlessOutputs = computed(() => {
    this.defaultHeadlessRenderVersion();
    return this.defaultHeadlessController.getOutputs();
  });

  protected readonly customHeadlessOutputs = computed(() => {
    this.customHeadlessRenderVersion();
    return this.customHeadlessController.getOutputs();
  });

  protected readonly boundedHeadlessOutputs = computed(() => {
    this.boundedHeadlessRenderVersion();
    return this.boundedHeadlessController.getOutputs();
  });

  protected readonly defaultHeadlessCodeTabs = createCodeTabs(
    'default-datepicker-headless',
    createHeadlessTsCode('default-datepicker-headless', [
      'ownerDocument: document,',
      "value: '2024-04-22',",
      "today: '2024-04-18',",
      "minDate: '2024-04-01',",
      "maxDate: '2026-03-31',",
      'closeOnSelect: true,',
      'trapFocus: true,',
    ]),
    createHeadlessHtmlCode('MM-DD-YYYY'),
    headlessSharedCssCode,
  );

  protected readonly defaultPlainCodeTabs = createCodeTabs(
    'default-datepicker-plain-css',
    createWrapperTsCode('default-datepicker-plain-css'),
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
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly defaultTailwindCodeTabs = createCodeTabs(
    'default-datepicker-tailwind',
    createWrapperTsCode('default-datepicker-tailwind'),
    [
      '<div class="w-full max-w-[18.5rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-datepicker',
      '    class="block w-full"',
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
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly customHeadlessCodeTabs = createCodeTabs(
    'custom-format-datepicker-headless',
    createHeadlessTsCode(
      'custom-format-datepicker-headless',
      [
        'adapter: reportingAdapter,',
        'ownerDocument: document,',
        "value: '2024-04-22',",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
      ],
      true,
    ),
    createHeadlessHtmlCode('DD.MM.YYYY'),
    headlessSharedCssCode,
  );

  protected readonly customPlainCodeTabs = createCodeTabs(
    'custom-format-datepicker-plain-css',
    createWrapperTsCode('custom-format-datepicker-plain-css', true),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [adapter]="reportingAdapter"',
      '  [defaultValue]="\'2024-04-22\'"',
      '  [today]="\'2024-04-18\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Reporting date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly customTailwindCodeTabs = createCodeTabs(
    'custom-format-datepicker-tailwind',
    createWrapperTsCode('custom-format-datepicker-tailwind', true),
    [
      '<div class="w-full max-w-[18.5rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-datepicker',
      '    class="block w-full"',
      '    [defaultOpen]="false"',
      '    [adapter]="reportingAdapter"',
      '    [defaultValue]="\'2024-04-22\'"',
      '    [today]="\'2024-04-18\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Reporting date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly boundedHeadlessCodeTabs = createCodeTabs(
    'bounded-datepicker-headless',
    createHeadlessTsCode('bounded-datepicker-headless', [
      'ownerDocument: document,',
      "value: '2024-04-18',",
      "today: '2024-04-18',",
      "minDate: '2024-04-10',",
      "maxDate: '2024-04-25',",
      'closeOnSelect: true,',
      'trapFocus: true,',
    ]),
    createHeadlessHtmlCode('MM-DD-YYYY'),
    headlessSharedCssCode,
  );

  protected readonly boundedPlainCodeTabs = createCodeTabs(
    'bounded-datepicker-plain-css',
    createWrapperTsCode('bounded-datepicker-plain-css'),
    [
      '<tng-datepicker',
      '  [defaultOpen]="false"',
      '  [defaultValue]="\'2024-04-18\'"',
      '  [today]="\'2024-04-18\'"',
      '  [minDate]="\'2024-04-10\'"',
      '  [maxDate]="\'2024-04-25\'"',
      '  [fullWidth]="false"',
      '  ariaLabel="Bounded shipping date"',
      '></tng-datepicker>',
      '',
    ].join('\n'),
    '.datepicker-example { inline-size: 18.5rem; }\n',
  );

  protected readonly boundedTailwindCodeTabs = createCodeTabs(
    'bounded-datepicker-tailwind',
    createWrapperTsCode('bounded-datepicker-tailwind'),
    [
      '<div class="w-full max-w-[18.5rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">',
      '  <tng-datepicker',
      '    class="block w-full"',
      '    [defaultOpen]="false"',
      '    [defaultValue]="\'2024-04-18\'"',
      '    [today]="\'2024-04-18\'"',
      '    [minDate]="\'2024-04-10\'"',
      '    [maxDate]="\'2024-04-25\'"',
      '    [fullWidth]="false"',
      '    ariaLabel="Bounded shipping date"',
      '  ></tng-datepicker>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public constructor() {
    this.subscribeToController(this.defaultHeadlessController, this.defaultHeadlessRenderVersion);
    this.subscribeToController(this.customHeadlessController, this.customHeadlessRenderVersion);
    this.subscribeToController(this.boundedHeadlessController, this.boundedHeadlessRenderVersion);

    effect(() => {
      this.defaultHeadlessController.registerTrigger(
        this.defaultHeadlessTriggerRef()?.nativeElement ?? null,
      );
    });

    effect(() => {
      this.customHeadlessController.registerTrigger(
        this.customHeadlessTriggerRef()?.nativeElement ?? null,
      );
    });

    effect(() => {
      this.boundedHeadlessController.registerTrigger(
        this.boundedHeadlessTriggerRef()?.nativeElement ?? null,
      );
    });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }

    this.defaultHeadlessController.destroy();
    this.customHeadlessController.destroy();
    this.boundedHeadlessController.destroy();
  }

  protected onHeadlessInputBlur(controller: TngDatepickerController<Date>): void {
    controller.commitInputText();
  }

  protected onHeadlessInputChange(
    controller: TngDatepickerController<Date>,
    event: Event,
  ): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    controller.setInputText(target.value);
  }

  protected onHeadlessInputClick(controller: TngDatepickerController<Date>): void {
    if (controller.getOutputs().open) {
      return;
    }

    controller.open();
    this.queueOverlayFocusSyncFor(controller);
  }

  protected onHeadlessInputKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (!controller.getOutputs().open) {
      controller.open();
      this.queueOverlayFocusSyncFor(controller);
      return;
    }

    controller.commitInputText();
  }

  protected onHeadlessTriggerClick(controller: TngDatepickerController<Date>): void {
    const wasOpen = controller.getOutputs().open;
    controller.toggleOpen();
    if (!wasOpen && controller.getOutputs().open) {
      this.queueOverlayFocusSyncFor(controller);
    }
  }

  protected onHeadlessTriggerKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    const wasOpen = controller.getOutputs().open;
    controller.handleTriggerKeyDown(event);
    if (!wasOpen && controller.getOutputs().open) {
      this.queueOverlayFocusSyncFor(controller);
    }
  }

  protected onHeadlessOverlayKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleOverlayKeyDown(event);
  }

  protected onHeadlessGridKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSyncFor(controller);
    }
  }

  protected onHeadlessMonthKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      controller.showDaysPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSyncFor(controller);
    }
  }

  protected onHeadlessYearKeydown(
    controller: TngDatepickerController<Date>,
    event: KeyboardEvent,
  ): void {
    controller.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      controller.showMonthsPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSyncFor(controller);
    }
  }

  protected onHeadlessDayCellClick(
    controller: TngDatepickerController<Date>,
    cell: Readonly<TngDateCell<Date>>,
  ): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    controller.handleCellClick(cell.date);
  }

  protected onHeadlessMonthOptionClick(
    controller: TngDatepickerController<Date>,
    option: Readonly<TngMonthOption<Date>>,
  ): void {
    if (option.disabled) {
      return;
    }

    controller.selectMonth(option.index);
    controller.showDaysPanel();
    this.queueOverlayFocusSyncFor(controller);
  }

  protected onHeadlessYearOptionClick(
    controller: TngDatepickerController<Date>,
    option: Readonly<TngYearOption<Date>>,
  ): void {
    if (option.disabled) {
      return;
    }

    controller.selectYear(option.year);
    controller.showMonthsPanel();
    this.queueOverlayFocusSyncFor(controller);
  }

  protected onHeadlessPeriodClick(controller: TngDatepickerController<Date>): void {
    if (controller.getOutputs().view === 'year') {
      return;
    }

    controller.showYearsPanel();
    this.queueOverlayFocusSyncFor(controller);
  }

  protected pageBackwardFor(controller: TngDatepickerController<Date>): void {
    if (controller.getOutputs().view === 'day') {
      controller.prevMonth();
    } else {
      controller.prevYear();
    }

    this.queueOverlayFocusSyncFor(controller);
  }

  protected pageForwardFor(controller: TngDatepickerController<Date>): void {
    if (controller.getOutputs().view === 'day') {
      controller.nextMonth();
    } else {
      controller.nextYear();
    }

    this.queueOverlayFocusSyncFor(controller);
  }

  protected resolvePeriodLabel(controller: TngDatepickerController<Date>): string {
    const outputs = controller.getOutputs();
    if (outputs.view === 'year') {
      const startYear = outputs.yearOptions[0]?.year;
      const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
      if (startYear !== undefined && endYear !== undefined) {
        return `${startYear} - ${endYear}`;
      }
    }

    if (outputs.view === 'month') {
      return controller.formatDate(outputs.visibleMonth, 'year-label');
    }

    return outputs.labelMonthYear;
  }

  private subscribeToController(
    controller: TngDatepickerController<Date>,
    renderVersion: WritableSignal<number>,
  ): void {
    this.unsubscribers.push(
      controller.subscribe((event) => {
        renderVersion.update((value) => value + 1);
        if (event.type === 'opened') {
          this.queueOverlayFocusSyncFor(controller);
        }
      }),
    );
  }

  private queueOverlayFocusSyncFor(controller: TngDatepickerController<Date>): void {
    queueMicrotask(() => {
      const focusTarget = (): void => {
        const outputs = controller.getOutputs();
        if (!outputs.open || this.documentRef === null) {
          return;
        }

        const targetId = this.resolveCurrentFocusTargetId(outputs);
        if (targetId === null) {
          return;
        }

        const target = this.documentRef.getElementById(targetId);
        if (!(target instanceof HTMLElement)) {
          return;
        }

        target.focus();
      };

      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => focusTarget());
        return;
      }

      setTimeout(() => focusTarget(), 0);
    });
  }

  private resolveCurrentFocusTargetId(outputs: TngDatepickerOutputs<Date>): string | null {
    if (outputs.view === 'day') {
      const gridAttributes = outputs.getGridAttributes();
      if (gridAttributes['aria-activedescendant'] !== undefined) {
        return gridAttributes['id'] ?? null;
      }

      return outputs.cells.find((cell) => cell.active)?.id ?? null;
    }

    if (outputs.view === 'month') {
      return outputs.monthOptions.find((option) => option.active)?.id ?? null;
    }

    if (outputs.view === 'year') {
      return outputs.yearOptions.find((option) => option.active)?.id ?? null;
    }

    return null;
  }

  private shouldSyncOverlayFocusAfterPickerKey(key: string): boolean {
    return (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Home' ||
      key === 'End' ||
      key === 'PageUp' ||
      key === 'PageDown' ||
      key === 'Enter' ||
      key === ' ' ||
      key === 'Escape'
    );
  }

  private isPickerActivationKey(key: string): boolean {
    return key === 'Enter' || key === ' ';
  }

}
