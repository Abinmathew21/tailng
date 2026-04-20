import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';
import { TngChipsComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../chips.util';

const FILTER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_EXAMPLES_PLAIN_FILTER_VALUES = Object.freeze([
  'Accessibility',
  'API docs',
  'Release notes',
]);

@Component({
  selector: 'app-component-chips-examples-filter-plain',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-examples-filter-plain.component.html',
  styleUrl: './component-chips-examples-filter-plain.component.css',
})
export class ComponentChipsExamplesFilterPlainComponent {
  readonly componentChipsExamplesPlainFilterValues = signal<readonly string[]>(
    COMPONENT_CHIPS_EXAMPLES_PLAIN_FILTER_VALUES,
  );
  readonly componentChipsExamplesPlainFilterSummary = computed(() => {
    const values = this.componentChipsExamplesPlainFilterValues();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsExamplesPlainFilterValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsExamplesPlainFilterValues.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const FILTER_PLAIN_HTML_CODE = String.raw`<section class="docs-component-chips-examples-filter-plain-shell">
  <div class="docs-component-chips-examples-filter-plain-header">
    <span class="docs-component-chips-examples-filter-plain-kicker">Active filters</span>
    <p class="docs-component-chips-examples-filter-plain-copy">
      Keep a controlled filter list while the wrapper handles the root semantics and chip removal events.
    </p>
  </div>

  <div class="docs-component-chips-examples-filter-plain-control">
    <tng-chips
      [values]="componentChipsExamplesPlainFilterValues()"
      (valuesChange)="onComponentChipsExamplesPlainFilterValuesChange($event)"
      [ariaLabel]="'Active filters'"
    >
      <div class="docs-component-chips-examples-filter-plain-row">
        @for (filter of componentChipsExamplesPlainFilterValues(); track filter) {
          <span tngChip [tngChipValue]="filter" [tngChipLabel]="filter" class="docs-component-chips-examples-filter-plain-chip">
            <span>{{ filter }}</span>
            <button tngChipRemove type="button" class="docs-component-chips-examples-filter-plain-chip-remove">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="docs-component-chips-examples-filter-plain-summary">Selected: {{ componentChipsExamplesPlainFilterSummary() }}</p>
</section>`;

const FILTER_PLAIN_CSS_CODE = String.raw`.docs-component-chips-examples-filter-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-chips-examples-filter-plain-control {
  width: 100%;
  min-width: 0;
}

.docs-component-chips-examples-filter-plain-control tng-chips {
  display: block;
  width: 100%;
  min-width: 0;
}

.docs-component-chips-examples-filter-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-component-chips-examples-filter-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-brand) 42%, var(--tng-semantic-border-subtle));
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-base));
  color: var(--tng-semantic-foreground-primary);
  padding: 0.45rem 0.8rem;
}

.docs-component-chips-examples-filter-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 16%, transparent);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0;
}`;

const FILTER_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_EXAMPLES_TAILWIND_FILTER_VALUES = Object.freeze([
  'Registry',
  'Docs',
  'CLI',
]);

@Component({
  selector: 'app-component-chips-examples-filter-tailwind',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-examples-filter-tailwind.component.html',
  styleUrl: './component-chips-examples-filter-tailwind.component.css',
})
export class ComponentChipsExamplesFilterTailwindComponent {
  readonly componentChipsExamplesTailwindFilterValues = signal<readonly string[]>(
    COMPONENT_CHIPS_EXAMPLES_TAILWIND_FILTER_VALUES,
  );
  readonly componentChipsExamplesTailwindFilterSummary = computed(() => {
    const values = this.componentChipsExamplesTailwindFilterValues();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsExamplesTailwindFilterValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsExamplesTailwindFilterValues.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const FILTER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Active filters</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Keep a controlled filter list while the wrapper handles the root semantics and chip removal events.
    </p>
  </div>

  <div class="block w-full min-w-0">
    <tng-chips
      [values]="componentChipsExamplesTailwindFilterValues()"
      (valuesChange)="onComponentChipsExamplesTailwindFilterValuesChange($event)"
      [ariaLabel]="'Active filters'"
    >
      <div class="flex flex-wrap gap-2">
        @for (filter of componentChipsExamplesTailwindFilterValues(); track filter) {
          <span tngChip [tngChipValue]="filter" [tngChipLabel]="filter" class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_42%,var(--tng-semantic-border-subtle))] bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_12%,var(--tng-semantic-background-base))] px-3 py-2 text-sm font-medium text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--tng-semantic-background-surface)_72%,transparent)]">
            <span>{{ filter }}</span>
            <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_16%,transparent)] text-[0.8rem] leading-none text-[var(--tng-semantic-foreground-secondary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_24%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)]">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentChipsExamplesTailwindFilterSummary() }}</p>
</section>`;

const FILTER_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

const LOCKED_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_EXAMPLES_PLAIN_RELEASE_LANES = Object.freeze([
  'Stable',
  'Preview',
  'Locked',
]);

@Component({
  selector: 'app-component-chips-examples-locked-plain',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-examples-locked-plain.component.html',
  styleUrl: './component-chips-examples-locked-plain.component.css',
})
export class ComponentChipsExamplesLockedPlainComponent {
  readonly componentChipsExamplesPlainReleaseLanes = signal<readonly string[]>(
    COMPONENT_CHIPS_EXAMPLES_PLAIN_RELEASE_LANES,
  );
  readonly componentChipsExamplesPlainReleaseLaneSummary = computed(() => {
    const values = this.componentChipsExamplesPlainReleaseLanes();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsExamplesPlainReleaseLanesChange(nextValues: readonly unknown[]): void {
    this.componentChipsExamplesPlainReleaseLanes.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isComponentChipsExamplesPlainReleaseLaneLocked(lane: string): boolean {
    return lane === 'Locked';
  }
}`;

const LOCKED_PLAIN_HTML_CODE = String.raw`<section class="docs-component-chips-examples-locked-plain-shell">
  <div class="docs-component-chips-examples-locked-plain-header">
    <span class="docs-component-chips-examples-locked-plain-kicker">Release lanes</span>
    <p class="docs-component-chips-examples-locked-plain-copy">
      Disabled chips stay visible, but only active lanes remain removable.
    </p>
  </div>

  <div class="docs-component-chips-examples-locked-plain-control">
    <tng-chips
      [values]="componentChipsExamplesPlainReleaseLanes()"
      (valuesChange)="onComponentChipsExamplesPlainReleaseLanesChange($event)"
      [ariaLabel]="'Release lanes'"
    >
      <div class="docs-component-chips-examples-locked-plain-row">
        @for (lane of componentChipsExamplesPlainReleaseLanes(); track lane) {
          <span
            tngChip
            [tngChipValue]="lane"
            [tngChipLabel]="lane"
            [tngChipDisabled]="isComponentChipsExamplesPlainReleaseLaneLocked(lane)"
            class="docs-component-chips-examples-locked-plain-chip"
          >
            <span>{{ lane }}</span>
            <button tngChipRemove type="button" class="docs-component-chips-examples-locked-plain-chip-remove">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="docs-component-chips-examples-locked-plain-summary">Selected: {{ componentChipsExamplesPlainReleaseLaneSummary() }}</p>
</section>`;

const LOCKED_PLAIN_CSS_CODE = String.raw`.docs-component-chips-examples-locked-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-chips-examples-locked-plain-control {
  width: 100%;
  min-width: 0;
}

.docs-component-chips-examples-locked-plain-control tng-chips {
  display: block;
  width: 100%;
  min-width: 0;
}

.docs-component-chips-examples-locked-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-component-chips-examples-locked-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--tng-semantic-accent-success) 42%, var(--tng-semantic-border-subtle));
  background: color-mix(in srgb, var(--tng-semantic-accent-success) 12%, var(--tng-semantic-background-base));
  color: var(--tng-semantic-foreground-primary);
  padding: 0.45rem 0.8rem;
}

.docs-component-chips-examples-locked-plain-chip[data-disabled] {
  border-color: var(--tng-semantic-border-subtle);
  background: var(--tng-semantic-background-muted);
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-chips-examples-locked-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tng-semantic-accent-success) 18%, transparent);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0;
}`;

const LOCKED_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_EXAMPLES_TAILWIND_RELEASE_LANES = Object.freeze([
  'Stable',
  'Preview',
  'Canary',
]);

@Component({
  selector: 'app-component-chips-examples-locked-tailwind',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-examples-locked-tailwind.component.html',
  styleUrl: './component-chips-examples-locked-tailwind.component.css',
})
export class ComponentChipsExamplesLockedTailwindComponent {
  readonly componentChipsExamplesTailwindReleaseLanes = signal<readonly string[]>(
    COMPONENT_CHIPS_EXAMPLES_TAILWIND_RELEASE_LANES,
  );
  readonly componentChipsExamplesTailwindReleaseLaneSummary = computed(() => {
    const values = this.componentChipsExamplesTailwindReleaseLanes();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsExamplesTailwindReleaseLanesChange(nextValues: readonly unknown[]): void {
    this.componentChipsExamplesTailwindReleaseLanes.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isComponentChipsExamplesTailwindReleaseLaneLocked(lane: string): boolean {
    return lane === 'Canary';
  }
}`;

const LOCKED_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Release lanes</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Disabled chips stay visible, but only active lanes remain removable.
    </p>
  </div>

  <div class="block w-full min-w-0">
    <tng-chips
      [values]="componentChipsExamplesTailwindReleaseLanes()"
      (valuesChange)="onComponentChipsExamplesTailwindReleaseLanesChange($event)"
      [ariaLabel]="'Release lanes'"
    >
      <div class="flex flex-wrap gap-2">
        @for (lane of componentChipsExamplesTailwindReleaseLanes(); track lane) {
          <span tngChip [tngChipValue]="lane" [tngChipLabel]="lane" [tngChipDisabled]="isComponentChipsExamplesTailwindReleaseLaneLocked(lane)" class="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--tng-semantic-accent-success)_42%,var(--tng-semantic-border-subtle))] bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_12%,var(--tng-semantic-background-base))] px-3 py-2 text-sm font-medium text-[var(--tng-semantic-foreground-primary)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--tng-semantic-background-surface)_72%,transparent)] data-[disabled]:border-[var(--tng-semantic-border-subtle)] data-[disabled]:bg-[var(--tng-semantic-background-muted)] data-[disabled]:text-[var(--tng-semantic-foreground-muted)]">
            <span>{{ lane }}</span>
            <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_18%,transparent)] text-[0.8rem] leading-none text-[var(--tng-semantic-foreground-secondary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_26%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)]">&times;</button>
          </span>
        }
      </div>
    </tng-chips>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentChipsExamplesTailwindReleaseLaneSummary() }}</p>
</section>`;

const LOCKED_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-chips-examples-page',
  imports: [
    TngChipsComponent,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-examples-page.component.html',
  styleUrl: './chips-examples-page.component.css',
})
export class ChipsExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly filterPlainValues = signal<readonly string[]>([
    'Accessibility',
    'API docs',
    'Release notes',
  ]);
  protected readonly filterTailwindValues = signal<readonly string[]>(['Registry', 'Docs', 'CLI']);
  protected readonly lockedPlainValues = signal<readonly string[]>(['Stable', 'Preview', 'Locked']);
  protected readonly lockedTailwindValues = signal<readonly string[]>(['Stable', 'Preview', 'Canary']);

  protected readonly filterPlainSummary = computed(() => this.joinValues(this.filterPlainValues()));
  protected readonly filterTailwindSummary = computed(() => this.joinValues(this.filterTailwindValues()));
  protected readonly lockedPlainSummary = computed(() => this.joinValues(this.lockedPlainValues()));
  protected readonly lockedTailwindSummary = computed(() => this.joinValues(this.lockedTailwindValues()));

  protected readonly removablePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-chips-examples-filter-plain.component.ts', code: FILTER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-chips-examples-filter-plain.component.html', code: FILTER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-chips-examples-filter-plain.component.css', code: FILTER_PLAIN_CSS_CODE },
  ]);
  protected readonly removableTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-chips-examples-filter-tailwind.component.ts', code: FILTER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-chips-examples-filter-tailwind.component.html', code: FILTER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-chips-examples-filter-tailwind.component.css', code: FILTER_TAILWIND_CSS_CODE },
  ]);
  protected readonly lockedPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-chips-examples-locked-plain.component.ts', code: LOCKED_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-chips-examples-locked-plain.component.html', code: LOCKED_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-chips-examples-locked-plain.component.css', code: LOCKED_PLAIN_CSS_CODE },
  ]);
  protected readonly lockedTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-chips-examples-locked-tailwind.component.ts', code: LOCKED_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-chips-examples-locked-tailwind.component.html', code: LOCKED_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-chips-examples-locked-tailwind.component.css', code: LOCKED_TAILWIND_CSS_CODE },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onFilterPlainValuesChange(nextValues: readonly unknown[]): void {
    this.filterPlainValues.set(this.toStringArray(nextValues));
  }

  protected onFilterTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.filterTailwindValues.set(this.toStringArray(nextValues));
  }

  protected onLockedPlainValuesChange(nextValues: readonly unknown[]): void {
    this.lockedPlainValues.set(this.toStringArray(nextValues));
  }

  protected onLockedTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.lockedTailwindValues.set(this.toStringArray(nextValues));
  }

  protected isLockedPlainValue(value: string): boolean {
    return value === 'Locked';
  }

  protected isLockedTailwindValue(value: string): boolean {
    return value === 'Canary';
  }

  private toStringArray(nextValues: readonly unknown[]): readonly string[] {
    return nextValues.filter((value): value is string => typeof value === 'string');
  }

  private joinValues(values: readonly string[]): string {
    return values.length > 0 ? values.join(', ') : 'none';
  }
}
