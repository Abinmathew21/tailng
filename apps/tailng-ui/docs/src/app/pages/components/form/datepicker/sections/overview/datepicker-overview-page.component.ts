import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  type ElementRef,
  type OnDestroy,
  viewChild,
} from '@angular/core';
import { TngCodeBlockComponent, TngDatepickerComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createDatepickerController,
  TngDatepickerOverlay,
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
  imports: [
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    TngDatepickerComponent,
    TngDatepickerOverlay,
    TngIcon,
  ],
  templateUrl: './datepicker-overview-page.component.html',
  styleUrl: './datepicker-overview-page.component.css',
})
export class DatepickerOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly headlessRenderVersion = signal(0);
  private readonly headlessTriggerRef = viewChild<ElementRef<HTMLElement>>('headlessTrigger');

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();
  private readonly unsubscribeHeadless: () => void;

  protected readonly componentImportCode = [
    "import { TngDatepickerComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly primitiveImportCode = [
    'import {',
    '  createDatepickerController,',
    '  type TngDateAdapter,',
    '  TngDatepickerOverlay,',
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
    "  value: '2024-04-22',",
    "  today: '2024-04-18',",
    '  ownerDocument: document,',
    '  trapFocus: true,',
    '  closeOnSelect: true,',
    '});',
    '',
    '// Implementation controls the panel flow directly.',
    "controller.showYearsPanel();",
    '',
  ].join('\n');

  protected readonly simpleHeadlessController = createDatepickerController<Date>({
    closeOnSelect: true,
    ownerDocument: this.documentRef,
    showOutsideDays: true,
    today: '2024-04-18',
    trapFocus: true,
    value: '2024-04-22',
    minDate: '2024-04-01',
    maxDate: '2026-03-31',
  });

  protected readonly simpleHeadlessOutputs = computed(() => {
    this.headlessRenderVersion();
    return this.simpleHeadlessController.getOutputs();
  });

  protected readonly simpleHeadlessCodeTabs = createCodeTabs(
    'overview-datepicker-headless',
    [
      "import { Component } from '@angular/core';",
      "import { TngIcon } from '@tailng-ui/icons';",
      'import {',
      '  createDatepickerController,',
      '  TngDatepickerOverlay,',
      "} from '@tailng-ui/primitives';",
      '',
      '@Component({',
      '  imports: [TngIcon, TngDatepickerOverlay],',
      "  templateUrl: './overview-datepicker-headless.component.html',",
      "  styleUrl: './overview-datepicker-headless.component.css',",
      '})',
      'export class OverviewDatepickerHeadlessComponent {',
      '  protected readonly controller = createDatepickerController<Date>({',
      "    value: '2024-04-22',",
      "    today: '2024-04-18',",
      "    minDate: '2024-04-01',",
      "    maxDate: '2026-03-31',",
      '    ownerDocument: document,',
      '    trapFocus: true,',
      '    closeOnSelect: true,',
      '  });',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="datepicker-overview-headless">',
      '  <div class="datepicker-overview-headless-field" data-slot="datepicker-field">',
      '    <div #anchorShell class="datepicker-overview-headless-anchor">',
      '      <div class="datepicker-overview-headless-shell" data-slot="datepicker-input-shell">',
      '        <input',
      '          data-slot="datepicker-input"',
      '          type="text"',
      '          placeholder="MM-DD-YYYY"',
      '          [value]="outputs().inputText"',
      '        />',
      '        <button #trigger type="button" data-slot="datepicker-trigger">',
      '          <tng-icon icon="calendar-days" />',
      '        </button>',
      '      </div>',
      '      <section',
      '        [tngDatepickerOverlay]="controller"',
      '        [tngDatepickerOverlayAnchor]="anchorShell"',
      '        [attr.data-slot]="outputs().getOverlayAttributes()[\'data-slot\']"',
      '      >',
      '        <!-- header + grid driven from controller outputs -->',
      '      </section>',
      '    </div>',
      '  </div>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.datepicker-overview-headless { width: min(100%, 18.5rem); }',
      '.datepicker-overview-headless-anchor { position: relative; }',
      '.datepicker-overview-headless-header-row {',
      '  display: grid;',
      '  grid-template-columns: 1.9rem minmax(0, 1fr) 1.9rem;',
      '  gap: 0.4rem;',
      '  align-items: center;',
      '}',
      '.datepicker-overview-headless-weekdays,',
      '.datepicker-overview-headless-day-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(7, minmax(0, 1fr));',
      '  gap: var(--tng-datepicker-grid-gap);',
      '}',
      '.datepicker-overview-headless-picker-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(4, minmax(0, 1fr));',
      '  gap: var(--tng-datepicker-grid-gap);',
      '}',
      '',
    ].join('\n'),
  );

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
      "  styleUrl: './overview-datepicker-tailwind.component.css',",
      '})',
      'export class OverviewDatepickerTailwindComponent {}',
      '',
    ].join('\n'),
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

  public constructor() {
    this.unsubscribeHeadless = this.simpleHeadlessController.subscribe((event) => {
      this.headlessRenderVersion.update((value) => value + 1);
      if (event.type === 'opened') {
        this.queueOverlayFocusSync();
      }
    });

    effect(() => {
      this.simpleHeadlessController.registerTrigger(
        this.headlessTriggerRef()?.nativeElement ?? null,
      );
    });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
    this.unsubscribeHeadless();
    this.simpleHeadlessController.destroy();
  }

  protected onHeadlessInputBlur(): void {
    this.simpleHeadlessController.commitInputText();
  }

  protected onHeadlessInputChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.simpleHeadlessController.setInputText(target.value);
  }

  protected onHeadlessInputClick(): void {
    if (this.simpleHeadlessController.getOutputs().open) {
      return;
    }

    this.simpleHeadlessController.open();
    this.queueOverlayFocusSync();
  }

  protected onHeadlessInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    if (!this.simpleHeadlessController.getOutputs().open) {
      this.simpleHeadlessController.open();
      this.queueOverlayFocusSync();
      return;
    }

    this.simpleHeadlessController.commitInputText();
  }

  protected onHeadlessTriggerClick(): void {
    const wasOpen = this.simpleHeadlessController.getOutputs().open;
    this.simpleHeadlessController.toggleOpen();
    if (!wasOpen && this.simpleHeadlessController.getOutputs().open) {
      this.queueOverlayFocusSync();
    }
  }

  protected onHeadlessTriggerKeydown(event: KeyboardEvent): void {
    const wasOpen = this.simpleHeadlessController.getOutputs().open;
    this.simpleHeadlessController.handleTriggerKeyDown(event);
    if (!wasOpen && this.simpleHeadlessController.getOutputs().open) {
      this.queueOverlayFocusSync();
    }
  }

  protected onHeadlessOverlayKeydown(event: KeyboardEvent): void {
    this.simpleHeadlessController.handleOverlayKeyDown(event);
  }

  protected onHeadlessGridKeydown(event: KeyboardEvent): void {
    this.simpleHeadlessController.handleGridKeyDown(event);
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onHeadlessMonthKeydown(event: KeyboardEvent): void {
    this.simpleHeadlessController.handleMonthGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.simpleHeadlessController.showDaysPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onHeadlessYearKeydown(event: KeyboardEvent): void {
    this.simpleHeadlessController.handleYearGridKeyDown(event);
    if (this.isPickerActivationKey(event.key)) {
      this.simpleHeadlessController.showMonthsPanel();
    }
    if (this.shouldSyncOverlayFocusAfterPickerKey(event.key)) {
      this.queueOverlayFocusSync();
    }
  }

  protected onHeadlessDayCellClick(cell: Readonly<TngDateCell<Date>>): void {
    if (cell.disabled || cell.hidden) {
      return;
    }

    this.simpleHeadlessController.handleCellClick(cell.date);
  }

  protected onHeadlessMonthOptionClick(option: Readonly<TngMonthOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.simpleHeadlessController.selectMonth(option.index);
    this.simpleHeadlessController.showDaysPanel();
    this.queueOverlayFocusSync();
  }

  protected onHeadlessYearOptionClick(option: Readonly<TngYearOption<Date>>): void {
    if (option.disabled) {
      return;
    }

    this.simpleHeadlessController.selectYear(option.year);
    this.simpleHeadlessController.showMonthsPanel();
    this.queueOverlayFocusSync();
  }

  protected onHeadlessPeriodClick(): void {
    if (this.simpleHeadlessController.getOutputs().view === 'year') {
      return;
    }

    this.simpleHeadlessController.showYearsPanel();
    this.queueOverlayFocusSync();
  }

  protected pageBackward(): void {
    if (this.simpleHeadlessController.getOutputs().view === 'day') {
      this.simpleHeadlessController.prevMonth();
    } else {
      this.simpleHeadlessController.prevYear();
    }

    this.queueOverlayFocusSync();
  }

  protected pageForward(): void {
    if (this.simpleHeadlessController.getOutputs().view === 'day') {
      this.simpleHeadlessController.nextMonth();
    } else {
      this.simpleHeadlessController.nextYear();
    }

    this.queueOverlayFocusSync();
  }

  protected resolvePeriodLabel(): string {
    const outputs = this.simpleHeadlessController.getOutputs();
    if (outputs.view === 'year') {
      const startYear = outputs.yearOptions[0]?.year;
      const endYear = outputs.yearOptions[outputs.yearOptions.length - 1]?.year;
      if (startYear !== undefined && endYear !== undefined) {
        return `${startYear} - ${endYear}`;
      }
    }

    if (outputs.view === 'month') {
      return this.simpleHeadlessController.formatDate(outputs.visibleMonth, 'year-label');
    }

    return outputs.labelMonthYear;
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }

  private queueOverlayFocusSync(): void {
    queueMicrotask(() => {
      const focusTarget = (): void => {
        const outputs = this.simpleHeadlessController.getOutputs();
        if (!outputs.open) {
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
