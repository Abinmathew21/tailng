import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multiselect.util';

interface PlanetOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: string;
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

const PRIMITIVE_IMPORT_CODE = String.raw`import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';`;

const BASIC_USAGE_CODE = String.raw`<section
  tngMultiSelect
  [value]="selectedPlanets()"
  (valueChange)="onValueChange($event)"
>
  <button type="button" tngSelectTrigger>
    <span tngSelectValue>{{ selectedSummary() }}</span>
    <span tngSelectIcon aria-hidden="true">▾</span>
  </button>

  <div tngSelectContent>
    <div tngSelectOverlay>
      <ul
        tngMultiSelectListbox
        [multiple]="true"
        [value]="selectedPlanets()"
      >
        @for (planet of planets; track planet.value) {
          <li tngMultiSelectOption [tngValue]="planet.value">{{ planet.label }}</li>
        }
      </ul>
    </div>
  </div>
</section>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
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

interface HeadlessMultiselectOverviewPlainPlanetOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: string;
}

const HEADLESS_MULTISELECT_OVERVIEW_PLAIN_PLANET_OPTIONS: readonly HeadlessMultiselectOverviewPlainPlanetOption[] = Object.freeze([
  { value: 'mercury', label: 'Mercury' },
  { value: 'venus', label: 'Venus' },
  { value: 'earth', label: 'Earth' },
  { value: 'mars', label: 'Mars' },
  { value: 'jupiter', label: 'Jupiter', disabled: true },
  { value: 'uranus', label: 'Uranus' },
  { value: 'neptune', label: 'Neptune' },
]);

@Component({
  selector: 'app-headless-multiselect-overview-plain-example',
  standalone: true,
  imports: [
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  templateUrl: './headless-multiselect-overview-plain-example.component.html',
  styleUrl: './headless-multiselect-overview-plain-example.component.css',
})
export class HeadlessMultiselectOverviewPlainExampleComponent {
  readonly planets = HEADLESS_MULTISELECT_OVERVIEW_PLAIN_PLANET_OPTIONS;
  readonly selectedPlanets = signal<readonly string[]>(['earth', 'mars']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedPlanets();
    if (values.length === 0) return 'Select planets';
    return values
      .map((v) => this.planets.find((p) => p.value === v)?.label ?? v)
      .join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedPlanets.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multiselect-overview-plain-shell">
  <div class="docs-headless-multiselect-overview-plain-header">
    <span class="docs-headless-multiselect-overview-plain-kicker">Planets</span>
    <p class="docs-headless-multiselect-overview-plain-copy">
      Primitive-first multi-selection with an owned trigger and owned overlay rows.
    </p>
  </div>

  <section
    tngMultiSelect
    class="docs-headless-multiselect-overview-plain-root"
    [value]="selectedPlanets()"
    (valueChange)="onValueChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-multiselect-overview-plain-trigger">
      <span tngSelectValue class="docs-headless-multiselect-overview-plain-value">
        {{ selectedSummary() }}
      </span>
      <span tngSelectIcon class="docs-headless-multiselect-overview-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-multiselect-overview-plain-content">
      <div tngSelectOverlay class="docs-headless-multiselect-overview-plain-overlay">
        <ul
          tngMultiSelectListbox
          class="docs-headless-multiselect-overview-plain-listbox"
          [multiple]="true"
          [value]="selectedPlanets()"
        >
          @for (planet of planets; track planet.value) {
            <li
              tngMultiSelectOption
              class="docs-headless-multiselect-overview-plain-option"
              [tngValue]="planet.value"
              [disabled]="planet.disabled === true"
            >
              {{ planet.label }}
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multiselect-overview-plain-summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-multiselect-overview-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-headless-multiselect-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-multiselect-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-multiselect-overview-plain-copy,
.docs-headless-multiselect-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-multiselect-overview-plain-root {
  display: block;
  width: 100%;
}

.docs-headless-multiselect-overview-plain-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}

.docs-headless-multiselect-overview-plain-trigger:hover {
  border-color: #64748b;
}

.docs-headless-multiselect-overview-plain-trigger:focus,
.docs-headless-multiselect-overview-plain-trigger:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}

.docs-headless-multiselect-overview-plain-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-headless-multiselect-overview-plain-icon {
  color: #64748b;
  font-size: 0.75rem;
}

.docs-headless-multiselect-overview-plain-content {
  display: contents;
}

.docs-headless-multiselect-overview-plain-overlay {
  max-inline-size: min(92vw, 36rem);
  border: 1px solid #d8e2ef;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
  padding: 0.4rem;
}

.docs-headless-multiselect-overview-plain-listbox {
  display: grid;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-headless-multiselect-overview-plain-option {
  padding: 0.75rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 0.85rem;
  background: transparent;
  color: #0f172a;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.docs-headless-multiselect-overview-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.docs-headless-multiselect-overview-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #93c5fd;
}

.docs-headless-multiselect-overview-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
}

.docs-headless-multiselect-overview-plain-option[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
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

interface HeadlessMultiselectOverviewTailwindPlanetOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly value: string;
}

const HEADLESS_MULTISELECT_OVERVIEW_TAILWIND_PLANET_OPTIONS: readonly HeadlessMultiselectOverviewTailwindPlanetOption[] = Object.freeze([
  { value: 'mercury', label: 'Mercury' },
  { value: 'venus', label: 'Venus' },
  { value: 'earth', label: 'Earth' },
  { value: 'mars', label: 'Mars' },
  { value: 'jupiter', label: 'Jupiter', disabled: true },
  { value: 'uranus', label: 'Uranus' },
  { value: 'neptune', label: 'Neptune' },
]);

@Component({
  selector: 'app-headless-multiselect-overview-tailwind-example',
  standalone: true,
  imports: [
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  templateUrl: './headless-multiselect-overview-tailwind-example.component.html',
  styleUrl: './headless-multiselect-overview-tailwind-example.component.css',
})
export class HeadlessMultiselectOverviewTailwindExampleComponent {
  readonly planets = HEADLESS_MULTISELECT_OVERVIEW_TAILWIND_PLANET_OPTIONS;
  readonly selectedPlanets = signal<readonly string[]>(['venus', 'neptune']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedPlanets();
    if (values.length === 0) return 'Select planets';
    return values
      .map((v) => this.planets.find((p) => p.value === v)?.label ?? v)
      .join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedPlanets.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Planets</span>
    <p class="m-0 text-sm text-slate-600">
      Primitive-first multi-selection with an owned trigger and owned overlay rows.
    </p>
  </div>

  <section
    tngMultiSelect
    class="block w-full"
    [value]="selectedPlanets()"
    (valueChange)="onValueChange($event)"
  >
    <button
      type="button"
      tngSelectTrigger
      class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
    >
      <span tngSelectValue class="min-w-0 truncate">
        {{ selectedSummary() }}
      </span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
        <ul
          tngMultiSelectListbox
          class="m-0 grid list-none gap-1 p-0"
          [multiple]="true"
          [value]="selectedPlanets()"
        >
          @for (planet of planets; track planet.value) {
            <li
              tngMultiSelectOption
              class="rounded-xl border border-transparent px-4 py-3 text-slate-900 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-emerald-200 data-[selected]:bg-emerald-50 data-[selected]:text-emerald-800 [&[data-selected][data-active]]:border-emerald-400 [&[data-selected][data-active]]:bg-emerald-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="planet.value"
              [disabled]="planet.disabled === true"
            >
              {{ planet.label }}
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

@Component({
  selector: 'app-headless-multiselect-overview-page',
  imports: [
    TngCodeBlockComponent,
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
export class HeadlessMultiselectOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly planetLabelByValue = new Map(
    PLANET_OPTIONS.map((p) => [p.value, p.label]),
  );

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly planets = PLANET_OPTIONS;

  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly overviewPlainSelectedPlanets = signal<readonly string[]>(['earth', 'mars']);
  protected readonly overviewTailwindSelectedPlanets = signal<readonly string[]>(['venus', 'neptune']);

  protected readonly overviewPlainSummary = computed(() => this.resolveLabels(this.overviewPlainSelectedPlanets()));
  protected readonly overviewTailwindSummary = computed(() => this.resolveLabels(this.overviewTailwindSelectedPlanets()));

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-overview-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-overview-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-overview-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-overview-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-overview-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-overview-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onOverviewPlainValueChange(value: unknown): void {
    this.overviewPlainSelectedPlanets.set(this.toValueArray(value));
  }

  protected onOverviewTailwindValueChange(value: unknown): void {
    this.overviewTailwindSelectedPlanets.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values
      .map((v) => this.planetLabelByValue.get(v) ?? v)
      .join(', ');
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
