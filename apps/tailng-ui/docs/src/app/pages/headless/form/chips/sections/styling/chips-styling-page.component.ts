import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

interface ContractRow {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
}

const HOST_TOKEN_GUIDANCE_CODE = String.raw`.docs-headless-chips-styling-shell[data-slot='chips'] {
  display: block;
}

.docs-headless-chips-styling-chip[data-slot='chip'] {
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1e3a8a;
}

.docs-headless-chips-styling-chip-remove[data-slot='chip-remove'][data-focused] {
  outline: 2px solid rgba(37, 99, 235, 0.28);
  outline-offset: 2px;
}`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_STYLING_PLAIN_RELEASE_OWNERS = Object.freeze([
  'Mina Lee',
  'Sanjay Patel',
  'Omar Aziz',
]);

@Component({
  selector: 'app-headless-chips-styling-plain-example',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-styling-plain-example.component.html',
  styleUrl: './headless-chips-styling-plain-example.component.css',
})
export class HeadlessChipsStylingPlainExampleComponent {
  readonly headlessChipsStylingPlainReleaseOwners = signal<readonly string[]>(
    HEADLESS_CHIPS_STYLING_PLAIN_RELEASE_OWNERS,
  );
  readonly headlessChipsStylingPlainSummary = computed(() => {
    const values = this.headlessChipsStylingPlainReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsStylingPlainValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsStylingPlainReleaseOwners.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isHeadlessChipsStylingPlainLocked(owner: string): boolean {
    return owner === 'Omar Aziz';
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-chips-styling-plain-shell-card">
  <div class="docs-headless-chips-styling-plain-header">
    <span class="docs-headless-chips-styling-plain-kicker">Release owners</span>
    <p class="docs-headless-chips-styling-plain-copy">
      Style the headless root directly, then own the projected pill styling in your page stylesheet.
    </p>
  </div>

  <section tngChips
    class="docs-headless-chips-styling-plain-shell"
    [tngChipsValues]="headlessChipsStylingPlainReleaseOwners()"
    (valuesChange)="onHeadlessChipsStylingPlainValuesChange($event)"
    [tngChipsAriaLabel]="'Release owners'"
  >
    <div class="docs-headless-chips-styling-plain-row">
      @for (owner of headlessChipsStylingPlainReleaseOwners(); track owner) {
        <span
          tngChip
          [tngChipValue]="owner"
          [tngChipLabel]="owner"
          [tngChipDisabled]="isHeadlessChipsStylingPlainLocked(owner)"
          class="docs-headless-chips-styling-plain-chip"
        >
          <span>{{ owner }}</span>
          <button tngChipRemove type="button" class="docs-headless-chips-styling-plain-chip-remove">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="docs-headless-chips-styling-plain-summary">Selected: {{ headlessChipsStylingPlainSummary() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-chips-styling-plain-shell-card {
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

.docs-headless-chips-styling-plain-shell {
  display: block;
  width: 100%;
  min-width: 0;
  color-scheme: light;
  --tng-semantic-background-base: #ffffff;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-foreground-primary: #0f172a;
}

.docs-headless-chips-styling-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.docs-headless-chips-styling-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.45rem 0.8rem;
}

.docs-headless-chips-styling-plain-chip[data-disabled] {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #94a3b8;
}

.docs-headless-chips-styling-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
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
}

.docs-headless-chips-styling-plain-chip-remove[data-focused] {
  outline: 2px solid rgba(37, 99, 235, 0.28);
  outline-offset: 2px;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_STYLING_TAILWIND_RELEASE_OWNERS = Object.freeze([
  'Abigail Chen',
  'Mina Lee',
  'Sanjay Patel',
]);

@Component({
  selector: 'app-headless-chips-styling-tailwind-example',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-styling-tailwind-example.component.html',
  styleUrl: './headless-chips-styling-tailwind-example.component.css',
})
export class HeadlessChipsStylingTailwindExampleComponent {
  readonly headlessChipsStylingTailwindReleaseOwners = signal<readonly string[]>(
    HEADLESS_CHIPS_STYLING_TAILWIND_RELEASE_OWNERS,
  );
  readonly headlessChipsStylingTailwindSummary = computed(() => {
    const values = this.headlessChipsStylingTailwindReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsStylingTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsStylingTailwindReleaseOwners.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owners</span>
    <p class="m-0 text-sm text-slate-600">
      Style the headless root directly, then own the projected pill styling directly in the template.
    </p>
  </div>

  <section tngChips
    class="block w-full min-w-0 [--tng-semantic-background-base:#ffffff] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-foreground-primary:#0f172a]"
    [tngChipsValues]="headlessChipsStylingTailwindReleaseOwners()"
    (valuesChange)="onHeadlessChipsStylingTailwindValuesChange($event)"
    [tngChipsAriaLabel]="'Release owners'"
  >
    <div class="flex flex-wrap gap-2">
      @for (owner of headlessChipsStylingTailwindReleaseOwners(); track owner) {
        <span tngChip [tngChipValue]="owner" [tngChipLabel]="owner" class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span>{{ owner }}</span>
          <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-violet-100 text-[0.8rem] leading-none text-violet-800 transition hover:bg-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessChipsStylingTailwindSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-headless-chips-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngChips,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-styling-page.component.html',
  styleUrl: './chips-styling-page.component.css',
})
export class HeadlessChipsStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly hostTokenGuidanceCode = HOST_TOKEN_GUIDANCE_CODE;
  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: '[data-slot="chips"]',
      appliedOn: 'Root shell',
      purpose: 'Stable hook for root layout, spacing, and any shell treatment you want to add.',
    },
    {
      selector: '[data-slot="chip"]',
      appliedOn: 'Projected chip item',
      purpose: 'Stable hook for the pill shell when you prefer attribute selectors over explicit classes.',
    },
    {
      selector: '[data-slot="chip-remove"]',
      appliedOn: 'Projected remove control',
      purpose: 'Stable hook for remove-button layout, hover, and focus styling.',
    },
    {
      selector: '[data-disabled]',
      appliedOn: 'Root, chip, remove control',
      purpose: 'Shared disabled-state hook reflected from the primitive contracts.',
    },
    {
      selector: '[data-focused]',
      appliedOn: 'Remove control',
      purpose: 'Focus hook on the remove button so you can draw a local ring without extra scripting.',
    },
  ]);

  protected readonly stylingPlainReleaseOwners = signal<readonly string[]>([
    'Mina Lee',
    'Sanjay Patel',
    'Omar Aziz',
  ]);
  protected readonly stylingTailwindReleaseOwners = signal<readonly string[]>([
    'Abigail Chen',
    'Mina Lee',
    'Sanjay Patel',
  ]);

  protected readonly stylingPlainSummary = computed(() => {
    const values = this.stylingPlainReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });
  protected readonly stylingTailwindSummary = computed(() => {
    const values = this.stylingTailwindReleaseOwners();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-styling-plain-example.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-styling-plain-example.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-styling-plain-example.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-styling-tailwind-example.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-styling-tailwind-example.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-styling-tailwind-example.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onStylingPlainValuesChange(nextValues: readonly unknown[]): void {
    this.stylingPlainReleaseOwners.set(this.toStringArray(nextValues));
  }

  protected onStylingTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.stylingTailwindReleaseOwners.set(this.toStringArray(nextValues));
  }

  protected isStylingPlainLocked(owner: string): boolean {
    return owner === 'Omar Aziz';
  }

  private toStringArray(nextValues: readonly unknown[]): readonly string[] {
    return nextValues.filter((value): value is string => typeof value === 'string');
  }
}
