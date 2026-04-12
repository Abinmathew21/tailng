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

type ExampleBindingNames = {
  adapter: string;
  anchorRef: string;
  controller: string;
  datepicker: string;
};

type ExampleClassNames = {
  anchor: string;
  cell: string;
  dayGrid: string;
  demo: string;
  field: string;
  header: string;
  headerRow: string;
  input: string;
  nav: string;
  overlay: string;
  period: string;
  periodChevron: string;
  periodTitle: string;
  pickerCell: string;
  pickerGrid: string;
  shell: string;
  trigger: string;
  triggerChevron: string;
  triggerIcon: string;
  weekdays: string;
};

function createSnippetKey(name: string): string {
  return name.replace(/^headless-/, '');
}

function createExampleBindingNames(name: string): ExampleBindingNames {
  const base = toCamelCase(createSnippetKey(name));
  return {
    adapter: `${base}Adapter`,
    anchorRef: `${base}AnchorShell`,
    controller: `${base}Controller`,
    datepicker: `${base}Datepicker`,
  };
}

function createExampleClassNames(name: string): ExampleClassNames {
  const base = `${createSnippetKey(name)}-datepicker`;
  return {
    anchor: `${base}-anchor`,
    cell: `${base}-cell`,
    dayGrid: `${base}-day-grid`,
    demo: `${base}-demo`,
    field: `${base}-field`,
    header: `${base}-header`,
    headerRow: `${base}-header-row`,
    input: `${base}-input`,
    nav: `${base}-nav`,
    overlay: `${base}-overlay`,
    period: `${base}-period`,
    periodChevron: `${base}-period-chevron`,
    periodTitle: `${base}-period-title`,
    pickerCell: `${base}-picker-cell`,
    pickerGrid: `${base}-picker-grid`,
    shell: `${base}-shell`,
    trigger: `${base}-trigger`,
    triggerChevron: `${base}-trigger-chevron`,
    triggerIcon: `${base}-trigger-icon`,
    weekdays: `${base}-weekdays`,
  };
}

function createScopedSharedCssCode(classes: ExampleClassNames): string {
  return [
    `.${classes.demo} {`,
    '  display: block;',
    '  inline-size: 18.5rem;',
    '  max-inline-size: 100%;',
    '  color-scheme: light;',
    '  --tng-datepicker-radius: 1.1rem;',
    '  --tng-datepicker-field-height: 2.95rem;',
    '  --tng-datepicker-overlay-gap: 0.56rem;',
    '  --tng-datepicker-day-cell-size: 2.2rem;',
    '  --tng-datepicker-picker-cell-size: 2.3rem;',
    '  --tng-datepicker-grid-gap: clamp(0.14rem, 1.15%, 0.28rem);',
    '  --tng-datepicker-inline-gap: 0.36rem;',
    '  --tng-datepicker-overlay-padding: 0.72rem;',
    '  --tng-datepicker-nav-size: 1.95rem;',
    '  --tng-datepicker-shadow:',
    '    0 22px 40px rgba(15, 23, 42, 0.14),',
    '    0 10px 18px rgba(15, 23, 42, 0.08);',
    '}',
    `.${classes.anchor} {`,
    '  position: relative;',
    '}',
    `.${classes.field} {`,
    '  display: grid;',
    '  gap: 0.2rem;',
    '}',
    `.${classes.shell} {`,
    '  display: flex;',
    '  align-items: stretch;',
    '  min-inline-size: 0;',
    '  inline-size: 100%;',
    '  min-height: var(--tng-datepicker-field-height);',
    '  overflow: hidden;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-datepicker-border) 84%, var(--tng-datepicker-canvas) 16%);',
    '  border-radius: var(--tng-datepicker-radius);',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-datepicker-canvas) 58%, var(--tng-datepicker-surface) 42%),',
    '      color-mix(in srgb, var(--tng-datepicker-canvas) 74%, var(--tng-datepicker-surface) 26%)',
    '    );',
    '  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease;',
    '}',
    `.${classes.shell}[data-open="true"] {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 72%, var(--tng-datepicker-border) 28%);',
    '  box-shadow: var(--tng-datepicker-focus-shadow);',
    '}',
    `.${classes.shell}:focus-within {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 62%, var(--tng-datepicker-border) 38%);',
    '  box-shadow: var(--tng-datepicker-focus-shadow);',
    '}',
    `.${classes.shell}[data-invalid="true"] {`,
    '  border-color: color-mix(in srgb, #dc2626 70%, var(--tng-datepicker-border) 30%);',
    '  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14);',
    '}',
    `.${classes.demo} [data-slot="datepicker-input"] {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 0;',
    '  box-shadow: none;',
    '  flex: 1 1 auto;',
    '  min-height: 100%;',
    '  min-inline-size: 0;',
    '  background: transparent;',
    '  color: var(--tng-datepicker-fg);',
    '  caret-color: var(--tng-datepicker-brand);',
    '  font: inherit;',
    '  font-size: 0.98rem;',
    '  font-weight: 600;',
    '  line-height: 1.35;',
    '  letter-spacing: 0.01em;',
    '  outline: none;',
    '  padding: 0.72rem 0.96rem;',
    '}',
    `.${classes.demo} [data-slot="datepicker-input"]:focus,`,
    `.${classes.demo} [data-slot="datepicker-input"]:focus-visible {`,
    '  outline: none;',
    '  box-shadow: none;',
    '}',
    `.${classes.demo} [data-slot="datepicker-input"]::placeholder {`,
    '  color: color-mix(in srgb, var(--tng-datepicker-muted) 82%, transparent);',
    '  font-weight: 500;',
    '  opacity: 1;',
    '}',
    `.${classes.demo} [data-slot="datepicker-trigger"],`,
    `.${classes.nav},`,
    `.${classes.period},`,
    `.${classes.cell},`,
    `.${classes.pickerCell} {`,
    '  font: inherit;',
    '}',
    `.${classes.demo} [data-slot="datepicker-trigger"] {`,
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 0.28rem;',
    '  color: var(--tng-datepicker-fg);',
    '}',
    `.${classes.demo} [data-slot="datepicker-trigger"]:hover {`,
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 9%, var(--tng-datepicker-surface));',
    '}',
    `.${classes.trigger} {`,
    '  flex: 0 0 auto;',
    '  min-width: calc(var(--tng-datepicker-nav-size) + 1.02rem);',
    '  padding-inline: 0.78rem;',
    '  border: 0;',
    '  border-inline-start: 1px solid color-mix(in srgb, var(--tng-datepicker-border) 72%, var(--tng-datepicker-canvas) 28%);',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-datepicker-brand) 3%, var(--tng-datepicker-canvas) 97%),',
    '      color-mix(in srgb, var(--tng-datepicker-brand) 5%, var(--tng-datepicker-surface) 95%)',
    '    );',
    '  cursor: pointer;',
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  min-height: 100%;',
    '  gap: 0.34rem;',
    '  transition:',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '}',
    `.${classes.trigger}:focus,`,
    `.${classes.trigger}:focus-visible {`,
    '  outline: none;',
    '  box-shadow: none;',
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 9%, var(--tng-datepicker-surface));',
    '}',
    `.${classes.triggerIcon} {`,
    '  width: 1.05rem;',
    '  height: 1.05rem;',
    '  flex-shrink: 0;',
    '}',
    `.${classes.triggerChevron},`,
    `.${classes.periodChevron} {`,
    '  color: var(--tng-datepicker-muted);',
    '  font-size: 0.68rem;',
    '  line-height: 1;',
    '}',
    `.${classes.overlay} {`,
    '  inline-size: min(20rem, calc(100vw - 2rem));',
    '  display: grid;',
    '  gap: 0.68rem;',
    '  border: 1px solid color-mix(in srgb, var(--tng-datepicker-border) 86%, var(--tng-datepicker-canvas) 14%);',
    '  border-radius: calc(var(--tng-datepicker-radius) + 0.18rem);',
    '  background:',
    '    linear-gradient(',
    '      180deg,',
    '      color-mix(in srgb, var(--tng-datepicker-surface) 95%, var(--tng-datepicker-canvas) 5%),',
    '      color-mix(in srgb, var(--tng-datepicker-surface) 98%, var(--tng-datepicker-canvas) 2%)',
    '    );',
    '  color: var(--tng-datepicker-fg);',
    '  padding: var(--tng-datepicker-overlay-padding);',
    '  box-sizing: border-box;',
    '  box-shadow: var(--tng-datepicker-shadow);',
    '}',
    `.${classes.header} {`,
    '  color: var(--tng-datepicker-fg);',
    '  display: grid;',
    '  gap: 0.5rem;',
    '}',
    `.${classes.headerRow} {`,
    '  display: grid;',
    '  grid-template-columns: var(--tng-datepicker-nav-size) minmax(0, 1fr) var(--tng-datepicker-nav-size);',
    '  gap: 0.34rem;',
    '  align-items: center;',
    '}',
    `.${classes.nav},`,
    `.${classes.period} {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-datepicker-border) 84%, var(--tng-datepicker-canvas) 16%);',
    '  border-radius: 0.82rem;',
    '  background: color-mix(in srgb, var(--tng-datepicker-canvas) 78%, var(--tng-datepicker-surface) 22%);',
    '  color: var(--tng-datepicker-fg);',
    '  cursor: pointer;',
    '  padding: 0;',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '}',
    `.${classes.nav}:hover,`,
    `.${classes.period}:hover {`,
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 7%, var(--tng-datepicker-surface));',
    '}',
    `.${classes.nav} {`,
    '  inline-size: var(--tng-datepicker-nav-size);',
    '  min-height: var(--tng-datepicker-nav-size);',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 0;',
    '  font-size: 1.1rem;',
    '  line-height: 1;',
    '}',
    `.${classes.period} {`,
    '  min-height: var(--tng-datepicker-nav-size);',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  gap: 0.24rem;',
    '  min-inline-size: 0;',
    '  width: 100%;',
    '  padding-inline: 0.72rem;',
    '  font-weight: 600;',
    '}',
    `.${classes.periodTitle} {`,
    '  overflow: hidden;',
    '  text-overflow: ellipsis;',
    '  white-space: nowrap;',
    '}',
    `.${classes.weekdays} [data-slot="datepicker-weekday"] {`,
    '  color: color-mix(in srgb, var(--tng-datepicker-muted) 92%, white 8%);',
    '  font-size: 0.68rem;',
    '  font-weight: 600;',
    '  letter-spacing: 0.02em;',
    '  text-align: center;',
    '}',
    `.${classes.weekdays},`,
    `.${classes.dayGrid} {`,
    '  display: grid;',
    '  grid-template-columns: repeat(7, minmax(0, 1fr));',
    '  gap: var(--tng-datepicker-grid-gap);',
    '}',
    `.${classes.pickerGrid} {`,
    '  display: grid;',
    '  grid-template-columns: repeat(4, minmax(0, 1fr));',
    '  gap: var(--tng-datepicker-grid-gap);',
    '}',
    `.${classes.cell},`,
    `.${classes.pickerCell} {`,
    '  appearance: none;',
    '  -webkit-appearance: none;',
    '  box-sizing: border-box;',
    '  border: 1px solid color-mix(in srgb, var(--tng-datepicker-border) 84%, var(--tng-datepicker-canvas) 16%);',
    '  border-radius: 0.82rem;',
    '  background: color-mix(in srgb, var(--tng-datepicker-canvas) 78%, var(--tng-datepicker-surface) 22%);',
    '  color: var(--tng-datepicker-fg);',
    '  cursor: pointer;',
    '  transition:',
    '    border-color 150ms ease,',
    '    box-shadow 150ms ease,',
    '    background-color 150ms ease,',
    '    color 150ms ease;',
    '  min-height: var(--tng-datepicker-day-cell-size);',
    '  padding: 0;',
    '  font: inherit;',
    '  line-height: 1;',
    '}',
    `.${classes.pickerCell} {`,
    '  min-height: var(--tng-datepicker-picker-cell-size);',
    '}',
    `.${classes.cell}[data-active],`,
    `.${classes.pickerCell}[data-active],`,
    `.${classes.overlay} [data-slot="datepicker-month"][data-active],`,
    `.${classes.overlay} [data-slot="datepicker-year"][data-active] {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 36%, var(--tng-datepicker-border) 64%);',
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 9%, var(--tng-datepicker-surface) 91%);',
    '  box-shadow: 0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 14%, transparent);',
    '}',
    `.${classes.cell}[data-selected],`,
    `.${classes.pickerCell}[data-selected],`,
    `.${classes.overlay} [data-slot="datepicker-month"][data-selected],`,
    `.${classes.overlay} [data-slot="datepicker-year"][data-selected] {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 44%, var(--tng-datepicker-border) 56%);',
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 18%, var(--tng-datepicker-canvas) 82%);',
    '  color: color-mix(in srgb, var(--tng-datepicker-brand) 78%, #0f172a 22%);',
    '}',
    `.${classes.cell}[data-selected][data-active],`,
    `.${classes.pickerCell}[data-selected][data-active],`,
    `.${classes.overlay} [data-slot="datepicker-month"][data-selected][data-active],`,
    `.${classes.overlay} [data-slot="datepicker-year"][data-selected][data-active] {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 62%, var(--tng-datepicker-border) 38%);',
    '  background: color-mix(in srgb, var(--tng-datepicker-brand) 24%, var(--tng-datepicker-canvas) 76%);',
    '  box-shadow:',
    '    inset 0 1px 0 rgba(255, 255, 255, 0.8),',
    '    0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 18%, transparent);',
    '}',
    `.${classes.cell}[aria-current="date"]:not([data-selected]) {`,
    '  border-color: color-mix(in srgb, var(--tng-datepicker-brand) 30%, var(--tng-datepicker-border) 70%);',
    '  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tng-datepicker-brand) 12%, transparent);',
    '}',
    `.${classes.cell}:not([data-in-month]) {`,
    '  color: color-mix(in srgb, var(--tng-datepicker-muted) 84%, white 16%);',
    '  opacity: 0.58;',
    '}',
    `.${classes.cell}[data-disabled],`,
    `.${classes.pickerCell}[data-disabled],`,
    `.${classes.overlay} [data-slot="datepicker-month"][data-disabled],`,
    `.${classes.overlay} [data-slot="datepicker-year"][data-disabled] {`,
    '  opacity: 0.48;',
    '  box-shadow: none;',
    '}',
    `.${classes.cell}[data-disabled],`,
    `.${classes.pickerCell}[data-disabled] {`,
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');
}

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

function toCamelCase(value: string): string {
  const pascalCase = toPascalCase(value);
  return pascalCase[0]!.toLowerCase() + pascalCase.slice(1);
}

function createHeadlessTsCode(
  name: string,
  configLines: readonly string[],
  includeAdapter = false,
): string {
  const bindings = createExampleBindingNames(name);
  const adapterLines = includeAdapter
    ? [
        "import { defaultDatepickerDateAdapter, type TngDateAdapter } from '@tailng-ui/primitives';",
        '',
        `const ${bindings.adapter}: TngDateAdapter<Date> = {`,
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
    `  protected readonly ${bindings.controller} = createDatepickerController<Date>({`,
    ...(includeAdapter ? [`    adapter: ${bindings.adapter},`] : []),
    ...configLines.map((line) => `    ${line}`),
    '  });',
    '',
    `  protected readonly ${bindings.datepicker} = bindTngDatepicker(this.${bindings.controller});`,
    '',
    '  public ngOnDestroy(): void {',
    `    this.${bindings.controller}.destroy();`,
    '  }',
    '}',
    '',
  ].join('\n');
}

function createHeadlessHtmlCode(options: {
  containerClose: string;
  containerOpen: string;
  copyLine: string;
  inputAriaLabel: string;
  kickerLine: string;
  name: string;
  placeholder: string;
  triggerLabel: string;
}): string {
  const bindings = createExampleBindingNames(options.name);
  const classes = createExampleClassNames(options.name);
  return [
    options.containerOpen,
    `  ${options.kickerLine}`,
    `  ${options.copyLine}`,
    `  <section class="${classes.demo}" [tngDatepickerHost]="${bindings.controller}">`,
    `    <div class="${classes.field}" data-slot="datepicker-field">`,
    `      <div #${bindings.anchorRef} class="${classes.anchor}">`,
    '        <div',
    `          class="${classes.shell}"`,
    '          data-slot="datepicker-input-shell"',
    `          [attr.data-invalid]="${bindings.datepicker}.outputs().validationError !== null ? 'true' : null"`,
    `          [attr.data-open]="${bindings.datepicker}.outputs().getTriggerAttributes()['data-open']"`,
    '        >',
    '          <input',
    `            class="${classes.input}"`,
    `            [tngDatepickerInput]="${bindings.controller}"`,
    '            type="text"',
    '            inputmode="numeric"',
    `            placeholder="${options.placeholder}"`,
    `            aria-label="${options.inputAriaLabel}"`,
    '          />',
    '',
    '          <button',
    `            class="${classes.trigger}"`,
    `            [tngDatepickerTrigger]="${bindings.controller}"`,
    '            type="button"',
    '            tabindex="-1"',
    `            aria-label="${options.triggerLabel}"`,
    '          >',
    `            <tng-icon icon="calendar-days" class="${classes.triggerIcon}" />`,
    `            <span class="${classes.triggerChevron}" aria-hidden="true">▾</span>`,
    '          </button>',
    '        </div>',
    '',
    '        <section',
    `          class="${classes.overlay}"`,
    `          [tngDatepickerOverlay]="${bindings.controller}"`,
    `          [tngDatepickerOverlayAnchor]="${bindings.anchorRef}"`,
    '        >',
    `          <header class="${classes.header}" data-slot="datepicker-header">`,
    `            <div class="${classes.headerRow}">`,
    `              <button class="${classes.nav}" [tngDatepickerPrevButton]="${bindings.controller}" type="button">‹</button>`,
    `              <button class="${classes.period}" [tngDatepickerPeriodButton]="${bindings.controller}" type="button">`,
    `                <span class="${classes.periodTitle}">{{ ${bindings.datepicker}.periodLabel() }}</span>`,
    `                @if (${bindings.datepicker}.outputs().view !== 'year') {`,
    `                  <span class="${classes.periodChevron}" aria-hidden="true">▾</span>`,
    '                }',
    '              </button>',
    `              <button class="${classes.nav}" [tngDatepickerNextButton]="${bindings.controller}" type="button">›</button>`,
    '            </div>',
    '          </header>',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'day') {`,
    `            <div class="${classes.weekdays}" data-slot="datepicker-weekdays" aria-hidden="true">`,
    `              @for (label of ${bindings.datepicker}.outputs().weekdayLabels; track label) {`,
    '                <span data-slot="datepicker-weekday">{{ label }}</span>',
    '              }',
    '            </div>',
    '',
    `            <div class="${classes.dayGrid}" [tngDatepickerDayGrid]="${bindings.controller}">`,
    `              @for (cell of ${bindings.datepicker}.outputs().cells; track cell.id) {`,
    `                <button class="${classes.cell}" [tngDatepickerDayCell]="cell" type="button">`,
    '                  {{ cell.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'month') {`,
    `            <div class="${classes.pickerGrid}" [tngDatepickerMonthGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.datepicker}.outputs().monthOptions; track option.id) {`,
    `                <button class="${classes.pickerCell}" [tngDatepickerMonthOption]="option" type="button">`,
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'year') {`,
    `            <div class="${classes.pickerGrid}" [tngDatepickerYearGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.datepicker}.outputs().yearOptions; track option.id) {`,
    `                <button class="${classes.pickerCell}" [tngDatepickerYearOption]="option" type="button">`,
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

function createHeadlessTailwindHtmlCode(options: {
  brandHover: string;
  containerClose: string;
  containerOpen: string;
  copyLine: string;
  inputAriaLabel: string;
  kickerLine: string;
  name: string;
  placeholder: string;
  triggerLabel: string;
}): string {
  const bindings = createExampleBindingNames(options.name);
  return [
    options.containerOpen,
    `  ${options.kickerLine}`,
    `  ${options.copyLine}`,
    `  <section class="block w-[18.5rem] max-w-full [color-scheme:light]" [tngDatepickerHost]="${bindings.controller}">`,
    '    <div class="grid gap-[0.2rem]" data-slot="datepicker-field">',
    `      <div #${bindings.anchorRef} class="relative">`,
    '        <div',
    '          class="flex min-h-[2.95rem] min-w-0 w-full overflow-hidden rounded-[1.08rem] border border-slate-300/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-slate-400 focus-within:shadow-[0_0_0_3px_rgba(148,163,184,0.14)] data-[open=true]:border-slate-500 data-[open=true]:shadow-[var(--tng-datepicker-focus-shadow)] data-[invalid=true]:border-rose-600 data-[invalid=true]:shadow-[0_0_0_3px_rgba(225,29,72,0.16)]"',
    '          data-slot="datepicker-input-shell"',
    `          [attr.data-invalid]="${bindings.datepicker}.outputs().validationError !== null ? 'true' : null"`,
    `          [attr.data-open]="${bindings.datepicker}.outputs().getTriggerAttributes()['data-open']"`,
    '        >',
    '          <input',
    '            class="min-h-full min-w-0 flex-1 appearance-none border-0 bg-transparent px-[0.96rem] py-[0.72rem] text-[0.98rem] font-semibold tracking-[0.01em] text-slate-950 outline-none ring-0 focus:outline-none focus:ring-0 placeholder:font-medium placeholder:text-slate-400"',
    `            [tngDatepickerInput]="${bindings.controller}"`,
    '            type="text"',
    '            inputmode="numeric"',
    `            placeholder="${options.placeholder}"`,
    `            aria-label="${options.inputAriaLabel}"`,
    '          />',
    '',
    '          <button',
    '            type="button"',
    '            tabindex="-1"',
    `            class="inline-flex min-w-[3.25rem] shrink-0 items-center justify-center gap-[0.34rem] border-l border-slate-300/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-[0.78rem] text-slate-950 transition-colors duration-150 ${options.brandHover}"`,
    `            [tngDatepickerTrigger]="${bindings.controller}"`,
    `            aria-label="${options.triggerLabel}"`,
    '          >',
    '            <tng-icon icon="calendar-days" class="size-[1.05rem] shrink-0 text-slate-950" />',
    '            <span class="text-[0.68rem] leading-none text-slate-500" aria-hidden="true">▾</span>',
    '          </button>',
    '        </div>',
    '',
    '        <section',
    `          [tngDatepickerOverlay]="${bindings.controller}"`,
    `          [tngDatepickerOverlayAnchor]="${bindings.anchorRef}"`,
    '          class="grid w-[min(20rem,calc(100vw-2rem))] gap-[0.68rem] rounded-[1.26rem] border border-slate-300/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-[0.8rem] text-slate-950 shadow-[0_22px_38px_rgba(15,23,42,0.12),0_10px_20px_rgba(15,23,42,0.08)]"',
    '        >',
    '          <header class="grid gap-[0.42rem]" data-slot="datepicker-header">',
    '            <div class="grid grid-cols-[1.9rem_minmax(0,1fr)_1.9rem] items-center gap-[0.4rem]">',
    `              <button [tngDatepickerPrevButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] items-center justify-center rounded-[0.82rem] border border-slate-300/90 bg-white/80 text-[1.05rem] leading-none text-slate-950 transition-colors duration-150 ${options.brandHover}">‹</button>`,
    `              <button [tngDatepickerPeriodButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] min-w-0 items-center justify-center gap-[0.24rem] rounded-[0.82rem] border border-slate-300/90 bg-white/80 px-[0.72rem] font-semibold text-slate-950 transition-colors duration-150 ${options.brandHover}">`,
    `                <span class="truncate">{{ ${bindings.datepicker}.periodLabel() }}</span>`,
    `                @if (${bindings.datepicker}.outputs().view !== 'year') {`,
    '                  <span class="text-[0.68rem] leading-none text-slate-500" aria-hidden="true">▾</span>',
    '                }',
    '              </button>',
    `              <button [tngDatepickerNextButton]="${bindings.controller}" type="button" class="inline-flex min-h-[2rem] items-center justify-center rounded-[0.82rem] border border-slate-300/90 bg-white/80 text-[1.05rem] leading-none text-slate-950 transition-colors duration-150 ${options.brandHover}">›</button>`,
    '            </div>',
    '          </header>',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'day') {`,
    '            <div class="grid grid-cols-7 gap-[0.28rem]" data-slot="datepicker-weekdays" aria-hidden="true">',
    `              @for (label of ${bindings.datepicker}.outputs().weekdayLabels; track label) {`,
    '                <span class="text-center text-[0.68rem] font-medium text-slate-500" data-slot="datepicker-weekday">{{ label }}</span>',
    '              }',
    '            </div>',
    '',
    `            <div class="grid grid-cols-7 gap-[0.28rem]" [tngDatepickerDayGrid]="${bindings.controller}">`,
    `              @for (cell of ${bindings.datepicker}.outputs().cells; track cell.id) {`,
    '                <button',
    '                  [tngDatepickerDayCell]="cell"',
    '                  type="button"',
    '                  class="min-h-[2.28rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45"',
    '                >',
    '                  {{ cell.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'month') {`,
    `            <div class="grid grid-cols-4 gap-[0.28rem]" [tngDatepickerMonthGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.datepicker}.outputs().monthOptions; track option.id) {`,
    '                <button',
    '                  [tngDatepickerMonthOption]="option"',
    '                  type="button"',
    '                  class="min-h-[2.38rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45"',
    '                >',
    '                  {{ option.label }}',
    '                </button>',
    '              }',
    '            </div>',
    '          }',
    '',
    `          @if (${bindings.datepicker}.outputs().view === 'year') {`,
    `            <div class="grid grid-cols-4 gap-[0.28rem]" [tngDatepickerYearGrid]="${bindings.controller}">`,
    `              @for (option of ${bindings.datepicker}.outputs().yearOptions; track option.id) {`,
    '                <button',
    '                  [tngDatepickerYearOption]="option"',
    '                  type="button"',
    '                  class="min-h-[2.38rem] rounded-[0.82rem] border border-transparent bg-slate-50 text-slate-950 transition-[border-color,box-shadow,background-color,color,opacity] duration-150 hover:border-slate-300/90 hover:bg-white data-[active=true]:border-slate-300/90 data-[active=true]:bg-white data-[active=true]:shadow-[0_0_0_1px_rgba(15,23,42,0.05)] data-[selected=true]:text-slate-950 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45"',
    '                >',
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
  name: string,
  classes: {
    card: string;
    copy: string;
    kicker: string;
  },
  themeCss: string,
): string {
  return [
    createScopedSharedCssCode(createExampleClassNames(name)),
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

  protected readonly bookingPlainController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-05-18',
    trapFocus: true,
    value: '2024-05-18',
    minDate: '2024-05-10',
    maxDate: '2024-05-25',
  });

  protected readonly bookingTailwindController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-05-18',
    trapFocus: true,
    value: '2024-05-18',
    minDate: '2024-05-10',
    maxDate: '2024-05-25',
  });

  protected readonly reportingPlainController = createDatepickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly reportingTailwindController = createDatepickerController<Date>({
    adapter: customFormatAdapter,
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
  });

  protected readonly bookingPlain = bindTngDatepicker(this.bookingPlainController);
  protected readonly bookingTailwind = bindTngDatepicker(this.bookingTailwindController);
  protected readonly reportingPlain = bindTngDatepicker(this.reportingPlainController);
  protected readonly reportingTailwind = bindTngDatepicker(this.reportingTailwindController);

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
      name: 'headless-booking-window-plain',
      containerOpen: '<section class="docs-headless-datepicker-examples-booking-plain-card">',
      kickerLine:
        '<span class="docs-headless-datepicker-examples-booking-plain-kicker">Booking window</span>',
      copyLine:
        '<p class="docs-headless-datepicker-examples-booking-plain-copy">Constrain the selectable booking window without giving up manual input.</p>',
      placeholder: 'MM-DD-YYYY',
      inputAriaLabel: 'Booking start date',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      'headless-booking-window-plain',
      {
        card: 'docs-headless-datepicker-examples-booking-plain-card',
        kicker: 'docs-headless-datepicker-examples-booking-plain-kicker',
        copy: 'docs-headless-datepicker-examples-booking-plain-copy',
      },
      createThemeCss(`.${createExampleClassNames('headless-booking-window-plain').demo}`, {
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
    createHeadlessTailwindHtmlCode({
      name: 'headless-booking-window-tailwind',
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] [color-scheme:light]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Booking window</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600">Constrain the selectable booking window without giving up manual input.</p>',
      brandHover: 'hover:bg-blue-50',
      placeholder: 'MM-DD-YYYY',
      inputAriaLabel: 'Booking start date',
      triggerLabel: 'Open booking calendar',
      containerClose: '</section>',
    }),
    '/* No custom CSS required. Tailwind utilities fully style the field and overlay. */\n',
  );

  protected readonly reportingPlainCodeTabs = createCodeTabs(
    'headless-reporting-calendar-plain',
    createHeadlessTsCode(
      'headless-reporting-calendar-plain',
      [
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
      name: 'headless-reporting-calendar-plain',
      containerOpen: '<section class="docs-headless-datepicker-examples-reporting-plain-card">',
      kickerLine:
        '<span class="docs-headless-datepicker-examples-reporting-plain-kicker">Reporting calendar</span>',
      copyLine:
        '<p class="docs-headless-datepicker-examples-reporting-plain-copy">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      placeholder: 'DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    createPlainCssCode(
      'headless-reporting-calendar-plain',
      {
        card: 'docs-headless-datepicker-examples-reporting-plain-card',
        kicker: 'docs-headless-datepicker-examples-reporting-plain-kicker',
        copy: 'docs-headless-datepicker-examples-reporting-plain-copy',
      },
      createThemeCss(`.${createExampleClassNames('headless-reporting-calendar-plain').demo}`, {
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
        'ownerDocument: document,',
        "value: '2024-04-22',",
        "today: '2024-04-18',",
        'closeOnSelect: true,',
        'trapFocus: true,',
        'showOutsideDays: true,',
      ],
      true,
    ),
    createHeadlessTailwindHtmlCode({
      name: 'headless-reporting-calendar-tailwind',
      containerOpen:
        '<section class="mx-auto grid w-full max-w-[22rem] gap-3 rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.10)] [color-scheme:light]">',
      kickerLine:
        '<span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Reporting calendar</span>',
      copyLine:
        '<p class="m-0 text-sm leading-6 text-slate-600">Swap in a reporting adapter when the field format and period label follow business conventions.</p>',
      brandHover: 'hover:bg-teal-50',
      placeholder: 'DD.MM.YYYY',
      inputAriaLabel: 'Reporting period',
      triggerLabel: 'Open reporting calendar',
      containerClose: '</section>',
    }),
    '/* No custom CSS required. Tailwind utilities fully style the field and overlay. */\n',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
    this.bookingPlainController.destroy();
    this.bookingTailwindController.destroy();
    this.reportingPlainController.destroy();
    this.reportingTailwindController.destroy();
  }
}
