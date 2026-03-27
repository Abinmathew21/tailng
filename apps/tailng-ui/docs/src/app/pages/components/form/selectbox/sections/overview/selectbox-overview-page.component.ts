import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent, TngSelectComponent } from '@tailng-ui/components';
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
  selector: 'app-selectbox-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './selectbox-overview-page.component.html',
  styleUrl: './selectbox-overview-page.component.css',
})
export class SelectboxOverviewPageComponent implements OnDestroy {
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

  protected readonly headlessValue = signal<string | null>('earth');
  protected readonly plainValue = signal<string | null>('mars');
  protected readonly tailwindValue = signal<string | null>('venus');

  protected readonly headlessSummary = computed(
    () => this.optionLabelByValue.get(this.headlessValue() ?? '') ?? 'none',
  );
  protected readonly plainSummary = computed(
    () => this.optionLabelByValue.get(this.plainValue() ?? '') ?? 'none',
  );
  protected readonly tailwindSummary = computed(
    () => this.optionLabelByValue.get(this.tailwindValue() ?? '') ?? 'none',
  );

  protected readonly primitiveImportCode = [
    'import {',
    '  TngSelect,',
    '  TngSelectTrigger,',
    '  TngSelectValue,',
    '  TngSelectIcon,',
    '  TngSelectContent,',
    '  TngSelectOverlay,',
    '  TngSelectListbox,',
    '  TngSelectOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngSelectComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'selectbox-headless-overview.component.ts',
      code: [
        "readonly selectedPlanet = signal<string | null>('earth');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanet.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-headless-overview.component.html',
      code: [
        '<section tngSelect [value]="selectedPlanet()" (valueChange)="onValueChange($event)">',
        '  <button #trigger tngSelectTrigger type="button">',
        '    <span tngSelectValue>{{ selectedLabel() }}</span>',
        '    <span tngSelectIcon aria-hidden="true">▾</span>',
        '  </button>',
        '  <div tngSelectContent>',
        '    <div tngSelectOverlay [style.minWidth.px]="trigger.offsetWidth">',
        '      <ul tngSelectListbox>',
        '        @for (planet of planets; track planet.value) {',
        '          <li tngSelectOption [tngValue]="planet.value" [disabled]="planet.disabled === true">',
        '            {{ planet.label }}',
        '          </li>',
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
      title: 'selectbox-headless-overview.component.css',
      code: [
        '.selectbox-preview-control {',
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
      title: 'selectbox-plain-css-overview.component.ts',
      code: [
        "readonly selectedPlanet = signal<string | null>('mars');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanet.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-plain-css-overview.component.html',
      code: [
        '<div class="selectbox-preview-shell selectbox-preview-shell--plain">',
        '  <tng-select',
        '    [options]="planets"',
        '    [value]="selectedPlanet()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getPlanetValue"',
        '    [getOptionLabel]="getPlanetLabel"',
        '    placeholder="Select a planet"',
        '    aria-label="Plain CSS planet select"',
        '  ></tng-select>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'selectbox-plain-css-overview.component.css',
      code: [
        '.selectbox-preview-shell--plain {',
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
      title: 'selectbox-tailwind-overview.component.ts',
      code: [
        "readonly selectedPlanet = signal<string | null>('venus');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedPlanet.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'selectbox-tailwind-overview.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-select',
        '    [options]="planets"',
        '    [value]="selectedPlanet()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getPlanetValue"',
        '    [getOptionLabel]="getPlanetLabel"',
        '    placeholder="Select a planet"',
        '    aria-label="Tailwind planet select"',
        '  ></tng-select>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'selectbox-tailwind-overview.component.css',
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveLabel(value: string | null): string {
    if (value === null) {
      return 'Select a planet';
    }

    return this.optionLabelByValue.get(value) ?? 'Select a planet';
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
