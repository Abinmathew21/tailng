import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import {
  bindTngDatepicker,
  createDatepickerController,
  defaultDatepickerDateAdapter,
  TngDatepickerDayCell,
  TngDatepickerDayGrid,
  TngDatepickerHost,
  TngDatepickerInput,
  TngDatepickerMonthGrid,
  TngDatepickerMonthOption,
  TngDatepickerNextButton,
  TngDatepickerOverlay,
  TngDatepickerPeriodButton,
  TngDatepickerPrevButton,
  TngDatepickerTrigger,
  TngDatepickerYearGrid,
  TngDatepickerYearOption,
  type TngDateAdapter,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../datepicker.util';

const headlessSharedCssCode = [
  '.datepicker-demo,',
  '.datepicker-headless-demo {',
  '  display: block;',
  '  width: min(100%, 18.5rem);',
  '  max-width: 18.5rem;',
  '  color-scheme: light;',
  '  --tng-datepicker-radius: 1.08rem;',
  '  --tng-datepicker-field-height: 3.15rem;',
  '  --tng-datepicker-overlay-gap: 0.66rem;',
  '  --tng-datepicker-day-cell-size: 2.28rem;',
  '  --tng-datepicker-picker-cell-size: 2.38rem;',
  '  --tng-datepicker-grid-gap: 0.28rem;',
  '  --tng-datepicker-inline-gap: 0.36rem;',
  '  --tng-datepicker-overlay-padding: 0.88rem;',
  '  --tng-datepicker-shadow:',
  '    0 22px 38px rgba(15, 23, 42, 0.12),',
  '    0 10px 20px rgba(15, 23, 42, 0.08);',
  '}',
  '.datepicker-demo-anchor,',
  '.datepicker-headless-anchor {',
  '  position: relative;',
  '}',
  '.datepicker-demo-field,',
  '.datepicker-headless-field {',
  '  display: grid;',
  '  gap: 0.25rem;',
  '}',
  '.datepicker-demo-shell,',
  '.datepicker-headless-shell {',
  '  display: flex;',
  '  align-items: center;',
  '  gap: 0.5rem;',
  '  min-inline-size: 0;',
  '  min-height: var(--tng-datepicker-field-height);',
  '  padding-inline: 0.82rem;',
  '  border: 1px solid var(--tng-datepicker-border);',
  '  border-radius: var(--tng-datepicker-radius);',
  '  background: var(--tng-datepicker-bg);',
  '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);',
  '}',
  '.datepicker-demo [data-slot="datepicker-input"],',
  '.datepicker-headless-demo [data-slot="datepicker-input"] {',
  '  flex: 1 1 auto;',
  '  min-inline-size: 0;',
  '  background: transparent;',
  '  color: var(--tng-datepicker-fg);',
  '  caret-color: var(--tng-datepicker-brand);',
  '  font-size: 0.98rem;',
  '  font-weight: 600;',
  '}',
  '.datepicker-demo [data-slot="datepicker-input"]::placeholder,',
  '.datepicker-headless-demo [data-slot="datepicker-input"]::placeholder {',
  '  color: color-mix(in srgb, var(--tng-datepicker-muted) 90%, white 10%);',
  '  opacity: 1;',
  '}',
  '.datepicker-demo [data-slot="datepicker-trigger"],',
  '.datepicker-headless-demo [data-slot="datepicker-trigger"] {',
  '  color: var(--tng-datepicker-muted);',
  '}',
  '.datepicker-demo [data-slot="datepicker-trigger"]:hover,',
  '.datepicker-headless-demo [data-slot="datepicker-trigger"]:hover {',
  '  color: var(--tng-datepicker-fg);',
  '}',
  '.datepicker-demo [data-slot="datepicker-overlay"],',
  '.datepicker-headless-demo [data-slot="datepicker-overlay"] {',
  '  inline-size: min(20rem, calc(100vw - 2rem));',
  '  border: 1px solid var(--tng-datepicker-border);',
  '  border-radius: calc(var(--tng-datepicker-radius) + 0.18rem);',
  '  background: var(--tng-datepicker-canvas);',
  '  color: var(--tng-datepicker-fg);',
  '  box-shadow: var(--tng-datepicker-shadow);',
  '}',
  '.datepicker-demo [data-slot="datepicker-header"],',
  '.datepicker-headless-demo [data-slot="datepicker-header"] {',
  '  color: var(--tng-datepicker-fg);',
  '}',
  '.datepicker-demo-header-row,',
  '.datepicker-headless-header-row {',
  '  display: grid;',
  '  grid-template-columns: 1.9rem minmax(0, 1fr) 1.9rem;',
  '  gap: 0.4rem;',
  '  align-items: center;',
  '}',
  '.datepicker-demo [data-slot="datepicker-nav-button"],',
  '.datepicker-demo [data-slot="datepicker-period-button"],',
  '.datepicker-headless-demo [data-slot="datepicker-nav-button"],',
  '.datepicker-headless-demo [data-slot="datepicker-period-button"] {',
  '  min-height: 2rem;',
  '  border: 1px solid var(--tng-datepicker-border);',
  '  background: var(--tng-datepicker-surface);',
  '  color: var(--tng-datepicker-fg);',
  '}',
  '.datepicker-demo [data-slot="datepicker-weekday"],',
  '.datepicker-headless-demo [data-slot="datepicker-weekday"] {',
  '  color: color-mix(in srgb, var(--tng-datepicker-muted) 92%, white 8%);',
  '  font-size: 0.68rem;',
  '}',
  '.datepicker-demo-weekdays,',
  '.datepicker-demo-day-grid,',
  '.datepicker-headless-weekdays,',
  '.datepicker-headless-day-grid {',
  '  display: grid;',
  '  grid-template-columns: repeat(7, minmax(0, 1fr));',
  '  gap: var(--tng-datepicker-grid-gap);',
  '}',
  '.datepicker-demo-picker-grid,',
  '.datepicker-headless-picker-grid {',
  '  display: grid;',
  '  grid-template-columns: repeat(4, minmax(0, 1fr));',
  '  gap: var(--tng-datepicker-grid-gap);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"],',
  '.datepicker-demo [data-slot="datepicker-month"],',
  '.datepicker-demo [data-slot="datepicker-year"],',
  '.datepicker-headless-demo [data-slot="datepicker-cell"],',
  '.datepicker-headless-demo [data-slot="datepicker-month"],',
  '.datepicker-headless-demo [data-slot="datepicker-year"] {',
  '  border: 1px solid transparent;',
  '  background: var(--tng-datepicker-surface);',
  '  color: var(--tng-datepicker-fg);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"][data-active],',
  '.datepicker-demo [data-slot="datepicker-month"][data-active],',
  '.datepicker-demo [data-slot="datepicker-year"][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-cell"][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-month"][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-year"][data-active] {',
  '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 34%, var(--tng-datepicker-border) 66%);',
  '  background: color-mix(in srgb, var(--tng-datepicker-brand) 9%, var(--tng-datepicker-surface) 91%);',
  '  box-shadow: 0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 14%, transparent);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"][data-selected],',
  '.datepicker-demo [data-slot="datepicker-month"][data-selected],',
  '.datepicker-demo [data-slot="datepicker-year"][data-selected],',
  '.datepicker-headless-demo [data-slot="datepicker-cell"][data-selected],',
  '.datepicker-headless-demo [data-slot="datepicker-month"][data-selected],',
  '.datepicker-headless-demo [data-slot="datepicker-year"][data-selected] {',
  '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 46%, var(--tng-datepicker-border) 54%);',
  '  background: color-mix(in srgb, var(--tng-datepicker-brand) 18%, var(--tng-datepicker-canvas) 82%);',
  '  color: color-mix(in srgb, var(--tng-datepicker-brand) 74%, #0f172a 26%);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"][data-selected][data-active],',
  '.datepicker-demo [data-slot="datepicker-month"][data-selected][data-active],',
  '.datepicker-demo [data-slot="datepicker-year"][data-selected][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-cell"][data-selected][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-month"][data-selected][data-active],',
  '.datepicker-headless-demo [data-slot="datepicker-year"][data-selected][data-active] {',
  '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 62%, var(--tng-datepicker-border) 38%);',
  '  background: color-mix(in srgb, var(--tng-datepicker-brand) 24%, var(--tng-datepicker-canvas) 76%);',
  '  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 16%, transparent);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"][aria-current="date"]:not([data-selected]),',
  '.datepicker-headless-demo [data-slot="datepicker-cell"][aria-current="date"]:not([data-selected]) {',
  '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 28%, var(--tng-datepicker-border) 72%);',
  '  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 12%, transparent);',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"]:not([data-in-month]),',
  '.datepicker-headless-demo [data-slot="datepicker-cell"]:not([data-in-month]) {',
  '  color: color-mix(in srgb, var(--tng-datepicker-muted) 84%, white 16%);',
  '  opacity: 0.58;',
  '}',
  '.datepicker-demo [data-slot="datepicker-cell"][data-disabled],',
  '.datepicker-demo [data-slot="datepicker-month"][data-disabled],',
  '.datepicker-demo [data-slot="datepicker-year"][data-disabled],',
  '.datepicker-headless-demo [data-slot="datepicker-cell"][data-disabled],',
  '.datepicker-headless-demo [data-slot="datepicker-month"][data-disabled],',
  '.datepicker-headless-demo [data-slot="datepicker-year"][data-disabled] {',
  '  opacity: 0.46;',
  '  box-shadow: none;',
  '}',
  '',
].join('\n');

function createThemeCss(
  selector: string,
  options: {
    bg: string;
    border: string;
    borderStrong: string;
    brand: string;
    canvas: string;
    focus: string;
    focusShadow: string;
    fg: string;
    muted: string;
    shadow?: string;
    surface: string;
  },
): string {
  return [
    `${selector} {`,
    '  color-scheme: light;',
    `  --tng-datepicker-bg: ${options.bg};`,
    `  --tng-datepicker-border: ${options.border};`,
    `  --tng-datepicker-border-strong: ${options.borderStrong};`,
    `  --tng-datepicker-brand: ${options.brand};`,
    `  --tng-datepicker-canvas: ${options.canvas};`,
    `  --tng-datepicker-focus: ${options.focus};`,
    `  --tng-datepicker-focus-shadow: ${options.focusShadow};`,
    `  --tng-datepicker-fg: ${options.fg};`,
    `  --tng-datepicker-muted: ${options.muted};`,
    `  --tng-datepicker-surface: ${options.surface};`,
    `  --tng-datepicker-shadow: ${options.shadow ?? '0 22px 38px rgba(15, 23, 42, 0.12), 0 10px 20px rgba(15, 23, 42, 0.08)'};`,
    '}',
    '',
  ].join('\n');
}

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
      const month = defaultDatepickerDateAdapter
        .format(date, 'month-short', locale)
        .toUpperCase();
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
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
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

function toPascalCase(value: string): string {
  return value
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join('');
}

function createHeadlessTsCode(
  name: string,
  configLines: readonly string[],
  includeAdapter = false,
): string {
  const adapterLines = includeAdapter
    ? [
        "import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        'const reportingAdapter: TngDateAdapter<Date> = {',
        '  ...defaultDatepickerDateAdapter,',
        "  format: (date, format, locale) => format === 'input' ? '22.04.2024' : defaultDatepickerDateAdapter.format(date, format, locale),",
        '  parse: (text, locale) => defaultDatepickerDateAdapter.parse(text, locale),',
        '};',
        '',
      ]
    : [];

  return [
    "import { Component, type OnDestroy } from '@angular/core';",
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
    ...adapterLines,
    '@Component({',
    '  standalone: true,',
    '  imports: [',
    '    TngIcon,',
    '    TngDatepickerHost,',
    '    TngDatepickerInput,',
    '    TngDatepickerTrigger,',
    '    TngDatepickerOverlay,',
    '    TngDatepickerPrevButton,',
    '    TngDatepickerPeriodButton,',
    '    TngDatepickerNextButton,',
    '    TngDatepickerDayGrid,',
    '    TngDatepickerDayCell,',
    '    TngDatepickerMonthGrid,',
    '    TngDatepickerMonthOption,',
    '    TngDatepickerYearGrid,',
    '    TngDatepickerYearOption,',
    '  ],',
    `  templateUrl: './${name}.component.html',`,
    `  styleUrl: './${name}.component.css',`,
    '})',
    `export class ${toPascalCase(name)}Component implements OnDestroy {`,
    '  protected readonly controller = createDatepickerController<Date>({',
    ...configLines.map((line) => `    ${line}`),
    '  });',
    '',
    '  protected readonly datepicker = bindTngDatepicker(this.controller);',
    '',
    '  public ngOnDestroy(): void {',
    '    this.controller.destroy();',
    '  }',
    '}',
    '',
  ].join('\n');
}

function createHeadlessHtmlCode(options: {
  containerClose: string;
  containerOpen: string;
  copyLine: string;
  demoClassName: string;
  inputAriaLabel: string;
  kickerLine: string;
  placeholder: string;
  triggerLabel: string;
}): string {
  return [
    options.containerOpen,
    `  ${options.kickerLine}`,
    `  ${options.copyLine}`,
    `  <section class="datepicker-demo ${options.demoClassName}" [tngDatepickerHost]="controller">`,
    '    <div class="datepicker-demo-field" data-slot="datepicker-field">',
    '      <div #anchorShell class="datepicker-demo-anchor">',
    '        <div',
    '          class="datepicker-demo-shell"',
    '          data-slot="datepicker-input-shell"',
    "          [attr.data-invalid]=\"datepicker.outputs().validationError !== null ? 'true' : null\"",
    "          [attr.data-open]=\"datepicker.outputs().getTriggerAttributes()['data-open']\"",
    '        >',
    '          <input',
    '            [tngDatepickerInput]="controller"',
    '            type="text"',
    '            inputmode="numeric"',
    `            placeholder="${options.placeholder}"`,
    `            aria-label="${options.inputAriaLabel}"`,
    '          />',
    '',
    '          <button',
    '            [tngDatepickerTrigger]="controller"',
    '            type="button"',
    `            aria-label="${options.triggerLabel}"`,
    '          >',
    '            <tng-icon icon="calendar-days" />',
    '            <span aria-hidden="true">▾</span>',
    '          </button>',
    '        </div>',
    '',
    '        <section',
    '          [tngDatepickerOverlay]="controller"',
    '          [tngDatepickerOverlayAnchor]="anchorShell"',
    '        >',
    '          <header data-slot="datepicker-header">',
    '            <div class="datepicker-demo-header-row">',
    '              <button [tngDatepickerPrevButton]="controller" type="button">‹</button>',
    '              <button [tngDatepickerPeriodButton]="controller" type="button">',
    '                {{ datepicker.periodLabel() }}',
    "                @if (datepicker.outputs().view !== 'year') {",
    '                  <span aria-hidden="true">▾</span>',
    '                }',
    '              </button>',
    '              <button [tngDatepickerNextButton]="controller" type="button">›</button>',
    '            </div>',
    '          </header>',
    '',
    "          @if (datepicker.outputs().view === 'day') {",
    '            <div class="datepicker-demo-weekdays" data-slot="datepicker-weekdays" aria-hidden="true">',
    '              @for (label of datepicker.outputs().weekdayLabels; track label) {',
    '                <span data-slot="datepicker-weekday">{{ label }}</span>',
    '              }',
    '            </div>',
    '',
    '            <div class="datepicker-demo-day-grid" [tngDatepickerDayGrid]="controller">',
    '              @for (cell of datepicker.outputs().cells; track cell.id) {',
    '                <button [tngDatepickerDayCell]="cell" type="button">',
    '                  {{ cell.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    "          @if (datepicker.outputs().view === 'month') {",
    '            <div class="datepicker-demo-picker-grid" [tngDatepickerMonthGrid]="controller">',
    '              @for (option of datepicker.outputs().monthOptions; track option.id) {',
    '                <button [tngDatepickerMonthOption]="option" type="button">',
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    "          @if (datepicker.outputs().view === 'year') {",
    '            <div class="datepicker-demo-picker-grid" [tngDatepickerYearGrid]="controller">',
    '              @for (option of datepicker.outputs().yearOptions; track option.id) {',
    '                <button [tngDatepickerYearOption]="option" type="button">',
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '        </section>',
    '      </div>',
    '    </div>',
    '  </section>',
    options.containerClose,
    '',
  ].join('\n');
}

function createPlainCssCode(
  classes: {
    card: string;
    copy: string;
    kicker: string;
  },
  themeCss: string,
): string {
  return [
    headlessSharedCssCode,
    themeCss,
    `.${classes.card} {`,
    '  display: grid;',
    '  gap: 0.8rem;',
    '  width: min(100%, 22rem);',
    '  margin-inline: auto;',
    '  padding: 1rem;',
    '  border: 1px solid #cbd5e1;',
    '  border-radius: 1.25rem;',
    '  background: #ffffff;',
    '  color: #0f172a;',
    '  color-scheme: light;',
    '  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);',
    '}',
    `.${classes.kicker} {`,
    '  color: #64748b;',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  letter-spacing: 0.02em;',
    '}',
    `.${classes.copy} {`,
    '  margin: 0;',
    '  color: #475569;',
    '  line-height: 1.6;',
    '}',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-headless-datepicker-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngDatepickerHost,
    TngDatepickerInput,
    TngDatepickerTrigger,
    TngDatepickerOverlay,
    TngDatepickerPrevButton,
    TngDatepickerPeriodButton,
    TngDatepickerNextButton,
    TngDatepickerDayGrid,
    TngDatepickerDayCell,
    TngDatepickerMonthGrid,
    TngDatepickerMonthOption,
    TngDatepickerYearGrid,
    TngDatepickerYearOption,
    TngIcon,
  ],
  templateUrl: './datepicker-examples-page.component.html',
  styleUrl: './datepicker-examples-page.component.css',
})
export class HeadlessDatepickerExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly bookingController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-05-18',
    trapFocus: true,
    value: '2024-05-18',
    minDate: '2024-05-10',
    maxDate: '2024-05-25',
  });

  protected readonly reportingController = createDatepickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly booking = bindTngDatepicker(this.bookingController);
  protected readonly reporting = bindTngDatepicker(this.reportingController);

  protected readonly bookingPlainCodeTabs = createCodeTabs(
    'headless-booking-window-plain',
    createHeadlessTsCode('headless-booking-window-plain', [
      'ownerDocument: document,',
      "value: '2024-05-18',",
      "today: '2024-05-18',",
      "minDate: '2024-05-10',",
      "maxDate: '2024-05-25',",
      'closeOnSelect: true,',
      'trapFocus: true,',
      'showOutsideDays: true,',
    ]),
    createHeadlessHtmlCode({
      containerOpen: '<section class="docs-headless-datepicker-examples-booking-plain-card">',
      kickerLine:
        '<span class="docs-headless-datepicker-examples-booking-plain-kicker">Booking window</span>',
      copyLine:
        '<p class="docs-headless-datepicker-examples-booking-plain-copy">Constrain the selectable booking window without giving up manual input.</p>',
      demoClassName: 'datepicker-demo--booking',
      placeholder: 'MM-DD-YYYY',
      inputAriaLabel: 'Booking start date',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      {
        card: 'docs-headless-datepicker-examples-booking-plain-card',
        kicker: 'docs-headless-datepicker-examples-booking-plain-kicker',
        copy: 'docs-headless-datepicker-examples-booking-plain-copy',
      },
      createThemeCss('.datepicker-demo--booking', {
        bg: '#ffffff',
        border: '#cbd5e1',
        borderStrong: '#94a3b8',
        brand: '#2563eb',
        canvas: '#ffffff',
        focus: '#2563eb',
        focusShadow: '0 0 0 3px rgba(37, 99, 235, 0.16)',
        fg: '#0f172a',
        muted: '#64748b',
        surface: '#eff6ff',
      }),
    ),
  );

  protected readonly bookingTailwindCodeTabs = createCodeTabs(
    'headless-booking-window-tailwind',
    createHeadlessTsCode('headless-booking-window-tailwind', [
      'ownerDocument: document,',
      "value: '2024-05-18',",
      "today: '2024-05-18',",
      "minDate: '2024-05-10',",
      "maxDate: '2024-05-25',",
      'closeOnSelect: true,',
      'trapFocus: true,',
      'showOutsideDays: true,',
    ]),
    createHeadlessHtmlCode({
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] [color-scheme:light]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Booking window</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600">Constrain the selectable booking window without giving up manual input.</p>',
      demoClassName: 'datepicker-demo--booking',
      placeholder: 'MM-DD-YYYY',
      inputAriaLabel: 'Booking start date',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    [
      headlessSharedCssCode,
      createThemeCss('.datepicker-demo--booking', {
        bg: '#ffffff',
        border: '#cbd5e1',
        borderStrong: '#94a3b8',
        brand: '#2563eb',
        canvas: '#ffffff',
        focus: '#2563eb',
        focusShadow: '0 0 0 3px rgba(37, 99, 235, 0.16)',
        fg: '#0f172a',
        muted: '#64748b',
        surface: '#eff6ff',
      }),
      '/* Tailwind utilities are applied in the template wrapper. */',
      '',
    ].join('\n'),
  );

  protected readonly reportingPlainCodeTabs = createCodeTabs(
    'headless-reporting-calendar-plain',
    createHeadlessTsCode(
      'headless-reporting-calendar-plain',
      [
        'adapter: reportingAdapter,',
        'ownerDocument: document,',
        "value: '2024-04-22',",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
        'showOutsideDays: true,',
      ],
      true,
    ),
    createHeadlessHtmlCode({
      containerOpen: '<section class="docs-headless-datepicker-examples-reporting-plain-card">',
      kickerLine:
        '<span class="docs-headless-datepicker-examples-reporting-plain-kicker">Reporting calendar</span>',
      copyLine:
        '<p class="docs-headless-datepicker-examples-reporting-plain-copy">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      demoClassName: 'datepicker-demo--reporting',
      placeholder: 'DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      {
        card: 'docs-headless-datepicker-examples-reporting-plain-card',
        kicker: 'docs-headless-datepicker-examples-reporting-plain-kicker',
        copy: 'docs-headless-datepicker-examples-reporting-plain-copy',
      },
      createThemeCss('.datepicker-demo--reporting', {
        bg: '#ffffff',
        border: '#c7d2e3',
        borderStrong: '#94a3b8',
        brand: '#0f766e',
        canvas: '#ffffff',
        focus: '#0f766e',
        focusShadow: '0 0 0 3px rgba(15, 118, 110, 0.16)',
        fg: '#0f172a',
        muted: '#5f6f88',
        surface: '#ecfeff',
      }),
    ),
  );

  protected readonly reportingTailwindCodeTabs = createCodeTabs(
    'headless-reporting-calendar-tailwind',
    createHeadlessTsCode(
      'headless-reporting-calendar-tailwind',
      [
        'adapter: reportingAdapter,',
        'ownerDocument: document,',
        "value: '2024-04-22',",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
        'showOutsideDays: true,',
      ],
      true,
    ),
    createHeadlessHtmlCode({
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] [color-scheme:light]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Reporting calendar</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      demoClassName: 'datepicker-demo--reporting',
      placeholder: 'DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    [
      headlessSharedCssCode,
      createThemeCss('.datepicker-demo--reporting', {
        bg: '#ffffff',
        border: '#c7d2e3',
        borderStrong: '#94a3b8',
        brand: '#0f766e',
        canvas: '#ffffff',
        focus: '#0f766e',
        focusShadow: '0 0 0 3px rgba(15, 118, 110, 0.16)',
        fg: '#0f172a',
        muted: '#5f6f88',
        surface: '#ecfeff',
      }),
      '/* Tailwind utilities are applied in the template wrapper. */',
      '',
    ].join('\n'),
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
    this.bookingController.destroy();
    this.reportingController.destroy();
  }
}
