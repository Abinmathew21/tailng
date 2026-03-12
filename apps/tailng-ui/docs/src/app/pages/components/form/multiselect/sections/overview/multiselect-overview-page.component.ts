import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMultiSelectComponent } from '@tailng-ui/components';
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

interface PlanetOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const PLANET_OPTIONS: readonly PlanetOption[] = Object.freeze([
  { value: 'mercury', label: 'Mercury' },
  { value: 'venus', label: 'Venus' },
  { value: 'earth', label: 'Earth' },
  { value: 'mars', label: 'Mars' },
  { value: 'jupiter', label: 'Jupiter', disabled: true },
  { value: 'uranus', label: 'Uranus' },
  { value: 'neptune', label: 'Neptune' },
]);

@Component({
  selector: 'app-multiselect-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './multiselect-overview-page.component.html',
  styleUrl: './multiselect-overview-page.component.css',
})
export class MultiselectOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly optionLabelByValue = new Map(
    PLANET_OPTIONS.map((option) => [option.value, option.label]),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly options = PLANET_OPTIONS;
  protected readonly getPlanetValue = (option: PlanetOption) => option.value;
  protected readonly getPlanetLabel = (option: PlanetOption) => option.label;

  protected readonly headlessValue = signal<readonly string[]>(['earth', 'mars']);
  protected readonly plainValue = signal<readonly string[]>(['venus', 'neptune']);
  protected readonly tailwindValue = signal<readonly string[]>(['mercury', 'uranus']);

  protected readonly headlessSummary = computed(() => this.resolveLabels(this.headlessValue()));
  protected readonly plainSummary = computed(() => this.resolveLabels(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.resolveLabels(this.tailwindValue()));

  protected readonly primitiveImportCode = [
    'import {',
    '  TngMultiSelect,',
    '  TngSelectTrigger,',
    '  TngSelectValue,',
    '  TngSelectIcon,',
    '  TngSelectContent,',
    '  TngSelectOverlay,',
    '  TngMultiSelectListbox,',
    '  TngMultiSelectOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngMultiSelectComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multiselect-headless-overview.component.ts',
      code: [
        "readonly selectedPlanets = signal<readonly string[]>(['earth', 'mars']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanets.set(this.toValueArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-headless-overview.component.html',
      code: [
        '<section tngMultiSelect [value]="selectedPlanets()" (valueChange)="onValueChange($event)">',
        '  <button #trigger tngSelectTrigger type="button">',
        '    <span tngSelectValue>{{ selectedLabel() }}</span>',
        '    <span tngSelectIcon aria-hidden="true">▾</span>',
        '  </button>',
        '  <div tngSelectContent>',
        '    <div tngSelectOverlay [style.minWidth.px]="trigger.offsetWidth">',
        '      <ul tngMultiSelectListbox [multiple]="true">',
        '        @for (planet of planets; track planet.value) {',
        '          <li tngMultiSelectOption [tngValue]="planet.value">{{ planet.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-headless-overview.component.css',
      code: [
        '.multiselect-preview-control {',
        '  --tng-select-radius: 0.78rem;',
        '  --tng-select-trigger-py: 0.58rem;',
        '  --tng-select-trigger-px: 0.88rem;',
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
      title: 'multiselect-plain-css-overview.component.ts',
      code: [
        "readonly selectedPlanets = signal<readonly string[]>(['venus', 'neptune']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanets.set(this.toValueArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-plain-css-overview.component.html',
      code: [
        '<div class="multiselect-preview-shell multiselect-preview-shell--plain">',
        '  <tng-multiselect',
        '    [options]="planets"',
        '    [value]="selectedPlanets()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getPlanetValue"',
        '    [getOptionLabel]="getPlanetLabel"',
        '    placeholder="Select planets"',
        '    aria-label="Plain CSS planet multi-select"',
        '  ></tng-multiselect>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-plain-css-overview.component.css',
      code: [
        '.multiselect-preview-shell--plain {',
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
      title: 'multiselect-tailwind-overview.component.ts',
      code: [
        "readonly selectedPlanets = signal<readonly string[]>(['mercury', 'uranus']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanets.set(this.toValueArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-tailwind-overview.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-multiselect',
        '    [options]="planets"',
        '    [value]="selectedPlanets()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getPlanetValue"',
        '    [getOptionLabel]="getPlanetLabel"',
        '    placeholder="Select planets"',
        '    aria-label="Tailwind planet multi-select"',
        '  ></tng-multiselect>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-tailwind-overview.component.css',
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((value) => this.optionLabelByValue.get(value))
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
