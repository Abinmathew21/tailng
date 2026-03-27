import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

interface ListboxOption {
  readonly description: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
}

type ListboxModel = string | readonly string[] | null;

const LISTBOX_OPTIONS: readonly ListboxOption[] = Object.freeze([
  {
    description: 'Keyboard and ARIA contracts for deterministic interaction behavior.',
    id: 'a11y',
    label: 'Accessibility baseline',
  },
  {
    description: 'Shared primitives and wrappers for TailNG form controls.',
    id: 'components',
    label: 'Components integration',
  },
  {
    description: 'State hooks and CSS contracts for custom product skins.',
    id: 'styling',
    label: 'Styling contracts',
  },
  {
    description: 'Regression suites for keyboard, pointer, and typeahead behavior.',
    id: 'tests',
    label: 'Testing harness',
  },
  {
    description: 'Upcoming wrapper exploration for richer listbox composition.',
    disabled: true,
    id: 'roadmap',
    label: 'Wrapper roadmap (disabled)',
  },
]);

@Component({
  selector: 'app-listbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngListboxDirective,
    TngOptionDirective,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './listbox-overview-page.component.html',
  styleUrl: './listbox-overview-page.component.css',
})
export class ListboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly optionLabelById = new Map(LISTBOX_OPTIONS.map((option) => [option.id, option.label]));

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly options = LISTBOX_OPTIONS;
  protected readonly headlessValue = signal<readonly string[]>(['a11y', 'tests']);
  protected readonly plainValue = signal<readonly string[]>(['components']);
  protected readonly tailwindValue = signal<readonly string[]>(['styling']);

  protected readonly headlessSummary = computed(() => this.formatSelection(this.headlessValue()));
  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValue()));

  protected readonly primitiveImportCode = [
    "import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div',
    '  tngListbox',
    '  tabindex="0"',
    '  [multiple]="true"',
    '  [value]="selectedValues()"',
    '  (valueChange)="selectedValues.set(toArray($event))"',
    '>',
    '  @for (option of options; track option.id) {',
    '    <div tngOption [tngValue]="option.id">{{ option.label }}</div>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-headless-overview.component.ts',
      code: [
        "readonly selectedValues = signal<readonly string[]>(['a11y', 'tests']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedValues.set(this.toArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-headless-overview.component.html',
      code: [
        '<div',
        '  tngListbox',
        '  tabindex="0"',
        '  class="listbox-preview listbox-preview--headless"',
        '  [multiple]="true"',
        '  [value]="selectedValues()"',
        '  (valueChange)="onValueChange($event)"',
        '>',
        '  @for (option of options; track option.id) {',
        '    <div',
        '      tngOption',
        '      class="listbox-option"',
        '      [tngValue]="option.id"',
        '      [disabled]="option.disabled === true"',
        '    >',
        '      <p class="listbox-option__title">{{ option.label }}</p>',
        '      <p class="listbox-option__description">{{ option.description }}</p>',
        '    </div>',
        '  }',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-headless-overview.component.css',
      code: [
        '.listbox-preview {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.9rem;',
        '  display: grid;',
        '  gap: 0.5rem;',
        '  outline: none;',
        '  padding: 0.8rem;',
        '}',
        '',
        '.listbox-option[data-active] {',
        '  border-color: var(--tng-semantic-accent-brand);',
        '}',
        '',
        '.listbox-option[data-selected] {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 15%, transparent);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-plain-css-overview.component.ts',
      code: [
        "readonly selectedValues = signal<readonly string[]>(['components']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedValues.set(this.toArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-plain-css-overview.component.html',
      code: [
        '<div class="listbox-preview-shell listbox-preview-shell--plain">',
        '  <div',
        '    tngListbox',
        '    tabindex="0"',
        '    class="listbox-preview listbox-preview--plain"',
        '    [multiple]="true"',
        '    [value]="selectedValues()"',
        '    (valueChange)="onValueChange($event)"',
        '  >',
        '    @for (option of options; track option.id) {',
        '      <div tngOption class="listbox-option" [tngValue]="option.id">',
        '        {{ option.label }}',
        '      </div>',
        '    }',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-plain-css-overview.component.css',
      code: [
        '.listbox-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-tailwind-overview.component.ts',
      code: [
        "readonly selectedValues = signal<readonly string[]>(['styling']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedValues.set(this.toArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-tailwind-overview.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div',
        '    tngListbox',
        '    tabindex="0"',
        '    class="listbox-preview listbox-preview--tailwind"',
        '    [multiple]="true"',
        '    [value]="selectedValues()"',
        '    (valueChange)="onValueChange($event)"',
        '  >',
        '    @for (option of options; track option.id) {',
        '      <div tngOption class="listbox-option" [tngValue]="option.id">{{ option.label }}</div>',
        '    }',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-tailwind-overview.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessValueChange(value: ListboxModel): void {
    this.headlessValue.set(this.toArray(value));
  }

  protected onPlainValueChange(value: ListboxModel): void {
    this.plainValue.set(this.toArray(value));
  }

  protected onTailwindValueChange(value: ListboxModel): void {
    this.tailwindValue.set(this.toArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (value === null) {
      return [];
    }

    if (typeof value === 'string') {
      return [value];
    }

    return value;
  }

  private formatSelection(values: readonly string[]): string {
    const labels = values
      .map((value) => this.optionLabelById.get(value))
      .filter((label): label is string => label !== undefined);
    if (labels.length === 0) {
      return 'none';
    }

    return labels.join(', ');
  }

}
