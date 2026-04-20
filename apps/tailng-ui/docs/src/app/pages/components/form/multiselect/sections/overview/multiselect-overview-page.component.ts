import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multiselect.util';
import { TngCodeBlockComponent, TngMultiSelectComponent } from '@tailng-ui/components';
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
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly options = PLANET_OPTIONS;
  protected readonly getPlanetValue = (option: PlanetOption) => option.value;
  protected readonly getPlanetLabel = (option: PlanetOption) => option.label;

  protected readonly plainValue = signal<readonly string[]>(['earth', 'mars', 'neptune']);
  protected readonly tailwindValue = signal<readonly string[]>(['venus', 'uranus']);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainSummary = computed(() => this.resolveLabels(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.resolveLabels(this.tailwindValue()));

  protected readonly componentImportCode =
    "import { TngMultiSelectComponent } from '@tailng-ui/components';";

  protected readonly basicUsageCode = [
    '<tng-multiselect',
    '  [options]="planets"',
    '  [value]="selectedPlanets()"',
    '  (valueChange)="onValueChange($event)"',
    '  [getOptionValue]="getPlanetValue"',
    '  [getOptionLabel]="getPlanetLabel"',
    '  placeholder="Select planets"',
    '></tng-multiselect>',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multiselect-plain-css-overview.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngMultiSelectComponent } from '@tailng-ui/components';",
        '',
        'interface PlanetOption {',
        '  readonly value: string;',
        '  readonly label: string;',
        '  readonly disabled?: boolean;',
        '}',
        '',
        'const PLANETS: readonly PlanetOption[] = [',
        "  { value: 'mercury', label: 'Mercury' },",
        "  { value: 'venus', label: 'Venus' },",
        "  { value: 'earth', label: 'Earth' },",
        "  { value: 'mars', label: 'Mars' },",
        "  { value: 'jupiter', label: 'Jupiter', disabled: true },",
        "  { value: 'uranus', label: 'Uranus' },",
        "  { value: 'neptune', label: 'Neptune' },",
        '];',
        '',
        '@Component({',
        "  selector: 'app-multiselect-plain-css-overview',",
        '  standalone: true,',
        '  imports: [TngMultiSelectComponent],',
        "  templateUrl: './multiselect-plain-css-overview.component.html',",
        "  styleUrl: './multiselect-plain-css-overview.component.css',",
        '})',
        'export class MultiselectPlainCssOverviewComponent {',
        '  readonly planets = PLANETS;',
        "  readonly selectedPlanets = signal<readonly string[]>(['earth', 'mars', 'neptune']);",
        '  readonly getPlanetValue = (o: PlanetOption) => o.value;',
        '  readonly getPlanetLabel = (o: PlanetOption) => o.label;',
        '',
        '  onValueChange(value: unknown): void {',
        '    if (Array.isArray(value)) this.selectedPlanets.set(value);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-plain-css-overview.component.html',
      code: [
        '<section class="shell">',
        '  <div class="header">',
        '    <span class="kicker">Planet picker</span>',
        '    <p class="copy">Wrapper-first multi-selection with a light shell.</p>',
        '  </div>',
        '',
        '  <tng-multiselect',
        '  <div class="control">',
        '    <tng-multiselect',
        '      [options]="planets"',
        '      [value]="selectedPlanets()"',
        '      (valueChange)="onValueChange($event)"',
        '      [getOptionValue]="getPlanetValue"',
        '      [getOptionLabel]="getPlanetLabel"',
        '      placeholder="Select planets"',
        '    ></tng-multiselect>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-plain-css-overview.component.css',
      code: [
        '.shell {',
        '  display: grid; gap: 0.9rem; max-width: 36rem; margin: auto;',
        '  padding: 1.1rem; border: 1px solid var(--tng-semantic-border-subtle); border-radius: 1.25rem;',
        '  background: var(--tng-semantic-background-surface); color: var(--tng-semantic-foreground-primary);',
        '}',
        '',
        '.control {',
        '  width: 100%;',
        '  --tng-select-radius: 1rem;',
        '  --tng-select-trigger-py: 0.8rem;',
        '  --tng-select-trigger-px: 0.95rem;',
        '  --tng-select-option-py: 0.75rem;',
        '  --tng-select-option-px: 0.85rem;',
        '  --tng-select-brand: #2563eb;',
        '  --tng-select-focus-ring: #2563eb;',
        '}',
        '',
        '.control tng-multiselect {',
        '  display: block;',
        '  width: 100%;',
        '  min-width: 0;',
        '}',
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
        "import { Component, signal } from '@angular/core';",
        "import { TngMultiSelectComponent } from '@tailng-ui/components';",
        '',
        'interface PlanetOption {',
        '  readonly value: string;',
        '  readonly label: string;',
        '  readonly disabled?: boolean;',
        '}',
        '',
        'const PLANETS: readonly PlanetOption[] = [',
        "  { value: 'mercury', label: 'Mercury' },",
        "  { value: 'venus', label: 'Venus' },",
        "  { value: 'earth', label: 'Earth' },",
        "  { value: 'mars', label: 'Mars' },",
        "  { value: 'jupiter', label: 'Jupiter', disabled: true },",
        "  { value: 'uranus', label: 'Uranus' },",
        "  { value: 'neptune', label: 'Neptune' },",
        '];',
        '',
        '@Component({',
        "  selector: 'app-multiselect-tailwind-overview',",
        '  standalone: true,',
        '  imports: [TngMultiSelectComponent],',
        "  templateUrl: './multiselect-tailwind-overview.component.html',",
        '})',
        'export class MultiselectTailwindOverviewComponent {',
        '  readonly planets = PLANETS;',
        "  readonly selectedPlanets = signal<readonly string[]>(['venus', 'uranus']);",
        '  readonly getPlanetValue = (o: PlanetOption) => o.value;',
        '  readonly getPlanetLabel = (o: PlanetOption) => o.label;',
        '',
        '  onValueChange(value: unknown): void {',
        '    if (Array.isArray(value)) this.selectedPlanets.set(value);',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multiselect-tailwind-overview.component.html',
      code: [
        '<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
        '  <div class="grid gap-1">',
        '    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Planet picker</span>',
        '    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">Wrapper-first multi-selection with Tailwind utilities.</p>',
        '  </div>',
        '',
        '  <div class="block w-full min-w-0',
        '    [--tng-semantic-accent-brand:#0f766e]',
        '    [--tng-semantic-focus-ring:#0f766e]',
        '    [--tng-select-radius:1rem]',
        '    [--tng-select-trigger-py:0.95rem]',
        '    [--tng-select-trigger-px:1rem]',
        '    [--tng-select-brand:#0f766e]',
        '    [--tng-select-focus-ring:#0f766e]">',
        '    <tng-multiselect',
        '      [options]="planets"',
        '      [value]="selectedPlanets()"',
        '      (valueChange)="onValueChange($event)"',
        '      [getOptionValue]="getPlanetValue"',
        '      [getOptionLabel]="getPlanetLabel"',
        '      placeholder="Select planets"',
        '    ></tng-multiselect>',
        '  </div>',
        '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedPlanets().join(", ") || "none" }}</p>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multiselect-tailwind-overview.component.css',
      code: '/* No additional CSS required. Tailwind utility classes define the shell. */',
    },
  ]);

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
}
