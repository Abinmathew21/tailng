import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngSelectComponent } from '@tailng-ui/components';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
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

const OWNER_OPTIONS: readonly SelectOption[] = Object.freeze([
  { value: 'maya', label: 'Maya Patel' },
  { value: 'liam', label: 'Liam Chen' },
  { value: 'zoe', label: 'Zoe Martin' },
  { value: 'ron', label: 'Ron Gupta' },
]);

@Component({
  selector: 'app-selectbox-examples-page',
  imports: [
    TngSelectComponent,
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './selectbox-examples-page.component.html',
  styleUrl: './selectbox-examples-page.component.css',
})
export class SelectboxExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly labelByValue = new Map(
    [...STATUS_OPTIONS, ...OWNER_OPTIONS].map((option) => [option.value, option.label]),
  );
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly ownerOptions = OWNER_OPTIONS;

  protected readonly getStatusValue = (option: SelectOption) => option.value;
  protected readonly getStatusLabel = (option: SelectOption) => option.label;

  protected readonly headlessValue = signal<string | null>('progress');
  protected readonly plainValue = signal<string | null>('review');
  protected readonly tailwindValue = signal<string | null>('done');

  protected readonly ownerAValue = signal<string | null>('maya');
  protected readonly ownerBValue = signal<string | null>('zoe');

  protected readonly headlessSummary = computed(() => this.resolveLabel(this.headlessValue(), 'none'));
  protected readonly plainSummary = computed(() => this.resolveLabel(this.plainValue(), 'none'));
  protected readonly tailwindSummary = computed(() => this.resolveLabel(this.tailwindValue(), 'none'));
  protected readonly ownerASummary = computed(() => this.resolveLabel(this.ownerAValue(), 'none'));
  protected readonly ownerBSummary = computed(() => this.resolveLabel(this.ownerBValue(), 'none'));

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'selectbox-examples-headless.component.ts',
      code: [
        "readonly selectedStatus = signal<string | null>('progress');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatus.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-examples-headless.component.html',
      code: [
        '<section tngSelect [value]="selectedStatus()" (valueChange)="onValueChange($event)">',
        '  <button #trigger tngSelectTrigger type="button">',
        '    <span tngSelectValue>{{ selectedLabel() }}</span>',
        '    <span tngSelectIcon aria-hidden="true">▾</span>',
        '  </button>',
        '  <div tngSelectContent>',
        '    <div tngSelectOverlay [style.minWidth.px]="trigger.offsetWidth">',
        '      <ul tngSelectListbox>',
        '        @for (option of statusOptions; track option.value) {',
        '          <li tngSelectOption [tngValue]="option.value">{{ option.label }}</li>',
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
      title: 'selectbox-examples-headless.component.css',
      code: '.selectbox-preview-control { --tng-select-radius: 0.78rem; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'selectbox-examples-plain-css.component.ts',
      code: [
        "readonly selectedStatus = signal<string | null>('review');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatus.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-examples-plain-css.component.html',
      code: [
        '<div class="selectbox-preview-shell selectbox-preview-shell--plain">',
        '  <tng-select',
        '    [options]="statusOptions"',
        '    [value]="selectedStatus()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getStatusValue"',
        '    [getOptionLabel]="getStatusLabel"',
        '  ></tng-select>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'selectbox-examples-plain-css.component.css',
      code: [
        '.selectbox-preview-shell--plain {',
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
      title: 'selectbox-examples-tailwind.component.ts',
      code: [
        "readonly selectedStatus = signal<string | null>('done');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedStatus.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-select',
        '    [options]="statusOptions"',
        '    [value]="selectedStatus()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getStatusValue"',
        '    [getOptionLabel]="getStatusLabel"',
        '  ></tng-select>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'selectbox-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessValueChange(value: unknown): void {
    this.headlessValue.set(this.toSingleValue(value));
  }

  protected onPlainValueChange(value: unknown): void {
    this.plainValue.set(this.toSingleValue(value));
  }

  protected onTailwindValueChange(value: unknown): void {
    this.tailwindValue.set(this.toSingleValue(value));
  }

  protected onOwnerAValueChange(value: unknown): void {
    this.ownerAValue.set(this.toSingleValue(value));
  }

  protected onOwnerBValueChange(value: unknown): void {
    this.ownerBValue.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveLabel(value: string | null, fallback: string): string {
    if (value === null) {
      return fallback;
    }

    return this.labelByValue.get(value) ?? fallback;
  }

  private toSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }

}
