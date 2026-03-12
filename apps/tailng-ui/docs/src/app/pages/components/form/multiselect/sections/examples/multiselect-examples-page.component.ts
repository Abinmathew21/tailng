import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';
import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly SelectOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

const TAG_OPTIONS: readonly SelectOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-multiselect-examples-page',
  imports: [
    TngMultiSelectComponent,
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multiselect-examples-page.component.html',
  styleUrl: './multiselect-examples-page.component.css',
})
export class MultiselectExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly labelByValue = new Map(
    [...STATUS_OPTIONS, ...TAG_OPTIONS].map((option) => [option.value, option.label]),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly tagOptions = TAG_OPTIONS;
  protected readonly getStatusValue = (option: SelectOption) => option.value;
  protected readonly getStatusLabel = (option: SelectOption) => option.label;

  protected readonly headlessValue = signal<readonly string[]>(['todo', 'review']);
  protected readonly plainValue = signal<readonly string[]>(['progress']);
  protected readonly tailwindValue = signal<readonly string[]>(['done']);

  protected readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  protected readonly tagValueB = signal<readonly string[]>(['forms']);

  protected readonly headlessSummary = computed(() => this.resolveLabels(this.headlessValue()));
  protected readonly plainSummary = computed(() => this.resolveLabels(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.resolveLabels(this.tailwindValue()));
  protected readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  protected readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multiselect-examples-headless.component.ts',
      code: [
        "readonly selectedStatuses = signal<readonly string[]>(['todo', 'review']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatuses.set(this.toValueArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-examples-headless.component.html',
      code: [
        '<section tngMultiSelect [value]="selectedStatuses()" (valueChange)="onValueChange($event)">',
        '  <button #trigger tngSelectTrigger type="button">',
        '    <span tngSelectValue>{{ selectedSummary() }}</span>',
        '    <span tngSelectIcon aria-hidden="true">▾</span>',
        '  </button>',
        '  <div tngSelectContent>',
        '    <div tngSelectOverlay [style.minWidth.px]="trigger.offsetWidth">',
        '      <ul tngMultiSelectListbox [multiple]="true">',
        '        @for (option of statusOptions; track option.value) {',
        '          <li tngMultiSelectOption [tngValue]="option.value">{{ option.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-examples-headless.component.css',
      code: '.multiselect-preview-control { --tng-select-radius: 0.78rem; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multiselect-examples-plain-css.component.ts',
      code: [
        "readonly selectedStatuses = signal<readonly string[]>(['progress']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatuses.set(this.toValueArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-examples-plain-css.component.html',
      code: [
        '<div class="multiselect-preview-shell multiselect-preview-shell--plain">',
        '  <tng-multiselect',
        '    [options]="statusOptions"',
        '    [value]="selectedStatuses()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getStatusValue"',
        '    [getOptionLabel]="getStatusLabel"',
        '  ></tng-multiselect>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-examples-plain-css.component.css',
      code: [
        '.multiselect-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multiselect-examples-tailwind.component.ts',
      code: [
        "readonly selectedStatuses = signal<readonly string[]>(['done']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatuses.set(this.toValueArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-multiselect',
        '    [options]="statusOptions"',
        '    [value]="selectedStatuses()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getStatusValue"',
        '    [getOptionLabel]="getStatusLabel"',
        '  ></tng-multiselect>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessValueChange(value: unknown): void {
    this.headlessValue.set(this.toValueArray(value));
  }

  protected onPlainValueChange(value: unknown): void {
    this.plainValue.set(this.toValueArray(value));
  }

  protected onTailwindValueChange(value: unknown): void {
    this.tailwindValue.set(this.toValueArray(value));
  }

  protected onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  protected onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((value) => this.labelByValue.get(value))
      .filter((label): label is string => label !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }

    return typeof value === 'string' ? [value] : [];
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
}
