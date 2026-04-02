import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../autocomplete.util';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

interface RepositoryOption {
  readonly id: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

const INITIAL_REPOSITORY_OPTIONS: readonly RepositoryOption[] = Object.freeze([
  { id: 'tailng-ui', label: 'tailng-ui' },
  { id: 'tailng-docs', label: 'tailng-docs' },
  { id: 'angular-components', label: 'angular/components' },
  { id: 'storybook', label: 'storybook' },
  { id: 'nx-workspace', label: 'nx-workspace' },
]);

const COUNTRY_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface CountryDirectoryPlainOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_DIRECTORY_PLAIN_OPTIONS: readonly CountryDirectoryPlainOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

@Component({
  selector: 'app-headless-country-directory-autocomplete-plain',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-country-directory-autocomplete-plain.component.html',
  styleUrl: './headless-country-directory-autocomplete-plain.component.css',
})
export class HeadlessCountryDirectoryAutocompletePlainComponent {
  readonly countryDirectoryPlainOptions = COUNTRY_DIRECTORY_PLAIN_OPTIONS;
  readonly countryDirectoryPlainOpen = signal(false);
  readonly countryDirectoryPlainValue = signal<string | null>('in');
  readonly countryDirectoryPlainQuery = signal('');

  readonly countryDirectoryPlainFilteredOptions = computed(() => {
    const normalizedQuery = this.countryDirectoryPlainQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.countryDirectoryPlainOptions;
    }

    return this.countryDirectoryPlainOptions.filter((country) =>
      country.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly countryDirectoryPlainSelectedLabel = computed(
    () =>
      this.countryDirectoryPlainOptions.find(
        (country) => country.code === this.countryDirectoryPlainValue(),
      )?.label ?? 'none',
  );

  readonly countryDirectoryPlainDisplayText = computed(() => {
    if (this.countryDirectoryPlainOpen()) {
      return this.countryDirectoryPlainQuery();
    }

    return this.countryDirectoryPlainSelectedLabel() === 'none'
      ? ''
      : this.countryDirectoryPlainSelectedLabel();
  });

  onCountryDirectoryPlainInput(event: Event): void {
    this.countryDirectoryPlainQuery.set((event.target as HTMLInputElement).value);
  }
}
`;

const COUNTRY_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-country-directory-autocomplete-plain">
  <div class="docs-headless-country-directory-autocomplete-plain__header">
    <span class="docs-headless-country-directory-autocomplete-plain__label">Country directory</span>
    <p class="docs-headless-country-directory-autocomplete-plain__copy">
      Search the release locale list and commit with Enter or click.
    </p>
  </div>

  <section
    tngAutocomplete
    class="docs-headless-country-directory-autocomplete-plain__control"
    [open]="countryDirectoryPlainOpen()"
    (openChange)="countryDirectoryPlainOpen.set($event)"
    [value]="countryDirectoryPlainValue()"
    (valueChange)="countryDirectoryPlainValue.set($event)"
    [query]="countryDirectoryPlainQuery()"
    (queryChange)="countryDirectoryPlainQuery.set($event)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="docs-headless-country-directory-autocomplete-plain__trigger"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        [value]="countryDirectoryPlainDisplayText()"
        (input)="onCountryDirectoryPlainInput($event)"
        aria-label="Country directory"
        placeholder="Type Ind to filter"
      />
      <span tngAutocompleteIcon aria-hidden="true">▾</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div tngAutocompleteOverlay class="docs-headless-country-directory-autocomplete-plain__overlay">
        <ul tngAutocompleteListbox [value]="countryDirectoryPlainValue()">
          @for (country of countryDirectoryPlainFilteredOptions(); track country.code) {
            <li
              tngAutocompleteOption
              class="docs-headless-country-directory-autocomplete-plain__option"
              [tngValue]="country.code"
            >
              {{ country.label }}
            </li>
          }
          @if (countryDirectoryPlainFilteredOptions().length === 0) {
            <li data-slot="autocomplete-empty">No matches</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-country-directory-autocomplete-plain__summary">
    Selected: {{ countryDirectoryPlainSelectedLabel() }}
  </p>
</section>
`;

const COUNTRY_PLAIN_CSS_CODE = String.raw`.docs-headless-country-directory-autocomplete-plain {
  display: grid;
  gap: 0.85rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-headless-country-directory-autocomplete-plain__header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-country-directory-autocomplete-plain__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-country-directory-autocomplete-plain__copy,
.docs-headless-country-directory-autocomplete-plain__summary {
  margin: 0;
  color: #475569;
}

.docs-headless-country-directory-autocomplete-plain__control {
  display: grid;
  gap: 0.5rem;
}

.docs-headless-country-directory-autocomplete-plain__trigger {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.9rem;
  background: #ffffff;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.docs-headless-country-directory-autocomplete-plain__trigger:has(:focus-visible) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.docs-headless-country-directory-autocomplete-plain__trigger [data-slot='autocomplete-trigger'] {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #0f172a;
  padding: 0.72rem 1rem;
  outline: none;
}

.docs-headless-country-directory-autocomplete-plain__trigger [data-slot='autocomplete-trigger']::placeholder,
.docs-headless-country-directory-autocomplete-plain__trigger [data-slot='autocomplete-icon'] {
  color: #94a3b8;
}

.docs-headless-country-directory-autocomplete-plain__trigger [data-slot='autocomplete-icon'] {
  margin-inline-end: 1rem;
}

.docs-headless-country-directory-autocomplete-plain__overlay {
  border: 1px solid #cbd5e1;
  border-radius: 0.95rem;
  background: #ffffff;
  max-inline-size: min(92vw, 34rem);
  overflow: auto;
  padding: 0.4rem;
  box-shadow: 0 18px 38px -28px rgba(15, 23, 42, 0.32);
}

.docs-headless-country-directory-autocomplete-plain__overlay [data-slot='autocomplete-listbox'] {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs-headless-country-directory-autocomplete-plain__option {
  border: 1px solid transparent;
  border-radius: 0.75rem;
  padding: 0.7rem 0.85rem;
  color: #334155;
}

.docs-headless-country-directory-autocomplete-plain__option[data-active] {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.docs-headless-country-directory-autocomplete-plain__option[data-selected] {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
  font-weight: 600;
}
`;

const COUNTRY_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface CountryDirectoryTailwindOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_DIRECTORY_TAILWIND_OPTIONS: readonly CountryDirectoryTailwindOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

@Component({
  selector: 'app-headless-country-directory-autocomplete-tailwind',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-country-directory-autocomplete-tailwind.component.html',
  styleUrl: './headless-country-directory-autocomplete-tailwind.component.css',
})
export class HeadlessCountryDirectoryAutocompleteTailwindComponent {
  readonly countryDirectoryTailwindOptions = COUNTRY_DIRECTORY_TAILWIND_OPTIONS;
  readonly countryDirectoryTailwindOpen = signal(false);
  readonly countryDirectoryTailwindValue = signal<string | null>('id');
  readonly countryDirectoryTailwindQuery = signal('');

  readonly countryDirectoryTailwindFilteredOptions = computed(() => {
    const normalizedQuery = this.countryDirectoryTailwindQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.countryDirectoryTailwindOptions;
    }

    return this.countryDirectoryTailwindOptions.filter((country) =>
      country.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly countryDirectoryTailwindSelectedLabel = computed(
    () =>
      this.countryDirectoryTailwindOptions.find(
        (country) => country.code === this.countryDirectoryTailwindValue(),
      )?.label ?? 'none',
  );

  readonly countryDirectoryTailwindDisplayText = computed(() => {
    if (this.countryDirectoryTailwindOpen()) {
      return this.countryDirectoryTailwindQuery();
    }

    return this.countryDirectoryTailwindSelectedLabel() === 'none'
      ? ''
      : this.countryDirectoryTailwindSelectedLabel();
  });

  onCountryDirectoryTailwindInput(event: Event): void {
    this.countryDirectoryTailwindQuery.set((event.target as HTMLInputElement).value);
  }
}
`;

const COUNTRY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-slate-500">Country directory</span>
    <p class="m-0 text-sm text-slate-600">
      Search the release locale list and commit with Enter or click.
    </p>
  </div>

  <section
    tngAutocomplete
    class="grid gap-2"
    [open]="countryDirectoryTailwindOpen()"
    (openChange)="countryDirectoryTailwindOpen.set($event)"
    [value]="countryDirectoryTailwindValue()"
    (valueChange)="countryDirectoryTailwindValue.set($event)"
    [query]="countryDirectoryTailwindQuery()"
    (queryChange)="countryDirectoryTailwindQuery.set($event)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        [value]="countryDirectoryTailwindDisplayText()"
        (input)="onCountryDirectoryTailwindInput($event)"
        aria-label="Country directory"
        placeholder="Type Ind to filter"
      />
      <span tngAutocompleteIcon aria-hidden="true" class="mr-4 text-slate-400">▾</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div
        tngAutocompleteOverlay
        class="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10"
      >
        <ul tngAutocompleteListbox [value]="countryDirectoryTailwindValue()" class="grid gap-1">
          @for (country of countryDirectoryTailwindFilteredOptions(); track country.code) {
            <li
              tngAutocompleteOption
              class="rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:font-semibold data-[selected]:text-blue-700"
              [tngValue]="country.code"
            >
              {{ country.label }}
            </li>
          }
          @if (countryDirectoryTailwindFilteredOptions().length === 0) {
            <li data-slot="autocomplete-empty" class="px-3 py-2 text-sm text-slate-500">No matches</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ countryDirectoryTailwindSelectedLabel() }}</p>
</section>
`;

const COUNTRY_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

const REPOSITORY_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface RepositoryCreatePlainOption {
  readonly id: string;
  readonly label: string;
}

const REPOSITORY_CREATE_PLAIN_OPTIONS: readonly RepositoryCreatePlainOption[] = Object.freeze([
  { id: 'tailng-ui', label: 'tailng-ui' },
  { id: 'tailng-docs', label: 'tailng-docs' },
  { id: 'angular-components', label: 'angular/components' },
  { id: 'storybook', label: 'storybook' },
  { id: 'nx-workspace', label: 'nx-workspace' },
]);

@Component({
  selector: 'app-headless-repository-create-autocomplete-plain',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-repository-create-autocomplete-plain.component.html',
  styleUrl: './headless-repository-create-autocomplete-plain.component.css',
})
export class HeadlessRepositoryCreateAutocompletePlainComponent {
  readonly repositoryCreatePlainOptions = signal<readonly RepositoryCreatePlainOption[]>(
    REPOSITORY_CREATE_PLAIN_OPTIONS,
  );
  readonly repositoryCreatePlainOpen = signal(false);
  readonly repositoryCreatePlainValue = signal<string | null>('tailng-ui');
  readonly repositoryCreatePlainQuery = signal('');

  readonly repositoryCreatePlainFilteredOptions = computed(() => {
    const normalizedQuery = this.repositoryCreatePlainQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.repositoryCreatePlainOptions();
    }

    return this.repositoryCreatePlainOptions().filter((repository) =>
      repository.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly repositoryCreatePlainSelectedLabel = computed(
    () =>
      this.repositoryCreatePlainOptions().find(
        (repository) => repository.id === this.repositoryCreatePlainValue(),
      )?.label ?? 'none',
  );

  readonly repositoryCreatePlainDisplayText = computed(() => {
    if (this.repositoryCreatePlainOpen()) {
      return this.repositoryCreatePlainQuery();
    }

    return this.repositoryCreatePlainSelectedLabel() === 'none'
      ? ''
      : this.repositoryCreatePlainSelectedLabel();
  });

  onRepositoryCreatePlainInput(event: Event): void {
    this.repositoryCreatePlainQuery.set((event.target as HTMLInputElement).value);
  }

  onRepositoryCreatePlain(query: string): void {
    const trimmed = query.trim();
    if (trimmed === '') {
      return;
    }

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (id === '') {
      return;
    }

    const existing = this.repositoryCreatePlainOptions().find((repository) => repository.id === id);
    if (existing) {
      this.repositoryCreatePlainValue.set(existing.id);
      this.repositoryCreatePlainOpen.set(false);
      this.repositoryCreatePlainQuery.set('');
      return;
    }

    const nextRepository = { id, label: trimmed };
    this.repositoryCreatePlainOptions.set([
      ...this.repositoryCreatePlainOptions(),
      nextRepository,
    ]);
    this.repositoryCreatePlainValue.set(nextRepository.id);
    this.repositoryCreatePlainOpen.set(false);
    this.repositoryCreatePlainQuery.set('');
  }
}
`;

const REPOSITORY_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-repository-create-autocomplete-plain">
  <div class="docs-headless-repository-create-autocomplete-plain__header">
    <span class="docs-headless-repository-create-autocomplete-plain__label">Repository search</span>
    <p class="docs-headless-repository-create-autocomplete-plain__copy">
      Type to filter, or press Enter to create a new repository tag when there is no active match.
    </p>
  </div>

  <section
    tngAutocomplete
    class="docs-headless-repository-create-autocomplete-plain__control"
    [open]="repositoryCreatePlainOpen()"
    (openChange)="repositoryCreatePlainOpen.set($event)"
    [value]="repositoryCreatePlainValue()"
    (valueChange)="repositoryCreatePlainValue.set($event)"
    [query]="repositoryCreatePlainQuery()"
    (queryChange)="repositoryCreatePlainQuery.set($event)"
    [allowCreate]="true"
    [strict]="false"
    (create)="onRepositoryCreatePlain($event.query)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="docs-headless-repository-create-autocomplete-plain__trigger"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        [value]="repositoryCreatePlainDisplayText()"
        (input)="onRepositoryCreatePlainInput($event)"
        aria-label="Repository search"
        placeholder="Search or create repository"
      />
      <span tngAutocompleteIcon aria-hidden="true">＋</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div tngAutocompleteOverlay class="docs-headless-repository-create-autocomplete-plain__overlay">
        <ul tngAutocompleteListbox [value]="repositoryCreatePlainValue()">
          @for (repository of repositoryCreatePlainFilteredOptions(); track repository.id) {
            <li
              tngAutocompleteOption
              class="docs-headless-repository-create-autocomplete-plain__option"
              [tngValue]="repository.id"
            >
              {{ repository.label }}
            </li>
          }
          @if (repositoryCreatePlainFilteredOptions().length === 0) {
            <li data-slot="autocomplete-empty">Press Enter to create “{{ repositoryCreatePlainQuery() }}”.</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-repository-create-autocomplete-plain__summary">
    Selected: {{ repositoryCreatePlainSelectedLabel() }}
  </p>
</section>
`;

const REPOSITORY_PLAIN_CSS_CODE = String.raw`.docs-headless-repository-create-autocomplete-plain {
  display: grid;
  gap: 0.85rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-headless-repository-create-autocomplete-plain__header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-repository-create-autocomplete-plain__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-repository-create-autocomplete-plain__copy,
.docs-headless-repository-create-autocomplete-plain__summary {
  margin: 0;
  color: #475569;
}

.docs-headless-repository-create-autocomplete-plain__control {
  display: grid;
  gap: 0.5rem;
}

.docs-headless-repository-create-autocomplete-plain__trigger {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.9rem;
  background: #ffffff;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.docs-headless-repository-create-autocomplete-plain__trigger:has(:focus-visible) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.docs-headless-repository-create-autocomplete-plain__trigger [data-slot='autocomplete-trigger'] {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #0f172a;
  padding: 0.72rem 1rem;
  outline: none;
}

.docs-headless-repository-create-autocomplete-plain__trigger [data-slot='autocomplete-trigger']::placeholder,
.docs-headless-repository-create-autocomplete-plain__trigger [data-slot='autocomplete-icon'] {
  color: #94a3b8;
}

.docs-headless-repository-create-autocomplete-plain__trigger [data-slot='autocomplete-icon'] {
  margin-inline-end: 1rem;
}

.docs-headless-repository-create-autocomplete-plain__overlay {
  border: 1px solid #cbd5e1;
  border-radius: 0.95rem;
  background: #ffffff;
  max-inline-size: min(92vw, 34rem);
  overflow: auto;
  padding: 0.4rem;
  box-shadow: 0 18px 38px -28px rgba(15, 23, 42, 0.32);
}

.docs-headless-repository-create-autocomplete-plain__overlay [data-slot='autocomplete-listbox'] {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs-headless-repository-create-autocomplete-plain__option {
  border: 1px solid transparent;
  border-radius: 0.75rem;
  padding: 0.7rem 0.85rem;
  color: #334155;
}

.docs-headless-repository-create-autocomplete-plain__option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.docs-headless-repository-create-autocomplete-plain__option[data-selected] {
  background: #ecfeff;
  border-color: #67e8f9;
  color: #155e75;
  font-weight: 600;
}
`;

const REPOSITORY_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
} from '@tailng-ui/primitives';

interface RepositoryCreateTailwindOption {
  readonly id: string;
  readonly label: string;
}

const REPOSITORY_CREATE_TAILWIND_OPTIONS: readonly RepositoryCreateTailwindOption[] = Object.freeze([
  { id: 'tailng-ui', label: 'tailng-ui' },
  { id: 'tailng-docs', label: 'tailng-docs' },
  { id: 'angular-components', label: 'angular/components' },
  { id: 'storybook', label: 'storybook' },
  { id: 'nx-workspace', label: 'nx-workspace' },
]);

@Component({
  selector: 'app-headless-repository-create-autocomplete-tailwind',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-repository-create-autocomplete-tailwind.component.html',
  styleUrl: './headless-repository-create-autocomplete-tailwind.component.css',
})
export class HeadlessRepositoryCreateAutocompleteTailwindComponent {
  readonly repositoryCreateTailwindOptions = signal<readonly RepositoryCreateTailwindOption[]>(
    REPOSITORY_CREATE_TAILWIND_OPTIONS,
  );
  readonly repositoryCreateTailwindOpen = signal(false);
  readonly repositoryCreateTailwindValue = signal<string | null>('tailng-docs');
  readonly repositoryCreateTailwindQuery = signal('');

  readonly repositoryCreateTailwindFilteredOptions = computed(() => {
    const normalizedQuery = this.repositoryCreateTailwindQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.repositoryCreateTailwindOptions();
    }

    return this.repositoryCreateTailwindOptions().filter((repository) =>
      repository.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly repositoryCreateTailwindSelectedLabel = computed(
    () =>
      this.repositoryCreateTailwindOptions().find(
        (repository) => repository.id === this.repositoryCreateTailwindValue(),
      )?.label ?? 'none',
  );

  readonly repositoryCreateTailwindDisplayText = computed(() => {
    if (this.repositoryCreateTailwindOpen()) {
      return this.repositoryCreateTailwindQuery();
    }

    return this.repositoryCreateTailwindSelectedLabel() === 'none'
      ? ''
      : this.repositoryCreateTailwindSelectedLabel();
  });

  onRepositoryCreateTailwindInput(event: Event): void {
    this.repositoryCreateTailwindQuery.set((event.target as HTMLInputElement).value);
  }

  onRepositoryCreateTailwind(query: string): void {
    const trimmed = query.trim();
    if (trimmed === '') {
      return;
    }

    const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (id === '') {
      return;
    }

    const existing = this.repositoryCreateTailwindOptions().find((repository) => repository.id === id);
    if (existing) {
      this.repositoryCreateTailwindValue.set(existing.id);
      this.repositoryCreateTailwindOpen.set(false);
      this.repositoryCreateTailwindQuery.set('');
      return;
    }

    const nextRepository = { id, label: trimmed };
    this.repositoryCreateTailwindOptions.set([
      ...this.repositoryCreateTailwindOptions(),
      nextRepository,
    ]);
    this.repositoryCreateTailwindValue.set(nextRepository.id);
    this.repositoryCreateTailwindOpen.set(false);
    this.repositoryCreateTailwindQuery.set('');
  }
}
`;

const REPOSITORY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-slate-500">Repository search</span>
    <p class="m-0 text-sm text-slate-600">
      Type to filter, or press Enter to create a new repository tag when there is no active match.
    </p>
  </div>

  <section
    tngAutocomplete
    class="grid gap-2"
    [open]="repositoryCreateTailwindOpen()"
    (openChange)="repositoryCreateTailwindOpen.set($event)"
    [value]="repositoryCreateTailwindValue()"
    (valueChange)="repositoryCreateTailwindValue.set($event)"
    [query]="repositoryCreateTailwindQuery()"
    (queryChange)="repositoryCreateTailwindQuery.set($event)"
    [allowCreate]="true"
    [strict]="false"
    (create)="onRepositoryCreateTailwind($event.query)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        [value]="repositoryCreateTailwindDisplayText()"
        (input)="onRepositoryCreateTailwindInput($event)"
        aria-label="Repository search"
        placeholder="Search or create repository"
      />
      <span tngAutocompleteIcon aria-hidden="true" class="mr-4 text-slate-400">＋</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div
        tngAutocompleteOverlay
        class="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10"
      >
        <ul tngAutocompleteListbox [value]="repositoryCreateTailwindValue()" class="grid gap-1">
          @for (repository of repositoryCreateTailwindFilteredOptions(); track repository.id) {
            <li
              tngAutocompleteOption
              class="rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-cyan-200 data-[selected]:bg-cyan-50 data-[selected]:font-semibold data-[selected]:text-cyan-700"
              [tngValue]="repository.id"
            >
              {{ repository.label }}
            </li>
          }
          @if (repositoryCreateTailwindFilteredOptions().length === 0) {
            <li data-slot="autocomplete-empty" class="px-3 py-2 text-sm text-slate-500">Press Enter to create “{{ repositoryCreateTailwindQuery() }}”.</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ repositoryCreateTailwindSelectedLabel() }}</p>
</section>
`;

const REPOSITORY_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

function resolveCountryLabel(value: string | null): string {
  return COUNTRY_OPTIONS.find((country) => country.code === value)?.label ?? 'none';
}

function filterCountries(query: string): readonly CountryOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return COUNTRY_OPTIONS;
  }

  return COUNTRY_OPTIONS.filter((country) => country.label.toLowerCase().includes(normalizedQuery));
}

function resolveRepositoryLabel(
  options: readonly RepositoryOption[],
  value: string | null,
): string {
  return options.find((repository) => repository.id === value)?.label ?? 'none';
}

function filterRepositories(
  options: readonly RepositoryOption[],
  query: string,
): readonly RepositoryOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return options;
  }

  return options.filter((repository) =>
    repository.label.toLowerCase().includes(normalizedQuery),
  );
}

function createRepositoryOption(
  options: readonly RepositoryOption[],
  query: string,
): { nextOptions: readonly RepositoryOption[]; nextValue: string | null } | null {
  const trimmed = query.trim();
  if (trimmed === '') {
    return null;
  }

  const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (id === '') {
    return null;
  }

  const existing = options.find((repository) => repository.id === id);
  if (existing) {
    return { nextOptions: options, nextValue: existing.id };
  }

  const nextRepository = { id, label: trimmed };
  return {
    nextOptions: [...options, nextRepository],
    nextValue: nextRepository.id,
  };
}

@Component({
  selector: 'app-headless-autocomplete-examples-page',
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './headless-autocomplete-examples-page.component.html',
  styleUrl: './headless-autocomplete-examples-page.component.css',
})
export class HeadlessAutocompleteExamplesPageComponent implements OnDestroy {
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

  protected readonly plainCountryOpen = signal(false);
  protected readonly plainCountryValue = signal<string | null>('in');
  protected readonly plainCountryQuery = signal('');
  protected readonly tailwindCountryOpen = signal(false);
  protected readonly tailwindCountryValue = signal<string | null>('id');
  protected readonly tailwindCountryQuery = signal('');

  protected readonly plainRepositoryOptions = signal<readonly RepositoryOption[]>(
    INITIAL_REPOSITORY_OPTIONS,
  );
  protected readonly plainRepositoryOpen = signal(false);
  protected readonly plainRepositoryValue = signal<string | null>('tailng-ui');
  protected readonly plainRepositoryQuery = signal('');
  protected readonly tailwindRepositoryOptions = signal<readonly RepositoryOption[]>(
    INITIAL_REPOSITORY_OPTIONS,
  );
  protected readonly tailwindRepositoryOpen = signal(false);
  protected readonly tailwindRepositoryValue = signal<string | null>('tailng-docs');
  protected readonly tailwindRepositoryQuery = signal('');

  protected readonly plainCountryFiltered = computed(() =>
    filterCountries(this.plainCountryQuery()),
  );
  protected readonly tailwindCountryFiltered = computed(() =>
    filterCountries(this.tailwindCountryQuery()),
  );
  protected readonly plainCountrySelectedLabel = computed(() =>
    resolveCountryLabel(this.plainCountryValue()),
  );
  protected readonly tailwindCountrySelectedLabel = computed(() =>
    resolveCountryLabel(this.tailwindCountryValue()),
  );
  protected readonly plainCountryDisplayText = computed(() =>
    this.plainCountryOpen() ? this.plainCountryQuery() : this.plainCountrySelectedLabel() === 'none' ? '' : this.plainCountrySelectedLabel(),
  );
  protected readonly tailwindCountryDisplayText = computed(() =>
    this.tailwindCountryOpen() ? this.tailwindCountryQuery() : this.tailwindCountrySelectedLabel() === 'none' ? '' : this.tailwindCountrySelectedLabel(),
  );

  protected readonly plainRepositoryFiltered = computed(() =>
    filterRepositories(this.plainRepositoryOptions(), this.plainRepositoryQuery()),
  );
  protected readonly tailwindRepositoryFiltered = computed(() =>
    filterRepositories(this.tailwindRepositoryOptions(), this.tailwindRepositoryQuery()),
  );
  protected readonly plainRepositorySelectedLabel = computed(() =>
    resolveRepositoryLabel(this.plainRepositoryOptions(), this.plainRepositoryValue()),
  );
  protected readonly tailwindRepositorySelectedLabel = computed(() =>
    resolveRepositoryLabel(this.tailwindRepositoryOptions(), this.tailwindRepositoryValue()),
  );
  protected readonly plainRepositoryDisplayText = computed(() =>
    this.plainRepositoryOpen() ? this.plainRepositoryQuery() : this.plainRepositorySelectedLabel() === 'none' ? '' : this.plainRepositorySelectedLabel(),
  );
  protected readonly tailwindRepositoryDisplayText = computed(() =>
    this.tailwindRepositoryOpen() ? this.tailwindRepositoryQuery() : this.tailwindRepositorySelectedLabel() === 'none' ? '' : this.tailwindRepositorySelectedLabel(),
  );

  protected readonly countryPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-country-directory-autocomplete-plain.component.ts',
      code: COUNTRY_PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-country-directory-autocomplete-plain.component.html',
      code: COUNTRY_PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-country-directory-autocomplete-plain.component.css',
      code: COUNTRY_PLAIN_CSS_CODE,
    },
  ]);

  protected readonly countryTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-country-directory-autocomplete-tailwind.component.ts',
      code: COUNTRY_TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-country-directory-autocomplete-tailwind.component.html',
      code: COUNTRY_TAILWIND_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-country-directory-autocomplete-tailwind.component.css',
      code: COUNTRY_TAILWIND_CSS_CODE,
    },
  ]);

  protected readonly repositoryPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-repository-create-autocomplete-plain.component.ts',
      code: REPOSITORY_PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-repository-create-autocomplete-plain.component.html',
      code: REPOSITORY_PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-repository-create-autocomplete-plain.component.css',
      code: REPOSITORY_PLAIN_CSS_CODE,
    },
  ]);

  protected readonly repositoryTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-repository-create-autocomplete-tailwind.component.ts',
      code: REPOSITORY_TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-repository-create-autocomplete-tailwind.component.html',
      code: REPOSITORY_TAILWIND_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-repository-create-autocomplete-tailwind.component.css',
      code: REPOSITORY_TAILWIND_CSS_CODE,
    },
  ]);

  protected onPlainCountryInput(event: Event): void {
    this.plainCountryQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindCountryInput(event: Event): void {
    this.tailwindCountryQuery.set((event.target as HTMLInputElement).value);
  }

  protected onPlainRepositoryInput(event: Event): void {
    this.plainRepositoryQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindRepositoryInput(event: Event): void {
    this.tailwindRepositoryQuery.set((event.target as HTMLInputElement).value);
  }

  protected onPlainRepositoryCreate(query: string): void {
    const next = createRepositoryOption(this.plainRepositoryOptions(), query);
    if (next === null) {
      return;
    }

    this.plainRepositoryOptions.set(next.nextOptions);
    this.plainRepositoryValue.set(next.nextValue);
    this.plainRepositoryOpen.set(false);
    this.plainRepositoryQuery.set('');
  }

  protected onTailwindRepositoryCreate(query: string): void {
    const next = createRepositoryOption(this.tailwindRepositoryOptions(), query);
    if (next === null) {
      return;
    }

    this.tailwindRepositoryOptions.set(next.nextOptions);
    this.tailwindRepositoryValue.set(next.nextValue);
    this.tailwindRepositoryOpen.set(false);
    this.tailwindRepositoryQuery.set('');
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
